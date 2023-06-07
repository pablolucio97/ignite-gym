import { Group } from "@components/Group";
import { ExerciseCard } from '@components/ExerciseCard';
import { HomeHeader } from "@components/HomeHeader";
import {
    VStack,
    FlatList,
    HStack,
    Heading,
    Text
} from "native-base";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AppRoutesBottomTabNavigationProps } from "@routes/app.routes";

export function Home() {

    const groupOptions = [
        'Costas',
        'Bíceps',
        'Tríceps',
        'Ombro',
        'Perna',
    ]

    const exercisesList = [
        'Puxada frontal',
        'Remada unilateral',
        'Levantamento terras'
    ]

    const [groups] = useState(groupOptions)
    const [selectedGroup, setSelectedGroup] = useState(groupOptions[0])
    const [exercises, setExercises] = useState(exercisesList);

    const navigation = useNavigation<AppRoutesBottomTabNavigationProps>()

    function handleOpenExerciseDetails() {
        navigation.navigate('exercise')
    }

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

            <VStack px={8}>
                <HStack justifyContent="space-between" mb={5}>
                    <Heading color="gray.200" fontSize="md">
                        Exercícios
                    </Heading>

                    <Text color="gray.200" fontSize="sm">
                        {exercises.length}
                    </Text>
                </HStack>
                <FlatList
                    data={exercises}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <ExerciseCard
                            onPress={handleOpenExerciseDetails}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{
                        paddingBottom: 20
                    }}
                />
            </VStack>
        </VStack>
    )
}