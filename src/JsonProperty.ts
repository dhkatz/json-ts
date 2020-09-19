import { IPropertyMetadata, PropertyMetadata } from './PropertyMetadata';
import { PropertyMetadataMap } from './index';

/**
 * JsonProperty
 *
 * @function
 * @param {IPropertyMetadata<T>|string} metadata Encapsulate it to DecoratorMetaData for standard use
 * @return {(target: object, targetKey: string | symbol) => void} Decorator function
 */
export function JsonProperty<T>(metadata?: IPropertyMetadata<T> | string): (target: any, propertyKey: string) => void {
  let decorator: IPropertyMetadata<T>;
  switch (typeof metadata) {
    case 'string':
      decorator = new PropertyMetadata(metadata);
      break;
    case 'object':
    case 'undefined':
      decorator = metadata as IPropertyMetadata<T>;
      break;
    default:
      throw new TypeError(`Metadata passed to JsonProperty is of invalid type! (${typeof metadata})`);
  }

  return (target: any, propertyKey: string) => {
    const object = target instanceof Function ? target : target.constructor;

    if (decorator === undefined) decorator = { name: propertyKey };

    if (decorator.type === undefined) {
      decorator.type = Reflect.getMetadata('design:type', target, propertyKey);
    }

    if ((decorator as any).type === Array) {
      throw new TypeError('Metadata for JsonProperty must include a type for array properties!');
    }

    PropertyMetadataMap.set(object, propertyKey, decorator);
  };
}
