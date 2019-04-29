import { deserialize, JsonProperty } from '../src';
import { DateConverter } from './common/dateconverter';

class Student {
  @JsonProperty('name')
  public fullName: string;
  
  @JsonProperty({ name: 'dob', converter: DateConverter })
  public dateOfBirth: Date;
  
  public constructor() {
    this.fullName = undefined;
    this.dateOfBirth = undefined;
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

  public client: { ass: string };
  
  public constructor(client?: { ass: string }) {
    this.client = client;

    this.name = undefined;
    this.surname = undefined;
    this.age = undefined;
    this.addressArr = undefined;
    this.address = undefined;
  }
}

describe('index()', () => {
  it('simple json object #1', () => {
    const json = {
      "Name": "Mark",
      "xing": "Galea",
      "age": 30,
      "AddressArr": [],
      "Address": null
    };
    const person = deserialize(Person, json, { ass: 'succ '});
    expect(person.client).toBeDefined();
    expect(person.address).toBeUndefined();
    expect(person.name).toEqual("Mark");
    expect(person.surname).toEqual("Galea");
    expect(person.addressArr).toHaveLength(0);
  });
  
  it('simple json object #2', () => {
    const addressjson = {
      "first-line": "Some where",
      "second-line": "Over Here",
      "city": "In This City",
      "student": {
        name: "Ailun"
      }
    };
    const address = deserialize(Address, addressjson);
    expect(address.firstLine).toEqual("Some where");
    expect(address.secondLine).toEqual("Over Here");
    expect(address.city).toEqual("In This City");
    expect(address.student).toBeInstanceOf(Student);
    expect(address.student.fullName).toEqual('Ailun');
  });
  
  it('complex json object #1', () => {
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
    expect(person.address).toBeInstanceOf(Address);
    expect(person.age).not.toBeNaN();
    expect(typeof person.name).toBe('string');
    expect(person.address).toBeInstanceOf(Address);
    expect(person.addressArr.length).toEqual(2);
    expect(person.address.student.fullName).toEqual('Ailun');
  });
  
  it('empty json object #1', () => {
    const json = {};
    const person = deserialize(Person, json);
    expect(person.address).toBeUndefined();
    expect(person.name).toBeUndefined();
    expect(person.surname).toBeUndefined();
    expect(person.addressArr).toBeUndefined();
  });
  
  it('empty json object #2', () => {
    const json: any = null;
    const person = deserialize(Person, json);
    expect(person).toBeUndefined();
  });
  
  it('empty json object #3', () => {
    const json: any = undefined;
    const person = deserialize(Person, json);
    expect(person).toBeUndefined();
  });
  
  it('invalid primitive value #1', () => {
    const json = 123;
    const person = deserialize(Person, json as any);
    expect(person).toBeUndefined();
  });
  
  it('invalid primitive value #2', () => {
    const json = '';
    const person = deserialize(Person, json as any);
    expect(person).toBeUndefined();
  });
  
  it('invalid primitive value #3', () => {
    const json = NaN;
    const person = deserialize(Person, json as any);
    expect(person).toBeUndefined();
  });
  
  it('invalid json object #1', () => {
    const json = {
      "NameTest": "Mark",
    };
    const person = deserialize(Person, json);
    expect(person.name).toBeUndefined();
  });
  
  it('should use a custom converter if available', () => {
    const json = {
      name: "John Doe",
      dob: "1995-11-10"
    };
    const student = deserialize(Student, json);
    expect(student.fullName).toEqual('John Doe');
    expect(student.dateOfBirth).toBeInstanceOf(Date);
    expect(student.dateOfBirth.toString()).toEqual(new Date("1995-11-10").toString());
  });
});
