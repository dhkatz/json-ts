import { IPropertyMetadata } from './PropertyMetadata';
import { PropertyMetadataMap } from './index';

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

  for (const key of Object.keys(instance)) {
    const metadata = PropertyMetadataMap.find(instance.constructor, key);

    if (!metadata) continue;

    let target = key;

    if (metadata.exclude) {
      continue;
    } else if (metadata.targetKey) {
      target = metadata.targetKey;
    } else if (metadata.name) {
      target = metadata.name;
    }

    obj[target] = serializeProperty(metadata, instance[key]);
  }

  return obj;
}

/**
 * Prepare a single property to be serialized to JSON.
 *
 * @param metadata
 * @param prop
 * @returns {any}
 */
function serializeProperty(metadata: IPropertyMetadata<any>, prop: any): any {
  if (typeof prop === 'undefined') return undefined;

  if (prop === null) return null;

  if (metadata.converter) {
    return metadata.converter.toJson(prop);
  }

  if (!metadata.type) {
    return prop instanceof Date ? new Date(prop.getTime() - prop.getTimezoneOffset() * 60000).toISOString() : prop;
  }

  if (Array.isArray(prop)) {
    return prop.map((item: any) => serialize(item));
  }

  return serialize(prop);
}
