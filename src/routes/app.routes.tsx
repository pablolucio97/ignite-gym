import { createBottomTabNavigator, BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { Home } from '@screens/Home'
import { Exercise } from '@screens/Exercise'
import { History } from '@screens/History'
import { Profile } from '@screens/Profile'
import { useTheme } from 'native-base'

import HomeIconSvg from '@assets/home.svg'
import HistoryIconSvg from '@assets/history.svg'
import ProfileIconSvg from '@assets/profile.svg'
import { Platform } from 'react-native'

type AppRoutes = {
    home: undefined;
    history: undefined;
    profile: undefined;
    exercise: undefined;
}

export type AppRoutesBottomTabNavigationProps = BottomTabNavigationProp<AppRoutes>


const BottomTab = createBottomTabNavigator<AppRoutes>()

export function AppRoutes() {

    const { sizes, colors } = useTheme()
    const iconSize = sizes[6]

    return (
        <BottomTab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarActiveTintColor: colors.green[500],
                tabBarInactiveTintColor: colors.gray[200],
                tabBarStyle: {
                    backgroundColor: colors.gray[600],
                    borderTopWidth: 0,
                    height: Platform.OS === "android" ? 'auto' : 96,
                    paddingBottom: sizes[8],
                    paddingTop: sizes[6]
                  }
            }}

        >
            <BottomTab.Screen
                name='home'
                component={Home}
                options={{
                    tabBarIcon: ({ color }) => (
                        <HomeIconSvg
                            fill={color}
                            width={iconSize}
                            height={iconSize}
                        />
                    )
                }}
            />
            <BottomTab.Screen
                name='history'
                component={History}
                options={{
                    tabBarIcon: ({ color }) => (
                        <HistoryIconSvg
                            fill={color}
                            width={iconSize}
                            height={iconSize}
                        />
                    )
                }}
            />
            <BottomTab.Screen
                name='profile'
                component={Profile}
                options={{
                    tabBarIcon: ({ color }) => (
                        <ProfileIconSvg
                            fill={color}
                            width={iconSize}
                            height={iconSize}
                        />
                    )
                }}
            />
            <BottomTab.Screen
                name='exercise'
                component={Exercise}
                options={{
                    tabBarButton: () => null
                }}
            />
        </BottomTab.Navigator>
    )
}