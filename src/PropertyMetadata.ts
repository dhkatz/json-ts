import { Constructor } from './util';

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
 * IPropertyMetadata<T>
 * DecoratorConstraint
 *
 * @interface
 * @property {ICustomConverter} converter, Used for mapping the property, if specified
 * @property {boolean} exclude, Exclude the property for serialization
 */
export interface IPropertyMetadata<T> {
  name?: string;
  type?: Constructor<T>;
  converter?: ICustomConverter<T>;
  exclude?: boolean;
  targetKey?: string;
}

/**
 * PropertyMetadata
 * Model used for decoration parameters
 *
 * @class
 * @property {string} name, indicate which json property needed to map
 * @property {string} type, if the target is not primitive type, map it to corresponding class
 */
export class PropertyMetadata<T> implements IPropertyMetadata<T> {
  public constructor(public name: string, public type?: { new (...args: any[]): T }) {}
}
