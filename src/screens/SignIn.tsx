import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { useAuth } from '@hooks/useAuth'
import { useNavigation } from '@react-navigation/native'
import { AuthNavigationRoutesProps } from '@routes/auth.routes'
import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
  useToast
} from 'native-base'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { AppError } from '@utils/AppError'
import { useState } from 'react'

type FormData = {
  email: string;
  password: string;
}


export function SignIn() {

  const signInSchema = yup.object({
    email: yup.string().required('Email obrigatório'),
    password: yup.string().required('Senha obrgatória').min(6, 'Sua senha deve ter pelo menos 6 dígitos')
  })

  const navigation = useNavigation<AuthNavigationRoutesProps>()
  const { handleSubmit, formState: { errors }, control } = useForm<FormData>({
    resolver: yupResolver(signInSchema)
  })

  const { signIn } = useAuth()
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)


  function handleNavigateToNewAccount() {
    navigation.navigate('signUp')
  }

  async function handleSignIn({ email, password }: FormData) {
    setIsLoading(true)
    try {
      await signIn(email, password)
    } catch (error) {

      const isAppError = error instanceof AppError;
      const title = isAppError ? error.message : 'Não foi possível entrar. Tente novamente mas tarde.'
      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500'
      })

      setIsLoading(false)
    }finally{
      setIsLoading(false)
    }
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
            Acesse sua conta
          </Heading>
          <Controller
            name='email'
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                placeholder='E-mail'
                autoCapitalize='none'
                keyboardType='email-address'
                onChangeText={onChange}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            name='password'
            control={control}
            render={({ field: { onChange } }) => (
              <Input
                placeholder='Senha'
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />
          <Button
            onPress={handleSubmit(handleSignIn)}
            title='Acessar'
            isLoading={isLoading}
          />
          <Button
            title='Criar conta'
            onPress={handleNavigateToNewAccount}
            variant='outline'
            mt={24}
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}