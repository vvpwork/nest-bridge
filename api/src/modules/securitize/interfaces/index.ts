export interface ISecuritizeAuthorizeResponseData {
  investorId: string;
  accessToken: string;
  refreshToken: string;
  expiration: string;
}

export interface ISecuritizeKycStatusResponseData {
  status: string;
}

export interface ISecuritizeGetPreparedTransactionResponseData {
  preparedTransaction: string;
}

export interface ISecuritizeService {
  /**
   * This method use to authorize and get access token
   *
   * @param code
   */
  authorize(code: string): Promise<ISecuritizeAuthorizeResponseData | null>;

  /**
   * This method use to get status KYC for current user
   *
   * @param accessToken
   */
  getKycStatus(accessToken: string): Promise<ISecuritizeKycStatusResponseData | null>;

  /**
   * This method use to add walletAddress to white list
   *
   * @param accessToken
   * @param walletAddress
   */
  getTransactionForWhitelist(
    accessToken: string,
    walletAddress: string,
  ): Promise<ISecuritizeGetPreparedTransactionResponseData | null>;
}
