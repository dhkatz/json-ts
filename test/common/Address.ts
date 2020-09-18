import { JsonProperty } from '../../src';
import { Student } from './Student';

export class Address {
  @JsonProperty('first-line')
  public firstLine: string;

  @JsonProperty('second-line')
  public secondLine: string;

  @JsonProperty({ type: Student })
  public student: Student;

  public city: string;
}
