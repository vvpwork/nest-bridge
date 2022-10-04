/* eslint-disable max-len */
import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Axios } from 'axios';
import { PROFILE_STATUS } from '@DB/enums';
import { getAxiosInstance } from '@/common/utils';
import { config } from '@/common/config';
import {
  IGetInvestorInfo,
  ISecuritizeAuthorizeResponseData,
  ISecuritizeGetPreparedTransactionResponseData,
  ISecuritizeKycStatusResponseData,
  ISecuritizeService,
} from './interfaces';
import { BlockchainService } from '../blockchain/blockchain.service';
import { SECURITIZE_DOMAIN_ID, SECURITIZE_TOKEN_ID } from '@/common/constants';

const { baseUrl, secret, issuerId, apiKey } = config.securitize;

const statuses = {
  IN_PROGRESS: ['processing', 'manual-review', 'pending', 'pending-aml', 'passed'],
  VERIFIED: ['verified'],
  UPDATES_REQUIRED: ['expired', 'none', 'rejected', 'updates-required', 'processing-error'],
};
@Injectable()
export class SecuritizeService implements ISecuritizeService {
  private api: Axios;
  private publicApi: Axios;
  private kycUrl: string = '/api/v1/securitize/kyc';
  constructor(private bcService: BlockchainService) {
    this.api = getAxiosInstance(baseUrl, {
      clientId: issuerId,
      Authorization: `Bearer ${secret}`,
    });

    this.publicApi = getAxiosInstance('https://public-api.sandbox.securitize.io', {
      Authorization: ` apiKey ${apiKey}`,
    });
  }

  async subscribeToWebHookEvent(
    domainId: string,
    eventType: string = 'domain-investor-kyc-update',
    isActive: boolean = true,
  ) {
    const payload = {
      domainId,
      eventType,
      payloadUrl: `${this.kycUrl}/${domainId}`,
      isActive,
    };

    const data = await this.api.post('v1/webhooks/subscriptions', payload, {
      headers: {
        Authorization: `apiKey ${apiKey}`,
      },
    });

    return data;
  }

  async authorize(code: string) {
    try {
      const data: ISecuritizeAuthorizeResponseData = await this.api.post('/auth/v1/authorize', {
        code,
      });
      Logger.log('Securitize auth', data);

      if (!data.accessToken || !data.refreshToken) {
        return null;
      }
      return data;
    } catch (e) {
      Logger.error(`[Securitize API] ${e}`);
      return null;
    }
  }

  async getKycStatus(accessToken: string) {
    try {
      const data: ISecuritizeKycStatusResponseData = await this.api.get(
        `/bc/v1/partners/${config.securitize.issuerId}/attestation`,
        {
          headers: {
            'access-token': accessToken,
          },
        },
      );

      if (!data.status) {
        return null;
      }

      return data;
    } catch (e) {
      Logger.error(`[Securitize service] ${e}`);
      return null;
    }
  }

  async getTransactionForWhitelist(accessToken: string, walletAddress: string) {
    try {
      const data: ISecuritizeGetPreparedTransactionResponseData = await this.api.get(
        `/bc/v1/partners/${issuerId}/wallets/${walletAddress}/whitelist`,
        {
          headers: {
            'Content-Type': 'application/json',
            'access-token': accessToken,
          },
        },
      );

      if (!data.preparedTransaction) {
        return null;
      }
      return data;
    } catch (e) {
      Logger.error(`[Securitize service] ${e}`);
      return null;
    }
  }

  async isPartner(address: string) {
    return this.bcService.isAddressPartner(address);
  }

  private verifyKycStatus(status: string): PROFILE_STATUS {
    switch (true) {
      case statuses.IN_PROGRESS.includes(status):
        return PROFILE_STATUS.IN_PROGRESS;
      case statuses.VERIFIED.includes(status):
        return PROFILE_STATUS.VERIFIED;
      case statuses.UPDATES_REQUIRED.includes(status):
        return PROFILE_STATUS.UPDATES_REQUIRED;
      default:
        return PROFILE_STATUS.UPDATES_REQUIRED;
    }
  }

  async login(code: string, address: string) {
    const authResult = await this.authorize(code);

    if (!authResult) throw new HttpException('Securitize auth error', 403);
    const { investorId, accessToken, refreshToken } = authResult;
    const kycResult = await this.getKycStatus(accessToken);
    let statusKyc: PROFILE_STATUS = this.verifyKycStatus(kycResult.status);
    Logger.log(statusKyc, kycResult, 'Securitize service status KYC');

    const isAddressOnWList = await this.bcService.isWalletWhitelistedOnSecuritize(address);

    let whiteListTransaction: any = null;
    if (statusKyc === 'VERIFIED' && !isAddressOnWList) {
      try {
        whiteListTransaction = await this.getTransactionForWhitelist(accessToken, address);
      } catch (e) {
        Logger.error('[Securitize service] error add white list', e);
        statusKyc = PROFILE_STATUS.CONTACT_SUPPORT;
      }
    }
    const isPartner = await this.isPartner(address);
    if (statusKyc !== 'VERIFIED') {
      this.subscribeToWebHookEvent(investorId)
        .then((status: any) => Logger.log(status))
        .catch((er: any) => Logger.error(er));
    }

    return {
      whiteListTransaction,
      address,
      investorId,
      refreshToken,
      accessToken,
      statusKyc,
      isPartner,
    };
  }

  // TODO need tot test
  async getInvestorInfo(externalId: string) {
    try {
      const url = `v1/domains/${SECURITIZE_DOMAIN_ID}/investors/${externalId}/token-info?tokenId=${SECURITIZE_TOKEN_ID}`;
      const investorInfo: IGetInvestorInfo = await this.publicApi.get(url);
      return investorInfo;
    } catch (err) {
      Logger.error(err, 'Securitize service getInvestorInfo error: ');
      return {};
    }
  }
}
