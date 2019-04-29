import 'reflect-metadata';

export interface JSONObject {
  [key: string]: JSONType;
}

export type JSONType = string | number | JSONArray | JSONObject | boolean | null;

// eslint-disable-next-line
export interface JSONArray extends Array<JSONType> {}


/**
* Decorator variable name
*
* @const
*/
const METADATA_KEY = 'JsonProperty';

/**
* When custom mapping of a property is required.
*
* @interface
*/
export interface ICustomConverter<T> {
  fromJson(data: any): T;
  toJson(data: T): any;
}

/**
* IDecoratorMetaData<T>
* DecoratorConstraint
*
* @interface
* @property {ICustomConverter} customConverter, will be used for mapping the property, if specified
* @property {boolean} excludeToJson, will exclude the property for serialization, if true
*/
export interface IDecoratorMetaData<T> {
  name?: string;
  type?: { new(): T };
  converter?: ICustomConverter<T>;
  exclude?: boolean;
}

/**
* DecoratorMetaData
* Model used for decoration parameters
*
* @class
* @property {string} name, indicate which json property needed to map
* @property {string} type, if the target is not primitive type, map it to corresponding class
*/
export class DecoratorMetaData<T> implements IDecoratorMetaData<T> {
  public constructor(public name: string, public type?: { new(): T }) {
  }
}

/**
* JsonProperty
*
* @function
* @param {IDecoratorMetaData<T>|string} metadata Encapsulate it to DecoratorMetaData for standard use
* @return {(target: object, targetKey: string | symbol) => void} Decorator function
*/
export function JsonProperty<T>(metadata?: IDecoratorMetaData<T> | string): (target: object, targetKey: string | symbol) => void {
  if (!['string', 'object'].some(value => typeof metadata === value)) {
    throw new Error('JsonProperty decorator options must be of type \'string\' or \'IDecoratorMetaData\'!');
  }

  const decorator = typeof metadata === 'string' ? new DecoratorMetaData<T>(metadata) : metadata;

  return Reflect.metadata(METADATA_KEY, decorator);
}

function deserializeProp<T>(metadata: IDecoratorMetaData<any>, instance: T, json: JSONObject, key: string): any {
  const index = metadata.name || key;
  const value: JSONType = json ? json[index] : null;

  const options: IDecoratorMetaData<any> = Reflect.getMetadata(METADATA_KEY, instance, key);
  const type: any = Reflect.getMetadata('design:type', instance, key) || options.type;

  if (type == undefined) {
    return json[index];
  }

  if (Array.isArray(type) || type === Array) {
    if (options && options.type || typeof type === 'object') {
      if (value && Array.isArray(value)) {
        return value.map((item: any) => deserialize(options.type, item));
      }
      return;
    } else {
      return value;
    }
  }

  if (!isPrimitive(type) && typeof value === 'object' && !Array.isArray(value)) {
    return deserialize(type, value);
  }

  if (type === Boolean) {
    if (json[index] === undefined) {
      return undefined;
    }

    return Boolean(json[index]);
  }
  
  return json[index];
}

/**
* deserialize
*
* @function
* @param {{new():T}} type, class type which is going to initialize and hold a mapping json
* @param {Object} json, input json object which to be mapped
*
* @return {T} return mapped object
*/
export function deserialize<T, U extends JSONObject | JSONArray = JSONObject>(type: { new(): T }, json: U): U extends JSONObject ? T : T[];
export function deserialize<T>(type: { new(): T }, json: JSONObject | JSONArray): T | T[] {
  if (type == undefined || json == undefined) {
    return undefined;
  }

  if (typeof json !== 'object') {
    return undefined;
  }

  if (Array.isArray(json)) {
    return json.map((value: JSONObject) => deserialize(type, value));
  }

  const instance = new type();
  
  Object.keys(instance).forEach((key: string) => {
    const metadata: IDecoratorMetaData<T> = Reflect.getMetadata(METADATA_KEY, instance, key);

    const value = metadata ? metadata.converter ? metadata.converter.fromJson(json[metadata.name || key]) : deserializeProp(metadata, instance, json, key) : json[key];

    instance[key] = value;    
  });
  
  return instance;
}

/**
* Serialize: Creates a JSON serializable object from the provided object instance.
* Only @JsonProperty decorated properties in the model instance are processed.
*
*/
export function serialize<T extends object = any, U extends object = any>(instance: T | T[]): T extends any[] ? U[] : U;
export function serialize<T extends object = any, U extends object = any>(instance: T | T[]): U | U[] {
  if (Array.isArray(instance)) {
    return instance.map((value: T) => serialize(value));
  }
  
  const obj: U = Object.create(null);
  Object.keys(instance).forEach(key => {
    const metadata: IDecoratorMetaData<T> = Reflect.getMetadata(METADATA_KEY, instance, key);
    obj[metadata && metadata.name ? metadata.name : key] = serializeProperty(metadata, instance[key]);
  });

  return obj;
}

/**
* Prepare a single property to be serialized to JSON.
*
* @param metadata
* @param prop
* @returns {any}
*/
function serializeProperty(metadata: IDecoratorMetaData<any>, prop: any): any {
  if (prop == undefined) {
    return prop;
  }
  
  if (!metadata || metadata.exclude === true) {
    return;
  }
  
  if (metadata.converter) {
    return metadata.converter.toJson(prop);
  }
  
  if (!metadata.type) {
    return prop instanceof Date ? new Date(prop.getTime() - (prop.getTimezoneOffset() * 60000)).toISOString() : prop;
  }
  
  if (Array.isArray(prop)) {
    return prop.map((item: any) => serialize(item));
  }
  
  return serialize(prop);
}

function isPrimitive(obj: unknown): obj is string | boolean | number | NumberConstructor | StringConstructor | BooleanConstructor {
  return !!(['string', 'boolean', 'number'].indexOf((typeof obj)) > -1 || (obj instanceof String || obj === String ||
  obj instanceof Number || obj === Number ||
  obj instanceof Boolean || obj === Boolean));
}
