import { JsonProperty } from '../../src';

export class Student {
  @JsonProperty('name')
  public fullName!: string;

  @JsonProperty({ name: 'dob', type: Date })
  public dateOfBirth!: Date;
}
