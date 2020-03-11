/**
 * Decorator variable name
 *
 * @const
 */
export const METADATA_KEY = 'JsonProperty';

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
 * @property {ICustomConverter} converter, Used for mapping the property, if specified
 * @property {boolean} exclude, Exclude the property for serialization
 */
export interface IDecoratorMetaData<T> {
  name?: string;
  type?: { new (...args: any[]): T };
  converter?: ICustomConverter<T>;
  exclude?: boolean;
  target?: string;
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
  public constructor(public name: string, public type?: { new (...args: any[]): T }) {
  }
}