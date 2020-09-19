# json-ts

[![Build Status](https://travis-ci.com/dhkatz/json-ts.svg?branch=master)](https://travis-ci.com/dhkatz/json-ts) ![npm (scoped)](https://img.shields.io/npm/v/@dhkatz/json-ts) ![npm](https://img.shields.io/npm/dt/@dhkatz/json-ts)
 
(De)serialize between JSON and JavaScript objects using the decorators design proposal.

## Installation
```bash
npm install @dhkatz/json-ts
```

## Usage

```typescript
import { deserialize, serialize } from '@dhkatz/json-ts';

deserialize(<type>, <json>);

serialize(<instance>);
```

## Example 
Here is a complex example, hopefully could give you an idea of how to use it (for more on how to use, checkout [/test] which are unit test cases).

Note that initializing the class properties to defaults (such as undefined) is necessary because of how TypeScript compilation works.

Properties that are not initialized are not listed as actual class keys in the JavaScript output.

```typescript
import { JsonProperty } from '@dhkatz/json-ts';

class Student {
    @JsonProperty('name')
    public fullName:string;
}

class Address {
    @JsonProperty('first-line')
    public firstLine: string;

    @JsonProperty('second-line')
    public secondLine: string;

    @JsonProperty()
    public student: Student;

    public city: string;
}

class Person {
    @JsonProperty('Name')
    public name:string;

    @JsonProperty('xing')
    public surname:string;

    public age:number;

    @JsonProperty({ type: Address, name: 'AddressArr' })
    public addressArr:Address[];

    @JsonProperty({ name: 'Address' })
    public address: Address;
}
```

Now here is what API server return, assume it is already parsed to JSON object.
```typescript
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
              "name": "Ailun"
          }
      },
      {
          "first-line": "Some where",
          "second-line": "Over Here",
          "city": "In This City",
          "student": {
              "name": "Ailun"
          }
      }
  ],
  "Address": {
      "first-line": "Some where",
      "second-line": "Over Here",
      "city": "In This City",
      "student": {
          "name": "Ailun"
  }
};
```

Simply, just map it use following code. The mapping is based on `@JsonProperty` decorator meta data.

```typescript
import { deserialize } from '@dhkatz/json-ts';

const person = deserialize(Person, json);
```

If you want to reverse the action, from the other way round:

```typescript
import { serialize } from '@dhkatz/json-ts';

const json = serialize(person);
```

## Notice

### Decorators

Remember to add: <b>experimentalDecorators</b> and <b>emitDecoratorMetadata</b> in your tsconfig.json. 
This is essential to enable decorator support for your typescript program. Example shown as followings:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```
