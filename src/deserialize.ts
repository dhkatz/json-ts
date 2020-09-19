import { IPropertyMetadata } from './PropertyMetadata';
import { Constructor, isConstructor, isPrimitive, Json, JsonArray, JsonObject } from './util';
import { PropertyMetadataMap } from './index';

/**
 * deserialize
 *
 * @function
 * @param {Constructor} type, class type which is going to initialize and hold a mapping json
 * @param {Json} json, input json object which to be mapped
 * @return {T} return mapped object
 */
export function deserialize<T extends object, U extends Json>(type: T | Constructor<T>, json: U): T;
export function deserialize<T extends object, U extends JsonArray>(type: T | Constructor<T>, json: U): T[];
export function deserialize<T extends object, U extends JsonObject>(type: T | Constructor<T>, json: U): T;
export function deserialize<T extends object>(
  type: T | Constructor<T>,
  json: JsonObject | JsonArray
): T | T[] | undefined {
  if (type == undefined || json == undefined) {
    return undefined;
  }

  if (typeof json !== 'object') {
    return undefined;
  }

  if (Array.isArray(json)) {
    return json.map((value: Json) => deserialize(type, value));
  }

  let constructor = isConstructor(type) ? type : type.constructor;
  let instance: any = type instanceof Function ? new type() : type;

  const properties: Map<string, IPropertyMetadata<T>> = PropertyMetadataMap.find(constructor) || new Map();

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
  const value = json && typeof json === 'object' && !Array.isArray(json) ? json[index] : undefined;

  const type: any = metadata.type || Reflect.getMetadata('design:type', instance, key);

  if (type === undefined) {
    throw new TypeError('Tried to deserialize a property with an undefined type!');
  }

  if (type === Array) {
    throw new TypeError(
      "Tried to deserialize property of 'Array' type! Insufficient type information available for arrays!"
    );
  }

  if (!Array.isArray(value)) {
    if (!isPrimitive(type) && typeof value === 'object') {
      return deserialize(type, value);
    }

    if (isPrimitive(type) && isPrimitive(value)) {
      if (type === Boolean) {
        return value == undefined ? value : Boolean(value);
      } else if (value && type instanceof Function) {
        return type(value);
      }
    }

    if (value !== undefined && type instanceof Function && isConstructor(type)) {
      return new type(value);
    }
  } else {
    return value.map((v) => deserialize(type, v));
  }

  return value;
}
