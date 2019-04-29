import 'reflect-metadata';
export interface JSONObject {
    [key: string]: JSONType;
}
export declare type JSONType = string | number | JSONArray | JSONObject | boolean | null;
export interface JSONArray extends Array<JSONType> {
}
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
    type?: {
        new (): T;
    };
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
export declare class DecoratorMetaData<T> implements IDecoratorMetaData<T> {
    name: string;
    type?: {
        new (): T;
    };
    constructor(name: string, type?: {
        new (): T;
    });
}
/**
* JsonProperty
*
* @function
* @param {IDecoratorMetaData<T>|string} metadata Encapsulate it to DecoratorMetaData for standard use
* @return {(target: object, targetKey: string | symbol) => void} Decorator function
*/
export declare function JsonProperty<T>(metadata?: IDecoratorMetaData<T> | string): (target: object, targetKey: string | symbol) => void;
/**
* deserialize
*
* @function
* @param {{new():T}} type, class type which is going to initialize and hold a mapping json
* @param {Object} json, input json object which to be mapped
*
* @return {T} return mapped object
*/
export declare function deserialize<T, U extends JSONObject | JSONArray = JSONObject>(type: {
    new (): T;
}, json: U): U extends JSONObject ? T : T[];
/**
* Serialize: Creates a JSON serializable object from the provided object instance.
* Only @JsonProperty decorated properties in the model instance are processed.
*
*/
export declare function serialize<T extends object = any, U extends object = any>(instance: T | T[]): T extends any[] ? U[] : U;
