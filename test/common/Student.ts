import { JsonProperty } from '../../src';
import { DateConverter } from './DateConverter';

export class Student {
  @JsonProperty('name')
  public fullName: string;

  @JsonProperty({ name: 'dob', converter: DateConverter })
  public dateOfBirth: Date;
}
