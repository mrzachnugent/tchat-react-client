import { createReactQueryHooks } from '@trpc/react';
import { AppRouter } from '../types';

// import superjson from 'superjson';
// ℹ️ Type-only import:
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html#type-only-imports-and-export

/**
 * A set of strongly-typed React hooks from your `AppRouter` type signature with `createReactQueryHooks`.
 * @link https://trpc.io/docs/react#3-create-trpc-hooks
 */

// export const transformer = superjson;
/**
 * This is a helper method to infer the output of a query resolver
 * @example type HelloOutput = inferQueryOutput<'hello'>
 */
