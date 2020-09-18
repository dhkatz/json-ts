import { JsonProperty } from '../../src';
import { mixin } from '../mixin';

export class Animal {
  @JsonProperty('name')
  public name: string;
}

export class Dog extends Animal {
  @JsonProperty('breed')
  public breed: string;
}

class Meows {
  public meow(): string {
    return 'Meow!';
  }
}

export interface Cat extends Animal, Meows {}

@mixin(Meows)
export class Cat extends Animal {
  @JsonProperty('coat')
  public coat: number;
}
