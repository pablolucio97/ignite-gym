import { Text, View, StatusBar } from 'react-native';
import { NativeBaseProvider } from 'native-base'
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold
} from '@expo-google-fonts/roboto'
import { Spinner } from '@components/Spinner';
import { THEME } from './src/themes'
export default function App() {

  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold })

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        translucent
        barStyle='light-content'
        backgroundColor='transparent'
      />
      {fontsLoaded ? <Text>Open up App.tsx to start working on your app!</Text> : <View />}
    </NativeBaseProvider>
  );
}