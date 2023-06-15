import { UserDTO } from '@dtos/UserDto'
import { ReactNode, createContext, useState } from 'react'

type FormData = {
    email: string;
    password: string
}

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
        id: '1',
        name: 'Rodrigo',
        email: 'rodrigo@email.com',
        avatar: 'rodrigo.png'
    })

   async function signIn(email: string, password: string) {
        setUser({
            avatar: '',
            email,
            id: '',
            name: ''
        })
    }


    return (
        <AuthContext.Provider value={{ user, signIn }}>
            {children}
        </AuthContext.Provider>
    )
}