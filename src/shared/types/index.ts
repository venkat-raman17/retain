/**
 * Cross-cutting, domain-agnostic types. Feature-specific models live in their
 * own feature's `domain/` folder, not here.
 */

/** Nominal typing helper. Use to make ids/strings non-interchangeable later. */
export type Brand<T, B extends string> = T & { readonly __brand: B };

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;

/** A calendar day with no time component, formatted `YYYY-MM-DD` (UTC). */
export type IsoDate = string;

/** A full timestamp formatted as ISO 8601, e.g. `2026-06-06T12:00:00.000Z`. */
export type IsoDateTime = string;

/** Make selected keys of T required. */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
