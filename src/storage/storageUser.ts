import { UserDTO } from '@dtos/UserDto';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_STORAGE_KEY } from './storageConfig';

export async function storageSaveUser(user: UserDTO) {
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
}

export async function storageGetUser() {
    const storage = await AsyncStorage.getItem(USER_STORAGE_KEY)
    const user: UserDTO = storage ? JSON.parse(storage) : {};
    return user
}