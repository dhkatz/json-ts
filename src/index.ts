import 'reflect-metadata'
import { DecoratorMetaData, IDecoratorMetaData, METADATA_KEY } from './metadata'

/**
* JsonProperty
*
* @function
* @param {IDecoratorMetaData<T>|string} metadata Encapsulate it to DecoratorMetaData for standard use
* @return {(target: object, targetKey: string | symbol) => void} Decorator function
*/
export function JsonProperty<T>(metadata?: IDecoratorMetaData<T> | string): (target: object, targetKey: string | symbol) => void {
  let decorator: IDecoratorMetaData<T>;
  switch (typeof metadata) {
    case 'string':
      decorator = new DecoratorMetaData(metadata);
      break;
    case 'object':
      decorator = metadata as IDecoratorMetaData<T>;
      break;
    default:
      throw new TypeError(`Metadata passed to JsonProperty is of invalid type! (${typeof metadata})`);
  }

  return Reflect.metadata(METADATA_KEY, decorator);
}

export { deserialize } from './deserialize';
export { serialize } from './serialize';
