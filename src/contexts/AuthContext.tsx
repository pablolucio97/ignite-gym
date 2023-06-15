import { UserDTO } from '@dtos/UserDto'
import { api } from '@services/api';
import { ReactNode, createContext, useEffect, useState } from 'react'
import { storageGetUser, storageRemoveUser, storageSaveUser } from '../storage/storageUser'


export type AuthContextProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    isStorageLoadingUserData: boolean;
}

type AuthContextProvider = {
    children: ReactNode
}


export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export function AuthContextProvider({ children }: AuthContextProvider) {

    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        avatar: ''
    })

    const [isStorageLoadingUserData, setIsStorageLoadingUserData] = useState(false)

    async function signIn(email: string, password: string) {

        try {
            const { data } = await api.post('/sessions', { email, password })

            if (data.user) {
                setUser(data.user)
                storageSaveUser(data.user)
            }
        } catch (error) {
            throw error
        }
    }

    async function loadUserData() {
        setIsStorageLoadingUserData(true)
        try {
            const userData = await storageGetUser()
            if (userData) {
                setUser(userData)
            }
        } catch (error) {
            throw error
        } finally {
            setIsStorageLoadingUserData(false)
        }
    }

    async function signOut() {
        setIsStorageLoadingUserData(true)
        try {
            await storageRemoveUser()
                .then(() => {
                    setUser({} as UserDTO)
                })
        } catch (error) {
            throw error
        } finally {
            setIsStorageLoadingUserData(false)
        }
    }

    useEffect(() => {
        loadUserData()
    }, [])


    return (
        <AuthContext.Provider value={{
            user,
            signIn,
            isStorageLoadingUserData,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    )
}