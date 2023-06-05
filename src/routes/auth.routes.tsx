import { } from '@react-navigation/native'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'
import { SignIn } from '@screens/SignIn'
import { SignUp } from '@screens/SignUp'

type AuthRoutes = {
    signUp: undefined;
    signIn: undefined;
}

export type AuthNavigationRoutesProps = StackNavigationProp<AuthRoutes>

const Stack = createStackNavigator()

export function AuthRoutes() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name='signIn' component={SignIn} />
            <Stack.Screen name='signUp' component={SignUp} />
        </Stack.Navigator>
    )
}