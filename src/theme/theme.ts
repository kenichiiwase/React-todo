import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  styles: {
    global: {
      body: {
        fontSize: 'md',
        backgroundColor: 'gray.400',
        // color: 'white',
      },
    },
  },
});

export default theme;
