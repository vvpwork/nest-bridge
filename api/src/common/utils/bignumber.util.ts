import BigNumber from 'bignumber.js';
import { IBigNumberUtile } from '../interfaces';

/**
 * This class is extended BignumberJS with new methods
 */
export class Bn extends BigNumber implements IBigNumberUtile {
  private readonly royaltyDecimal: number = 2;

  constructor(data: BigNumber.Value) {
    super(data || 0);
  }

  toView(precision: number = 2) {
    const bn = this.div(new BigNumber(10).pow(this.royaltyDecimal));
    return Number(bn).toFixed(precision);
  }

  toBaseUnitAmount(decimal: number, type: 'bn' | 'string' = 'string'): string | BigNumber {
    const bn = this.times(new BigNumber(10).pow(decimal));
    return type === 'string' ? bn.toFormat(0).split(',').join('') : bn;
  }

  toUnitAmount(decimal: number, type: 'bn' | 'string' = 'string'): string | BigNumber {
    const bn = this.div(new BigNumber(10).pow(decimal));
    return type === 'string' ? bn.toFormat(0).split(',').join('') : bn;
  }

  static multiplyBy(
    firstAmount: string | BigNumber | number,
    secondAmount: string | BigNumber | number,
  ) {
    const first = new BigNumber(firstAmount);
    const second = new BigNumber(secondAmount);
    return first.multipliedBy(second);
  }
}
