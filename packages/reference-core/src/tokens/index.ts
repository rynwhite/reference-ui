import { defineTokens } from '@pandacss/dev'

/**
 * Reference UI Default Design Tokens
 *
 * Users can customize these tokens by:
 * 1. Using extendSystem() to merge with these defaults
 * 2. Using createSystem() to define completely custom tokens
 */
export const tokens = defineTokens({
  colors: {
    gray: {
      50: { value: '#f9fafb' },
      100: { value: '#f3f4f6' },
      200: { value: '#e5e7eb' },
      300: { value: '#d1d5db' },
      400: { value: '#9ca3af' },
      500: { value: '#6b7280' },
      600: { value: '#4b5563' },
      700: { value: '#374151' },
      800: { value: '#1f2937' },
      900: { value: '#111827' },
      950: { value: '#030712' },
    },
    primary: {
      50: { value: '#eff6ff' },
      100: { value: '#dbeafe' },
      200: { value: '#bfdbfe' },
      300: { value: '#93c5fd' },
      400: { value: '#60a5fa' },
      500: { value: '#3b82f6' },
      600: { value: '#2563eb' },
      700: { value: '#1d4ed8' },
      800: { value: '#1e40af' },
      900: { value: '#1e3a8a' },
      950: { value: '#172554' },
    },
  },
  spacing: {
    px: { value: '1px' },
    0: { value: '0' },
    0.5: { value: '0.125rem' },
    1: { value: '0.25rem' },
    1.5: { value: '0.375rem' },
    2: { value: '0.5rem' },
    2.5: { value: '0.625rem' },
    3: { value: '0.75rem' },
    3.5: { value: '0.875rem' },
    4: { value: '1rem' },
    5: { value: '1.25rem' },
    6: { value: '1.5rem' },
    7: { value: '1.75rem' },
    8: { value: '2rem' },
    9: { value: '2.25rem' },
    10: { value: '2.5rem' },
    11: { value: '2.75rem' },
    12: { value: '3rem' },
    14: { value: '3.5rem' },
    16: { value: '4rem' },
    20: { value: '5rem' },
    24: { value: '6rem' },
    28: { value: '7rem' },
    32: { value: '8rem' },
    36: { value: '9rem' },
    40: { value: '10rem' },
    44: { value: '11rem' },
    48: { value: '12rem' },
    52: { value: '13rem' },
    56: { value: '14rem' },
    60: { value: '15rem' },
    64: { value: '16rem' },
    72: { value: '18rem' },
    80: { value: '20rem' },
    96: { value: '24rem' },
  },
  fontSizes: {
    xs: { value: '0.75rem' },
    sm: { value: '0.875rem' },
    md: { value: '1rem' },
    lg: { value: '1.125rem' },
    xl: { value: '1.25rem' },
    '2xl': { value: '1.5rem' },
    '3xl': { value: '1.875rem' },
    '4xl': { value: '2.25rem' },
    '5xl': { value: '3rem' },
    '6xl': { value: '3.75rem' },
    '7xl': { value: '4.5rem' },
    '8xl': { value: '6rem' },
    '9xl': { value: '8rem' },
  },
  radii: {
    none: { value: '0' },
    sm: { value: '0.125rem' },
    base: { value: '0.25rem' },
    md: { value: '0.375rem' },
    lg: { value: '0.5rem' },
    xl: { value: '0.75rem' },
    '2xl': { value: '1rem' },
    '3xl': { value: '1.5rem' },
    full: { value: '9999px' },
  },
})

export const defaultStaticCss = {
  css: [
    {
      properties: {
        backgroundColor: [
          'primary.50', 'primary.100', 'primary.200', 'primary.300', 'primary.400',
          'primary.500', 'primary.600', 'primary.700', 'primary.800', 'primary.900',
          'gray.50', 'gray.100', 'gray.200', 'gray.300', 'gray.400', 'gray.500',
          'gray.600', 'gray.700', 'gray.800', 'gray.900', 'transparent', 'white', 'black',
        ],
        color: [
          'primary.500', 'primary.600', 'primary.700',
          'gray.50', 'gray.100', 'gray.200', 'gray.300', 'gray.400', 'gray.500',
          'gray.600', 'gray.700', 'gray.800', 'gray.900', 'white', 'black',
        ],
        borderColor: ['primary.500', 'gray.100', 'gray.200', 'gray.300', 'gray.400', 'gray.500'],
      },
    },
    {
      properties: {
        padding: ['1', '1.5', '2', '3', '4', '6', '8'],
        paddingLeft: ['1', '1.5', '2', '3', '4', '6', '8'],
        paddingRight: ['1', '1.5', '2', '3', '4', '6', '8'],
        paddingTop: ['1', '1.5', '2', '3', '4', '6', '8'],
        paddingBottom: ['1', '1.5', '2', '3', '4', '6', '8'],
        margin: ['0', '1', '2', '3', '4'],
        gap: ['1', '2', '3', '4'],
      },
    },
    {
      properties: {
        fontSize: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
        fontWeight: ['normal', 'medium', 'semibold', 'bold'],
      },
    },
    {
      properties: {
        borderRadius: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
        borderWidth: ['0', '1px', '2px'],
      },
    },
  ],
}

export const defaultTheme = {
  extend: {
    tokens: tokens,
    recipes: {
      button: {
        className: 'button',
        base: {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'medium',
          borderRadius: 'md',
          transition: 'all',
          cursor: 'pointer',
          _disabled: {
            opacity: 0.5,
            cursor: 'not-allowed',
          },
        },
        variants: {
          variant: {
            primary: {
              bg: 'primary.500',
              color: 'white',
              _hover: { bg: 'primary.600' },
            },
            secondary: {
              bg: 'gray.200',
              color: 'gray.800',
              _hover: { bg: 'gray.300' },
            },
            outline: {
              borderWidth: '1px',
              borderColor: 'gray.300',
              bg: 'transparent',
              _hover: { bg: 'gray.50' },
            },
          },
          size: {
            sm: { px: 3, py: 1.5, fontSize: 'sm' },
            md: { px: 4, py: 2, fontSize: 'md' },
            lg: { px: 6, py: 3, fontSize: 'lg' },
          },
        },
        defaultVariants: {
          variant: 'primary',
          size: 'md',
        },
      },
    },
  },
}
