import { JsonProperty } from '../../src';

export class Animal {
  @JsonProperty('name')
  public name: string;
}

export class Dog extends Animal {
  @JsonProperty('breed')
  public breed: string;
}
