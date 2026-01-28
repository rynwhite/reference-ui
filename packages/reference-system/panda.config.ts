import { defineConfig } from '@pandacss/dev'
import { tokens } from './src/reference.tokens'

export default defineConfig({
  // Enable preflight (CSS reset)
  preflight: true,
  
  // Scan these files for Panda usage
  include: [
    '../reference-core/src/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  
  // Exclude node_modules and build outputs
  exclude: [],
  
  // Output directory for generated code
  outdir: 'styled-system',
  
  // Generate CSS output
  emitPackage: true,
  outExtension: 'js',
  
  // DON'T hash tokens - we need readable CSS variables
  hash: false,
  
  // JSX framework (we'll use vanilla for Stencil)
  jsxFramework: 'react',
  
  // Static CSS generation - generate utilities for commonly used values
  staticCss: {
    css: [
      // Colors
      {
        properties: {
          backgroundColor: ['primary.50', 'primary.100', 'primary.200', 'primary.300', 'primary.400', 'primary.500', 'primary.600', 'primary.700', 'primary.800', 'primary.900', 'gray.50', 'gray.100', 'gray.200', 'gray.300', 'gray.400', 'gray.500', 'gray.600', 'gray.700', 'gray.800', 'gray.900', 'transparent', 'white', 'black'],
          color: ['primary.500', 'primary.600', 'primary.700', 'gray.50', 'gray.100', 'gray.200', 'gray.300', 'gray.400', 'gray.500', 'gray.600', 'gray.700', 'gray.800', 'gray.900', 'white', 'black'],
          borderColor: ['primary.500', 'gray.100', 'gray.200', 'gray.300', 'gray.400', 'gray.500'],
        }
      },
      // Spacing
      {
        properties: {
          padding: ['1', '1.5', '2', '3', '4', '6', '8'],
          paddingLeft: ['1', '1.5', '2', '3', '4', '6', '8'],
          paddingRight: ['1', '1.5', '2', '3', '4', '6', '8'],
          paddingTop: ['1', '1.5', '2', '3', '4', '6', '8'],
          paddingBottom: ['1', '1.5', '2', '3', '4', '6', '8'],
          margin: ['0', '1', '2', '3', '4'],
          gap: ['1', '2', '3', '4'],
        }
      },
      // Typography
      {
        properties: {
          fontSize: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
          fontWeight: ['normal', 'medium', 'semibold', 'bold'],
        }
      },
      // Borders
      {
        properties: {
          borderRadius: ['none', 'sm', 'md', 'lg', 'xl', 'full'],
          borderWidth: ['0', '1px', '2px'],
        }
      }
    ]
  },

  // Theme configuration
  theme: {
    extend: {
      // Import default tokens from reference.tokens.ts
      tokens,
      
      // Recipes for component variants (button, input, etc.)
      recipes: {
        // Example button recipe - will be expanded later
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
              cursor: 'not-allowed'
            }
          },
          variants: {
            variant: {
              primary: {
                bg: 'primary.500',
                color: 'white',
                _hover: { bg: 'primary.600' }
              },
              secondary: {
                bg: 'gray.200',
                color: 'gray.800',
                _hover: { bg: 'gray.300' }
              },
              outline: {
                borderWidth: '1px',
                borderColor: 'gray.300',
                bg: 'transparent',
                _hover: { bg: 'gray.50' }
              }
            },
            size: {
              sm: { px: 3, py: 1.5, fontSize: 'sm' },
              md: { px: 4, py: 2, fontSize: 'md' },
              lg: { px: 6, py: 3, fontSize: 'lg' }
            }
          },
          defaultVariants: {
            variant: 'primary',
            size: 'md'
          }
        }
      }
    }
  }
})
