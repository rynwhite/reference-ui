/**
 * Fallback types for ../../styled-system/css.js when Panda has not run.
 * Panda overwrites styled-system/ when you run panda codegen.
 */
declare module '../../styled-system/css.js' {
  export function css(...styles: unknown[]): string
}
