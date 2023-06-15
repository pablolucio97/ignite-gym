import { Spinner } from '@components/Spinner';
import {
  Roboto_400Regular,
  Roboto_700Bold,
  useFonts
} from '@expo-google-fonts/roboto';
import { NativeBaseProvider } from 'native-base';
import { StatusBar } from 'react-native';
import { THEME } from './src/themes';
import { Routes } from '@routes/index';
import {  AuthContextProvider } from '@contexts/AuthContext';

export default function App() {

  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })


  return (
    <NativeBaseProvider theme={THEME}>
      <AuthContextProvider>
        <StatusBar
          translucent
          barStyle='light-content'
          backgroundColor='transparent'
        />
        {fontsLoaded ? <Routes /> : <Spinner />}
      </AuthContextProvider>
    </NativeBaseProvider>
  );
}