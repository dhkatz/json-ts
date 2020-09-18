import { IPropertyMetadata } from './PropertyMetadata';

export class MetadataMap<T = any> {
  private metadata: Map<Function, Map<string, IPropertyMetadata<T>>> = new Map();
  private ancestors: Map<Function, Function[]> = new Map();

  /**
   * Get all metadata associated with a class
   * @param key
   */
  public get(key: Function): Map<string, IPropertyMetadata<T>> | undefined;
  /**
   * Get the metadata for a property on a class
   * @param key
   * @param property
   */
  public get(key: Function, property: string): Map<string, IPropertyMetadata<T>> | undefined;
  public get(key: Function, property?: string): IPropertyMetadata<T> | Map<string, IPropertyMetadata<T>> | undefined {
    if (property) return this.metadata.get(key)?.get(property);

    return this.metadata.get(key);
  }

  /**
   * Set the metadata for a property on a class
   * @param key
   * @param property
   * @param metadata
   */
  public set(key: Function, property: string, metadata: IPropertyMetadata<T>): void {
    if (!this.metadata.has(key)) {
      this.metadata.set(key, new Map());
    }

    this.metadata.get(key).set(property, metadata);
  }

  /**
   * Gather the metadata from a class and all its ancestors
   * @param key
   */
  public find(key: Function): Map<string, IPropertyMetadata<T>> | undefined;
  /**
   * Search a class and its ancestors for a property's metadata
   * @param key
   * @param property
   */
  public find(key: Function, property: string): IPropertyMetadata<T> | undefined;
  public find(key: Function, property?: string): IPropertyMetadata<T> | Map<string, IPropertyMetadata<T>> | undefined {
    if (property) {
      const metadata = this.metadata.get(key)?.get(property);
      if (metadata) {
        return metadata;
      }

      const parent = this._ancestors(key).find((v) => this.metadata.has(v) && this.metadata.get(v).has(property));

      return this.metadata.get(parent).get(property);
    }

    const metadata = new Map<string, IPropertyMetadata<T>>();

    if (this.metadata.has(key)) {
      for (const [prop, data] of this.metadata.get(key).entries()) {
        metadata.set(prop, data);
      }
    }

    for (const ancestor of this._ancestors(key)) {
      if (!this.metadata.has(ancestor)) continue;

      for (const [prop, data] of this.metadata.get(ancestor).entries()) {
        metadata.set(prop, data);
      }
    }

    return metadata;
  }

  private _ancestors(target: Function): Function[] {
    if (!target) return [];
    if (!this.ancestors.has(target)) {
      const ancestors = [];
      for (
        let base = Object.getPrototypeOf(target.prototype.constructor);
        typeof base.prototype !== 'undefined';
        base = Object.getPrototypeOf(base.prototype.constructor)
      ) {
        ancestors.push(base);
      }

      this.ancestors.set(target, ancestors);
    }

    return this.ancestors.get(target);
  }
}
