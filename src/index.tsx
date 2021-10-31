import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme/theme';
//import './index.css';

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>,
  document.getElementById('root')
);
