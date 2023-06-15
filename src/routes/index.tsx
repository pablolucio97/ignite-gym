import { Center, useTheme } from 'native-base'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { AuthRoutes } from './auth.routes'
import { AppRoutes } from './app.routes'
import { useAuth } from '@hooks/useAuth'
import { Spinner } from '@components/Spinner'

export function Routes() {

    const { colors } = useTheme()
    const { user, isStorageLoadingUserData } = useAuth()

    const theme = DefaultTheme
    theme.colors.background = colors.gray[700]

    if (isStorageLoadingUserData) {
        return (
            <Center
                flex={1}
                bgColor='gray.700'
            >
                <Spinner />
            </Center>
        )
    }

    return (
        <NavigationContainer>
            {user.id ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
    )
}