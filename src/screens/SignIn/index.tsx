import { VStack, Image } from 'native-base'
import BackgroundImg from '@assets/background.png'
import LogoSvg from '@assets/logo.svg'

export function SignIn() {
  return (
    <VStack
      flex={1}
      bgColor='gray.700'
    >
      <Image
        source={BackgroundImg}
        alt='pessoas treinando'
        resizeMode='contain'
        position='absolute'
      />
      <LogoSvg />
    </VStack>
  )
}