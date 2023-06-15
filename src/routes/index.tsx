import { useTheme } from 'native-base'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { AuthRoutes } from './auth.routes'
import { AppRoutes } from './app.routes'
import { useAuth } from '@hooks/useAuth'

export function Routes() {

    const { colors } = useTheme()
    const { user } = useAuth()

    const theme = DefaultTheme
    theme.colors.background = colors.gray[700]

    return (
        <NavigationContainer>
            {user.id ? <AppRoutes /> : <AuthRoutes />}
        </NavigationContainer>
    )
}