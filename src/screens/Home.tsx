import { ExerciseCard } from '@components/ExerciseCard';
import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { Spinner } from '@components/Spinner';
import { ExerciseDTO } from '@dtos/ExerciceDTO';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { AppRoutesBottomTabNavigationProps } from "@routes/app.routes";
import { api } from '@services/api';
import { AppError } from '@utils/AppError';
import {
    FlatList,
    HStack,
    Heading,
    Text,
    VStack,
    useToast
} from "native-base";
import React, { useCallback, useEffect, useState } from "react";


export function Home() {

    const [groups, setGroups] = useState<string[]>([]);
    const [selectedGroup, setSelectedGroup] = useState('Costas')
    const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const navigation = useNavigation<AppRoutesBottomTabNavigationProps>()
    const toast = useToast();

    function handleOpenExerciseDetails() {
        navigation.navigate('exercise')
    }

    async function fetchGroups() {
        try {
            const response = await api.get('/groups');
            setGroups(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os grupos musculares';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }
    }

    async function fecthExercisesByGroup() {
        try {
            setIsLoading(true)
            const response = await api.get(`/exercises/bygroup/${selectedGroup}`);
            setExercises(response.data);

        } catch (error) {
            const isAppError = error instanceof AppError;
            const title = isAppError ? error.message : 'Não foi possível carregar os exercícios';

            toast.show({
                title,
                placement: 'top',
                bgColor: 'red.500'
            })
        }finally{
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchGroups();
    }, [])

    useFocusEffect(
        useCallback(() => {
            fecthExercisesByGroup()
        }, [selectedGroup])
    )

    return (
        <VStack flex={1}>
            <HomeHeader />
            <FlatList
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group
                        name={item}
                        isActive={selectedGroup.toString() === item.toString()}
                        onPress={() => setSelectedGroup(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                maxHeight={10}
                minHeight={10}
                my={10}
                _contentContainerStyle={{
                    px: 8
                }}
            />

            {
                isLoading ? <Spinner /> :
                    <VStack px={8}>
                        <HStack justifyContent="space-between" mb={5}>
                            <Heading color="gray.200" fontSize="md" fontFamily="heading">
                                Exercícios
                            </Heading>

                            <Text color="gray.200" fontSize="sm">
                                {exercises.length}
                            </Text>
                        </HStack>

                        <FlatList
                            data={exercises}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (
                                <ExerciseCard
                                    onPress={handleOpenExerciseDetails}
                                    data={item}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            _contentContainerStyle={{
                                paddingBottom: 20
                            }}
                        />

                    </VStack>
            }
        </VStack>
    )
}