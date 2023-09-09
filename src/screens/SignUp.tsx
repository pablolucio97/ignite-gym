import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'
import { Button } from '@components/Button'
import { Input } from '@components/Input'
import { yupResolver } from '@hookform/resolvers/yup'
import { useNavigation } from '@react-navigation/native'
import { api } from '@services/api'
import { AppError } from '@utils/AppError'
import {
  Center,
  Heading,
  Image,
  ScrollView,
  Text,
  VStack,
  useToast
} from 'native-base'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import * as yup from 'yup'
import { useAuth } from '@hooks/useAuth'

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export function SignUp() {

  const signUpSchema = yup.object({
    name: yup.string().required('Informe o nome'),
    email: yup.string().required('Informe o e-mail').email('E-mail inválido'),
    password: yup.string().required('Informe a senha').min(6, 'A senha deve ter pelo menos 6 dígitos'),
    password_confirmation: yup.string().required('Confirme sua senha').oneOf([yup.ref('password')], 'Confirmação de senha não confere')
  })

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    resolver: yupResolver(signUpSchema)
  })

  const [loading, setLoading] = useState(false)

  const navigation = useNavigation()
  const toast = useToast()
  const { signIn } = useAuth()

  function handleGoBack() {
    navigation.goBack()
  }

  async function handleSignUp({ name, email, password }: FormDataProps) {
    setLoading(true)
    try {
      await api.post('/users', { name, email, password })
        .then(() => {
          signIn(email, password)
        })
    } catch (error) {
      const isAppError = error instanceof AppError
      const messageError = isAppError ? error.message : 'Não foi possivel conectar ao servidor.'

      toast.show({
        title: messageError,
        placement: 'top',
        bgColor: 'red.500'
      })
      setLoading(false)
    } finally {
      setLoading(false)
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

        <Center my={12}>
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
                onChangeText={field.onChange}
                value={field.value}
                errorMessage={errors?.name?.message}
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
                onChangeText={field.onChange}
                errorMessage={errors?.email?.message}
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
                onChangeText={field.onChange}
                errorMessage={errors.password?.message}
              />
            )}
          />

          <Controller
            name='password_confirmation'
            control={control}
            render={({ field }) => (
              <Input
                placeholder='Confirmação da senha'
                secureTextEntry
                value={field.value}
                onChangeText={field.onChange}
                onSubmitEditing={handleSubmit(handleSignUp)}
                returnKeyType='send'
                errorMessage={errors.password_confirmation?.message}
              />
            )}
          />

          <Button
            title='Criar e acessar'
            mb={12}
            onPress={handleSubmit(handleSignUp)}
            isLoading={loading}
          />
          <Button
            variant='outline'
            onPress={handleGoBack}
            title='Voltar para login'
          />
        </Center>
      </VStack>
    </ScrollView>
  )
}