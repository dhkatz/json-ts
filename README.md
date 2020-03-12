# json-typescript-mapper

[![Build Status](https://travis-ci.com/dhkatz/json-typescript-mapper.svg?branch=master)](https://travis-ci.com/dhkatz/json-typescript-mapper)

(De)serialize between JSON and JavaScript objects using the decorators design proposal.

## Installation
```bash
npm install dhkatz/json-typescript-mapper
```

## Usage

```typescript
import { deserialize, serialize } from 'json-typescript-mapper';

deserialize(<type>, <json>);

serialize(<instance>);
```

## Example 
Here is a complex example, hopefully could give you an idea of how to use it (for more on how to use, checkout [/test] which are unit test cases).

Note that initializing the class properties to defaults (such as undefined) is necessary because of how TypeScript compilation works.

Properties that are not initialized are not listed as actual class keys in the JavaScript output.

```typescript
import { JsonProperty } from 'json-typescript-mapper';

class Student {
    @JsonProperty('name')
    public fullName:string;

    public constructor() {
        this.fullName = undefined;
    }
}

class Address {
    @JsonProperty('first-line')
    public firstLine: string;

    @JsonProperty('second-line')
    public secondLine: string;

    @JsonProperty({clazz: Student})
    public student: Student;

    public city: string;

    public constructor() {
        this.firstLine = undefined;
        this.secondLine = undefined;
        this.city = undefined;
        this.student = undefined
    }
}

class Person {
    @JsonProperty('Name')
    public name:string;

    @JsonProperty('xing')
    public surname:string;

    public age:number;

    @JsonProperty({ type: Address, name: 'AddressArr' })
    public addressArr:Address[];

    @JsonProperty({ type: Address, name: 'Address' })
    public address:Address;

    public constructor() {
        this.name = undefined;
        this.surname = undefined;
        this.age = undefined;
        this.addressArr = undefined;
        this.address = undefined;
    }
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

Simply, just map it use following code. The mapping is based on <@JsonProperty> decorator meta data.

```typescript
import { deserialize } from 'json-typescript-mapper';

const person = deserialize(Person, json);
```

If you want to reverse the action, from the other way round:

```typescript
import { serialize } from 'json-typescript-mapper';

const json = serialize(person);
```

## Notice
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
