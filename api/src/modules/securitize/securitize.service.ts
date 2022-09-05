import { Injectable, Logger } from '@nestjs/common';
import { Axios } from 'axios';
import { getAxiosInstance } from '@/common/utils';
import { config } from '@/common/config';
import {
  ISecuritizeAuthorizeResponseData,
  ISecuritizeGetPreparedTransactionResponseData,
  ISecuritizeKycStatusResponseData,
  ISecuritizeService,
} from './interfaces';

const { baseUrl, secret, issuerId } = config.securitize;

@Injectable()
export class SecuritizeService implements ISecuritizeService {
  constructor(
    private api: Axios = getAxiosInstance(baseUrl, {
      clientId: issuerId,
      Authorization: `Bearer ${secret}`,
    }),
  ) {}

  async authorize(code: string) {
    try {
      const data: ISecuritizeAuthorizeResponseData = await this.api.post('/auth/v1/authorize', {
        code,
      });

      if (data.accessToken || data.refreshToken) {
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
      const data: ISecuritizeKycStatusResponseData = await this.api.get(`/bc/v1/partners/${issuerId}/attestation`, {
        headers: {
          'access-token': accessToken,
        },
      });

      if (!data.status) {
        return null;
      }

      return data;
    } catch (e) {
      Logger.error(`[Securitize API] ${e}`);
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
      Logger.error(`[Securitize API] ${e}`);
      return null;
    }
  }
}
