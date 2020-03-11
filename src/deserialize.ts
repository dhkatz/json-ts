import { IDecoratorMetaData, METADATA_KEY } from './metadata'
import { isPrimitive, Json } from './util'

/**
 * deserialize
 *
 * @function
 * @param {{new():T}} type, class type which is going to initialize and hold a mapping json
 * @param {Object} json, input json object which to be mapped
 * @param args Extra arguments passed to the deserialized class constructor
 * @return {T} return mapped object
 */
export function deserialize<T, U extends Json = Json>(type: { new (...args: any[]): T }, json: U, ...args: any[]): U extends Json ? T : T[];
export function deserialize<T>(type: { new (...args: any[]): T }, json: Json, ...args: any[]): T | T[] {
  if (type == undefined || json == undefined) {
    return undefined;
  }

  if (typeof json !== 'object') {
    return undefined;
  }

  if (Array.isArray(json)) {
    return json.map((value: Json) => deserialize(type, value));
  }

  let instance = args.length > 0 ? new type(...args) : new type();

  if (instance instanceof Object && Object.keys(instance).length === 0) {
    (instance as Record<string, any>) = json;
  }

  for (const key of Object.keys(instance)) {
    const metadata: IDecoratorMetaData<T> = Reflect.getMetadata(METADATA_KEY, instance, key);

    if (metadata && metadata.converter) {
      instance[key] = metadata.converter.fromJson(json[metadata.name || key]);
    } else {
      instance[key] = metadata ? deserializeProp(metadata, instance, json, key) : json[key] || instance[key];
    }
  }

  return instance;
}

function deserializeProp<T>(metadata: IDecoratorMetaData<any>, instance: T, json: Json, key: string): any {
  const index = metadata.name || key;
  const value: Json = json ? json[index] : null;

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
