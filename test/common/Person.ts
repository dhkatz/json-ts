import { JsonProperty } from '../../src';
import { Address } from './Address';

export class Person {
  @JsonProperty('Name')
  public name!: string;

  @JsonProperty('xing')
  public surname!: string;

  public age!: number;

  @JsonProperty({ type: Address, name: 'AddressArr' })
  public addressArr!: Address[];

  @JsonProperty({ type: Address, name: 'Address' })
  public address!: Address;

  public constructor(public client?: { ass: string }) {}
}
