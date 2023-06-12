import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { useNavigation } from '@react-navigation/native'
import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack
} from 'native-base'
import { useForm, Controller } from 'react-hook-form'

export function SignUp() {

  const { control, handleSubmit } = useForm()

  const navigation = useNavigation()

  function handleGoBack() {
    navigation.goBack()
  }

  function handleSignUp(data: any) {
    console.log(data)
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1
      }}
    >
      <VStack
        flex={1}
        bgColor='gray.700'
        px={8}
      >
        <Image
          source={BackgroundImg}
          defaultSource={BackgroundImg}
          alt='pessoas treinando'
          resizeMode='contain'
          position='absolute'
        />

        <Center my={24}>
          <LogoSvg />
          <Text
            color='gray.100'
          >
            Treine sua mente e o seu corpo
          </Text>
        </Center>

        <Center>
          <Heading
            color='gray.100'
            fontSize='xl'
            mb={6}
            fontFamily='heading'
          >
            Crie sua conta
          </Heading>

          <Controller
            name='name'
            control={control}
            render={({ field }) => (
              <Input
                placeholder='Nome'
                onChange={field.onChange}
                value={field.value}
              />
            )}
          />

          <Controller
            name='email'
            control={control}
            render={({ field }) => (
              <Input
                placeholder='E-mail'
                autoCapitalize='none'
                keyboardType='email-address'
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <Input
                placeholder='Senha'
                secureTextEntry
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name='confirm_password'
            control={control}
            render={({ field }) => (
              <Input
                placeholder='Confirmação da senha'
                secureTextEntry
                value={field.value}
                onChange={field.onChange}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType='send'
              />
            )}
          />

          <Button
            title='Criar e acessar'
            mb={12}
            onPress={handleSubmit(handleSignUp)}
          />
          <Button
            onPress={handleGoBack}
            title='Voltar para login'
            variant='outline'
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}