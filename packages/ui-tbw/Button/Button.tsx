import type { ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import { Button as ChakraButton } from '@chakra-ui/react';

type ButtonProps = {
  children: React.ReactNode;
} & ChakraButtonProps;

export const Button = ({ children, ...props }: ButtonProps) => (
  // @ts-ignore
  <ChakraButton {...props} bg="white" borderRadius="6px" boxShadow="1px 4px 4px rgb(0 0 0 / 25%)">
    {children}
  </ChakraButton>
);
