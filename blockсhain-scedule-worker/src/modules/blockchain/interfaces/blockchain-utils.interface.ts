export interface IBlockchainUtils {
  /**
   * This method check is user add to whitelist securitize
   * @param address - user address
   * @returns - Promise<boolean>
   */
  isWalletWhitelistedOnSecuritize(address: string): Promise<boolean>;

  /**
   * This method check status fro user address
   * @param address - user address
   * @returns - Promise<boolean>
   */
  isAddressPartner(address: string): Promise<boolean>;

  /**
   * This method validate user address for ETH
   * @param address - eth address
   */
  isEthAddress(address: string): boolean;
}
