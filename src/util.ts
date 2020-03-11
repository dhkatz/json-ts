export type Json =
  | string
  | number
  | boolean
  | null
  | { [property: string]: Json }
  | Json[];

export function isPrimitive(obj: unknown): obj is string | boolean | number | NumberConstructor | StringConstructor | BooleanConstructor {
  return !!(['string', 'boolean', 'number'].indexOf((typeof obj)) > -1 || (obj instanceof String || obj === String ||
    obj instanceof Number || obj === Number ||
    obj instanceof Boolean || obj === Boolean));
}