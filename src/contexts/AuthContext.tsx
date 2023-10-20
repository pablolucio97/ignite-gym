import { UserDTO } from '@dtos/UserDto';
import { api } from '@services/api';
import { storageAuthTokenGet, storageAuthTokenRemove, storageAuthTokenSave } from '@storage/storageAuth';
import { ReactNode, createContext, useEffect, useState } from 'react';
import { storageGetUser, storageRemoveUser, storageSaveUser } from '../storage/storageUser';


export type AuthContextProps = {
    user: UserDTO;
    signIn: (email: string, password: string) => Promise<void>;
    updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
    signOut: () => Promise<void>;
    isStorageLoadingUserData: boolean;
}

type AuthContextProvider = {
    children: ReactNode
}


export const AuthContext = createContext<AuthContextProps>({} as AuthContextProps)

export function AuthContextProvider({ children }: AuthContextProvider) {

    const [user, setUser] = useState<UserDTO>({} as UserDTO)
    const [isStorageLoadingUserData, setIsStorageLoadingUserData] = useState(false)

    async function userAndTokenUpdate(userData: UserDTO, token: string) {
        // SETTING THE TOKEN OF AUTHENTICATE USER IN ALL REQUESTS
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(userData)
    }

    async function storageUserAndTokenSave(userData: UserDTO, token: string) {
        try {
            setIsStorageLoadingUserData(true)
            await storageSaveUser(userData)
            await storageAuthTokenSave(token)
        } catch (error) {
            throw error
        } finally {
            setIsStorageLoadingUserData(false)
        }
    }

    async function signIn(email: string, password: string) {
        try {
            setIsStorageLoadingUserData(true);
            const { data } = await api.post('/sessions', { email, password })

            if (data.user && data.token) {
                await storageUserAndTokenSave(data.user, data.token)
                userAndTokenUpdate(data.user, data.token)
            }
        } catch (error) {
            throw error
        } finally {
            setIsStorageLoadingUserData(false);
        }
    }

    async function loadUserData() {
        setIsStorageLoadingUserData(true)
        try {
            const userData = await storageGetUser()
            const userToken = await storageAuthTokenGet()
            if (userToken && userData) {
                userAndTokenUpdate(userData, userToken)
            }
        } catch (error) {
            throw error
        } finally {
            setIsStorageLoadingUserData(false)
        }
    }

    async function updateUserProfile(userUpdated: UserDTO) {
        try {
            setUser(userUpdated);
            await storageSaveUser(userUpdated);
        } catch (error) {
            throw error;
        }
    }

    async function signOut() {
        setIsStorageLoadingUserData(true)
        try {
            await storageRemoveUser()
                .then(() => {
                    setUser({} as UserDTO)
                })
            await storageAuthTokenRemove()
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
            updateUserProfile,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    )
}