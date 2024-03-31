/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

 import React from 'react';
 import Navigation from './Navigation';
 import { Provider as PaperProvider } from 'react-native-paper';
 import { DefaultTheme, configureFonts } from 'react-native-paper';
 
 const customColors = {
   primary: 'black',
   accent: 'black',
   background: 'white',
   surface: 'black',
   text: 'black',
 };
 
 const customTheme = {
   ...DefaultTheme,
   dark: true,
   colors: {
     ...DefaultTheme.colors,
     ...customColors,
   },
   fonts: configureFonts({
     ...DefaultTheme.fonts,
     regular: 'Montserrat',
   }),
 };
 
 const App = () => {
   return (
     <PaperProvider theme={customTheme}>
       <Navigation />
     </PaperProvider>
   );
 };
 
 export default App;
