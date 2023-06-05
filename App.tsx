import { Text, View, StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold
} from '@expo-google-fonts/roboto'
import { THEME } from './src/themes'
import { Routes } from '@routes/index';
import { Spinner } from '@components/Spinner';
export default function App() {

  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        translucent
        barStyle='light-content'
        backgroundColor='transparent'
      />
      {fontsLoaded ? <Routes /> : <Spinner />}
    </NativeBaseProvider>
  );
}