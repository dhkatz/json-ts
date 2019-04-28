import { deserialize, JsonProperty, ICustomConverter } from './src';

export const DateConverter: ICustomConverter<Date> = {
  fromJson(data: any): Date {
    return data ? new Date(data) : undefined;
  },
  
  toJson(): any {
    return 'some-date';
  }
};

class Student {
  @JsonProperty('name')
  public fullName: string;
  
  @JsonProperty({ name: 'dob', converter: DateConverter })
  public dateOfBirth: Date;
  
  public constructor() {
    this.dateOfBirth = undefined;
    this.fullName = undefined;
  }
}

class Address {
  @JsonProperty('first-line')
  public firstLine: string;
  
  @JsonProperty('second-line')
  public secondLine: string;

  @JsonProperty({ type: Student })
  public student: Student;

  public city: string;
  
  public constructor() {
    this.firstLine = undefined;
    this.secondLine = undefined;
    this.city = undefined;
    this.student = undefined;
  }
}

class Person {
  @JsonProperty('Name')
  public name: string;

  @JsonProperty('xing')
  public surname: string;

  public age: number;

  @JsonProperty({ type: Address, name: 'AddressArr' })
  public addressArr: Address[];

  @JsonProperty({ type: Address, name: 'Address' })
  public address: Address;
  
  public constructor() {
    this.name = undefined;
    this.surname = undefined;
    this.age = undefined;
    this.addressArr = undefined;
    this.address = undefined;
  }
}

const addressjson = {
  "first-line": "Some where",
  "second-line": "Over Here",
  "city": "In This City",
  "student": {
    name: "Ailun"
  }
};

const address = deserialize(Address, addressjson);

// eslint-disable-next-line
console.log(address);

const json = {
  "Name": "Mark",
  "xing": "Galea",
  "age": 30,
  "AddressArr": [
    {
      "first-line": "Some where",
      "second-line": "Over Here",
      "city": "In This City",
      "student": {
        name: "Ailun"
      }
    },
    {
      "first-line": "Some where",
      "second-line": "Over Here",
      "city": "In This City",
      "student": {
        name: "Ailun"
      }
    }
  ],
  "Address": {
    "first-line": "Some where",
    "second-line": "Over Here",
    "city": "In This City",
    "student": {
      name: "Ailun"
    }
  }
};

const person = deserialize(Person, json);

// eslint-disable-next-line
console.log(person.addressArr);
