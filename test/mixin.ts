export type Constructor<T> = new (...args: any[]) => T;
export type Mixin<T> = Constructor<T> | object;

function mix(client: Constructor<any>, mixins: Array<Mixin<any>>): void {
  const clientKeys = Object.getOwnPropertyNames(client.prototype);
  for (let mixin of mixins) {
    const mixinMixables = getMixables(clientKeys, mixin);
    Object.defineProperties(client.prototype, mixinMixables);
  }
}

/**
 * Returns a map of mixables. That is things that can be mixed in
 */
function getMixables(clientKeys: string[], mixin: Mixin<any>): PropertyDescriptorMap {
  let descriptors: PropertyDescriptorMap = {};
  switch (typeof mixin) {
    case 'object':
      descriptors = getMixables(mixin);
      break;
    case 'function':
      descriptors = getMixables((mixin as Constructor<any>).prototype);
      break;
  }
  return descriptors;

  function getMixables(obj: object): PropertyDescriptorMap {
    const map: PropertyDescriptorMap = {};
    Object.getOwnPropertyNames(obj).map((key) => {
      if (clientKeys.indexOf(key) < 0) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor === undefined) return;
        if (descriptor.get || descriptor.set) {
          map[key] = descriptor;
        } else if (typeof descriptor.value === 'function') {
          map[key] = descriptor;
        }
      }
    });
    return map;
  }
}

/**
 * Takes a list of classes or object literals and adds their methods
 * to the class calling it.
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function mixin(...options: Array<Mixin<any>>) {
  return function (target: any) {
    mix(target as any, options.reverse());

    return target;
  };
}
