import { Group } from "@components/Group";
import { HomeHeader } from "@components/HomeHeader";
import { VStack, FlatList } from "native-base";
import { useState } from "react";

export function Home() {

    const groupOptions = [
        'Costas',
        'Bíceps',
        'Tríceps',
        'Ombro',
        'Perna',
    ]

    const [groups] = useState(groupOptions)
    const [selectedGroup, setSelectedGroup] = useState(groupOptions[0])

    return (
        <VStack flex={1}>
            <HomeHeader />
            <FlatList
                data={groups}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group
                        name={item}
                        isActive={selectedGroup === item}
                        onPress={() => setSelectedGroup(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                maxHeight={10}
                my={10}
                _contentContainerStyle={{
                    px: 8
                }}
            />
        </VStack>
    )
}