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

    async function storageUserAndTokenSave(userData: UserDTO, token: string, refresh_token: string) {
        try {
            setIsStorageLoadingUserData(true)
            await storageSaveUser(userData)
            await storageAuthTokenSave({ token, refresh_token });
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

            if (data.user && data.token && data.refresh_token) {
                await storageUserAndTokenSave(data.user, data.token, data.refresh_token)
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
            const { token } = await storageAuthTokenGet()
            if (token && userData) {
                userAndTokenUpdate(userData, token)
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


    useEffect(() => {
        //HERE registerInterceptTokenManager IS CALLED TO MANAGER TOKEN WHEN signOut FUNCTION IS CALLED
        const subscriber = api.registerInterceptTokenManager(signOut)
        return () => {
            subscriber()
        }
    }, [signOut])


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