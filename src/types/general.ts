/**
 * A utility type that simplifies a given type `T` by flattening intersections
 * making it more readable.
 */

export type Prettify<T> = {
  [K in keyof T]: T[K]
} & unknown