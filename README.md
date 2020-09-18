# json-ts

[![Build Status](https://travis-ci.com/dhkatz/json-ts.svg?branch=master)](https://travis-ci.com/dhkatz/json-ts)

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

### Property Initialization

Properties that are not initialized to any value are also
 not visible the Reflect library or this library!
 
If you do not give a property a default value, at least set
it to `undefined` inline or in the constructor.

```typescript
class User {
  public name: string = ''; // Ok
  // public name: string = undefined; // Also, ok

  public constructor() {
    this.name = ''; // Ok
    // this.name = undefined; // Also ok
  }
}
```
 
Because of this I recommend also adding <b>strictPropertyInitialization</b> to
tsconfig.json as well!

```json
{
  "compilerOptions": {
    "strictPropertyInitialization": true
  }
}
```
