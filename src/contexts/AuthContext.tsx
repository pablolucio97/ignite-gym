import { UserDTO } from '@dtos/UserDto'
import { api } from '@services/api';
import { ReactNode, createContext, useEffect, useState } from 'react'
import { storageGetUser, storageSaveUser } from '../storage/storageUser'


export type AuthContextProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
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
        const userData = await storageGetUser()
        if (userData) {
            setUser(userData)
        }
    }

    useEffect(() => {
        loadUserData()
    }, [])


    return (
        <AuthContext.Provider value={{ user, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}