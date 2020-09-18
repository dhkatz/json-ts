import { IPropertyMetadata } from './PropertyMetadata';
import { Constructor, isPrimitive, Json, JsonArray, JsonObject } from './util';
import { PropertyMetadataMap } from './index';

/**
 * deserialize
 *
 * @function
 * @param {Constructor} type, class type which is going to initialize and hold a mapping json
 * @param {Json} json, input json object which to be mapped
 * @return {T} return mapped object
 */
export function deserialize<T, U extends Json>(type: T | Constructor<T>, json: U): T;
export function deserialize<T, U extends JsonArray>(type: T | Constructor<T>, json: U): T[];
export function deserialize<T, U extends JsonObject>(type: T | Constructor<T>, json: U): T;
export function deserialize<T>(type: T | Constructor<T>, json: JsonObject | JsonArray): T | T[] {
  if (type == undefined || json == undefined) {
    return undefined;
  }

  if (typeof json !== 'object') {
    return undefined;
  }

  if (Array.isArray(json)) {
    return json.map((value: Json) => deserialize(type, value));
  }

  let constructor = type instanceof Function ? type : type.constructor;
  let instance = type instanceof Function ? new type() : type;

  const properties: Map<string, IPropertyMetadata<T>> = PropertyMetadataMap.find(constructor);

  for (const [key, metadata] of properties.entries()) {
    if (metadata && metadata.converter) {
      instance[key] = metadata.converter.fromJson(json[metadata.name || key]);
    } else {
      instance[key] = metadata ? deserializeProp(metadata, instance, json, key) : json[key] || instance[key];
    }
  }

  return instance;
}

function deserializeProp<T>(metadata: IPropertyMetadata<T>, instance: T, json: Json, key: string): any {
  const index = metadata.name || key;
  const value: Json = json ? json[index] : undefined;

  const type: any = metadata.type || Reflect.getMetadata('design:type', instance, key);

  if (type == undefined) {
    return json[index];
  }

  if (Array.isArray(type) || type === Array) {
    if ((metadata && metadata.type) || typeof type === 'object') {
      if (value && Array.isArray(value)) {
        return value.map((item: any) => deserialize(metadata.type, item));
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
