import { HttpException, Injectable, Logger } from '@nestjs/common';
import { Axios } from 'axios';
import { getAxiosInstance } from '@/common/utils';
import { config } from '@/common/config';
import {
  ISecuritizeAuthorizeResponseData,
  ISecuritizeGetPreparedTransactionResponseData,
  ISecuritizeKycStatusResponseData,
  ISecuritizeService,
} from './interfaces';
import { BlockchainService } from '../blockchain/blockchain.service';
import { PROFILE_STATUS } from '@/db/enums';

const { baseUrl, secret, issuerId } = config.securitize;

const statuses = {
  IN_PROGRESS: ['processing', 'manual-review', 'pending', 'pending-aml', 'passed'],
  VERIFIED: ['verified'],
  UPDATES_REQUIRED: ['expired', 'none', 'rejected', 'updates-required', 'processing-error'],
};
@Injectable()
export class SecuritizeService implements ISecuritizeService {
  private api: Axios;
  private kycUrl: string = '/api/v1/securitize/kyc';
  constructor(private bcService: BlockchainService) {
    this.api = getAxiosInstance(baseUrl, {
      clientId: issuerId,
      Authorization: `Bearer ${secret}`,
    });
  }

  async subscribeToWebHookEvent(
    accessToken: string,
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
        'access-token': accessToken,
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
    const isAddressOnWList = this.bcService.isWalletWhitelistedOnSecuritize(address);

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
}
