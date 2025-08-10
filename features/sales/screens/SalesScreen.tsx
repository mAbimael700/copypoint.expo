import React, {useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {Stack, useRouter} from 'expo-router';
import {Main} from '~/components/layout/Main';
import {Text} from '~/components/ui/text';
import {Tabs, TabsList, TabsTrigger} from '~/components/ui/tabs';
import SalesList from '~/features/sales/components/SalesList';
import {useCopypointContext} from '~/features/copypoints/context/useCopypointContext';
import {Button} from "~/components/ui/button";

const SalesScreen = () => {
    const [activeTab, setActiveTab] = useState('all');
    const {currentCopypoint} = useCopypointContext();
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-background">
            <Stack.Screen options={{
                title: 'Ventas',
                headerShown: true
            }}/>

            <Main>
                <View className="px-4 py-4">
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-2xl font-bold">Ventas</Text>
                        {currentCopypoint && (
                            <Text className="text-muted-foreground">
                                {currentCopypoint.name}
                            </Text>
                        )}
                    </View>

                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="all">
                                <Text>Todas</Text>
                            </TabsTrigger>
                            <TabsTrigger value="pending">
                                <Text>Pendientes</Text>
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </View>

                {activeTab === 'all' ? (
                    <SalesList showPendingOnly={false}/>
                ) : (
                    <SalesList showPendingOnly={true}/>
                )}


                <Button onPress={() => router.push('/(app)/sales/create')}>Register</Button>
            </Main>
        </SafeAreaView>
    );
};

export default SalesScreen;
