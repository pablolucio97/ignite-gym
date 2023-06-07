import { HistoryCard } from "@components/HistoryCard";
import { ScreenHeader } from "@components/ScreenHeader";
import { Heading, VStack, SectionList, Text } from "native-base";
import { useState } from "react";

export function History() {

    const exercisesList = [
        {
            title: '26.08.2022',
            data: ["Puxada frontal", "Remada unilateral"]
        },
        {
            title: '27.08.22',
            data: ["Puxada frontal"]
        }
    ]

    const [exercises] = useState(exercisesList)

    return (
        <VStack flex={1}>
            <ScreenHeader
                title='Histórico de Exercícios'
            />
            <SectionList
                sections={exercises}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <HistoryCard />
                )}
                renderSectionHeader={({ section }) => (
                    <Heading color="gray.200" fontSize="md" mt={10} mb={3} ml={5} >
                        {section.title}
                    </Heading>
                )}
                contentContainerStyle={exercises.length === 0 &&
                {
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                ListEmptyComponent={() => (
                    <Text
                        color='gray.100'
                        textAlign='center'
                    >
                        Não há exercícios registrados.
                        {`\n`}
                        Vamos treinar hoje?
                    </Text>
                )
                }
            />
        </VStack >
    )
}