import { deserialize } from '../src';
import { Student } from './common/Student';
import { Person } from './common/Person';
import { Address } from './common/Address';
import { Dog } from './common/Animal';

describe('index()', () => {
  it('simple json object #1', () => {
    const json: any = {
      Name: 'Mark',
      xing: 'Galea',
      age: 30,
      AddressArr: [],
      Address: null,
    };
    let person = new Person({ ass: 'succ ' });
    person = deserialize(person, json);
    expect(person.client).toBeDefined();
    expect(person.address).toBeUndefined();
    expect(person.name).toEqual('Mark');
    expect(person.surname).toEqual('Galea');
    expect(person.addressArr).toHaveLength(0);
  });

  it('simple json object #2', () => {
    const addressjson = {
      'first-line': 'Some where',
      'second-line': 'Over Here',
      city: 'In This City',
      student: {
        name: 'Ailun',
      },
    };
    const address = deserialize(Address, addressjson);
    expect(address.firstLine).toEqual('Some where');
    expect(address.secondLine).toEqual('Over Here');
    expect(address.city).toEqual(undefined);
    expect(address.student).toBeInstanceOf(Student);
    expect(address.student.fullName).toEqual('Ailun');
  });

  it('complex json object #1', () => {
    const json = {
      Name: 'Mark',
      xing: 'Galea',
      age: 30,
      AddressArr: [
        {
          'first-line': 'Some where',
          'second-line': 'Over Here',
          city: 'In This City',
          student: {
            name: 'Ailun',
          },
        },
        {
          'first-line': 'Some where',
          'second-line': 'Over Here',
          city: 'In This City',
          student: {
            name: 'Ailun',
          },
        },
      ],
      Address: {
        'first-line': 'Some where',
        'second-line': 'Over Here',
        city: 'In This City',
        student: {
          name: 'Ailun',
        },
      },
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
      NameTest: 'Mark',
    };
    const person = deserialize(Person, json);
    expect(person.name).toBeUndefined();
  });

  it('should use a custom converter if available', () => {
    const json = {
      name: 'John Doe',
      dob: '1995-11-10',
    };
    const student = deserialize(Student, json);
    expect(student.fullName).toEqual('John Doe');
    expect(student.dateOfBirth).toBeInstanceOf(Date);
    expect(student.dateOfBirth.toString()).toEqual(new Date('1995-11-10').toString());
  });

  it('deseralizes with child classes', () => {
    const json = { name: 'Max', breed: 'Beagle' };

    const dog = deserialize(Dog, json);
    expect(dog.name).toEqual('Max');
    expect(dog.breed).toEqual('Beagle');
  });
});
