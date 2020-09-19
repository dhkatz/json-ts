import { serialize, JsonProperty } from '../src';
import { DateConverter } from './common/DateConverter';

describe('serialize', () => {
  it('should use the property name given in the meta data', () => {
    class ClassWithPrimitiveProp {
      @JsonProperty('theName')
      public name!: string;
    }
    const instance = new ClassWithPrimitiveProp();
    instance.name = 'Jim';
    const serialized = serialize(instance);
    expect(serialized.theName).toEqual('Jim');
  });

  describe('primitive types', () => {
    const primitiveTypes = ['some-string', true, 25, new Number(25), new Boolean(true)];

    primitiveTypes.forEach((primitiveType) => {
      it(`should keep ${typeof primitiveType} as is`, () => {
        class PrimitiveProp {
          @JsonProperty('someProp')
          public someProp = primitiveType;
        }
        const instance = new PrimitiveProp();
        const serialized = serialize(instance);
        expect(serialized.someProp).toEqual(primitiveType);
      });
    });
  });

  it('should keep unspecified objects as is', () => {
    class ClassWithUnspecObject {
      @JsonProperty('date')
      public date: Date = new Date();
    }
    const instance = new ClassWithUnspecObject();
    const serialized = serialize(instance);
    const date = instance.date;
    expect(serialized.date).toEqual(new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString());
  });

  it('should use custom converter if available', () => {
    class ClassWithCustomConv {
      @JsonProperty({ name: 'date', converter: DateConverter })
      public date: Date = new Date();
    }
    const instance = new ClassWithCustomConv();
    const serialized = serialize(instance);
    expect(serialized.date).toEqual('some-date');
  });

  it('should exclude properties if specified', () => {
    class ClassWithExcludedProp {
      @JsonProperty('name')
      public name: string = 'John';

      @JsonProperty({ name: 'lastName', exclude: true })
      public lastName: string = 'Doe';
    }
    const instance = new ClassWithExcludedProp();
    const serialized = serialize(instance);
    expect(serialized.name).toEqual('John');
    expect(serialized.lastName).toBeUndefined();
  });

  it('should work recursively if type is specified in meta data', () => {
    class OtherClass {
      @JsonProperty({ name: 'date', converter: DateConverter })
      public date: Date = new Date();
    }
    class ClassWithClassProp {
      @JsonProperty({ name: 'other', type: OtherClass })
      public other: OtherClass = new OtherClass();
    }
    const instance = new ClassWithClassProp();
    const serialized = serialize(instance);
    expect(serialized.other.date).toEqual('some-date');
  });

  describe('Arrays', () => {
    it('should throw as is if no type is specified for array property', () => {
      expect(() => {
        class ClassWithArrayProp {
          @JsonProperty('items')
          public items: Date[] = [new Date(), new Date()];
        }
      }).toThrow(TypeError);
    });

    it('should apply serialize for all array items if type is specified', () => {
      class OtherClass {
        @JsonProperty({ name: 'date', converter: DateConverter })
        public date: Date = new Date();
      }
      class ClassWithArrayProp {
        @JsonProperty({ name: 'items', type: OtherClass })
        public items: OtherClass[] = [new OtherClass(), new OtherClass()];
      }
      const instance = new ClassWithArrayProp();
      const serialized = serialize(instance);
      expect(serialized.items).toBeInstanceOf(Array);
      expect(serialized.items.length).toEqual(2);
      expect(serialized.items[0].date).toEqual('some-date');
      expect(serialized.items[1].date).toEqual('some-date');
    });
  });
});
