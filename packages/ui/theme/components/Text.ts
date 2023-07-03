import type { ComponentStyleConfig } from '@chakra-ui/react';

export const TextStyle: ComponentStyleConfig = {
  baseStyle: {
    fontFamily: 'Inter',
    color: 'black',
  },

  variants: {
    title: {
      fontWeight: 'bold',
      fontSize: '2.75rem',
      lineHeight: '3.25rem',
    },
    H900: {
      fontFamily: 'Inter',
      fontWeight: 'semibold',
      fontSize: '2.1875rem',
      lineHeight: '2.5rem',
      letterSpacing: '0',
    },
    H800: {
      fontFamily: 'Inter',
      fontWeight: '500',
      fontSize: '1.8125rem',
      lineHeight: '2rem',
      letterSpacing: '0',
    },
    H700: {
      fontFamily: 'Inter',
      fontWeight: '500',
      fontSize: '1.5rem',
      lineHeight: '1.75rem',
      letterSpacing: '0',
    },
    H600: {
      fontFamily: 'Inter',
      fontWeight: '500',
      fontSize: '1.25rem',
      lineHeight: '1.5rem',
      letterSpacing: '0',
    },
    H500: {
      fontFamily: 'Inter',
      fontWeight: '500',
      fontSize: '1rem',
      lineHeight: '1.25rem',
      letterSpacing: '0',
    },
    H400: {
      fontFamily: 'Inter',
      fontWeight: '500',
      fontSize: '0.875rem',
      lineHeight: '1rem',
      letterSpacing: '0',
    },
    H300: {
      fontFamily: 'Inter',
      fontWeight: '500',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      letterSpacing: '0',
    },
    H200: {
      fontFamily: 'Inter',
      fontWeight: 'semibold',
      fontSize: '0.75rem',
      lineHeight: '1rem',
      letterSpacing: '0',
    },
    H100: {
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fontSize: '0.6875rem',
      lineHeight: '1rem',
      letterSpacing: '0',
    },
    UIText: {
      fontFamily: 'Inter',
      fontWeight: 'normal',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      letterSpacing: '0',
    },
    small: {
      fontFamily: 'Inter',
      fontWeight: '500',
      fontSize: '0.6875rem',
      lineHeight: '0.875rem',
      letterSpacing: '0',
    },
    code: {
      fontFamily: 'IBM Plex Sans',
      fontWeight: '500',
      fontSize: '0.75rem',
      lineHeight: '1.25rem',
      letterSpacing: '0',
    },
    pointer: {
      fontFamily: 'Inter',
      fontWeight: 'regular',
      fontSize: '1.25rem',
      lineHeight: '1.5rem',
      letterSpacing: '0',
    },
  },

  defaultProps: {
    variant: 'UIText',
  },
};
