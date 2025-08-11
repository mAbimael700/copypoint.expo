import React, {useState} from 'react';
import {View} from 'react-native';
import {useRouter} from 'expo-router';
import {Main} from '~/components/layout/Main';
import {Text} from '~/components/ui/text';
import {Tabs, TabsList, TabsTrigger} from '~/components/ui/tabs';
import SalesList from '~/features/sales/components/SalesList';
import {useCopypointContext} from '~/features/copypoints/context/useCopypointContext';
import CopypointSelector from "~/features/copypoints/components/selector/copypoint-selector";
import {Plus} from "lucide-react-native";
import {Fab} from "~/components/ui/fab";

const SalesScreen = () => {
    const [activeTab, setActiveTab] = useState('all');
    const {currentCopypoint} = useCopypointContext();
    const router = useRouter();

    return (
        <Main className="px-4 flex-col gap-4" >
            <View className={'flex flex-col justify-between gap-4 mb-4'}>
                <View className="flex-col justify-between">
                    <Text className="text-3xl font-bold">Sales</Text>
                    <Text className={'text-muted-foreground'}>Review your copypoint sales</Text>
                </View>

                <CopypointSelector/>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="flex-row justify-start">
                        <TabsTrigger className={'w-24'} value="all">
                            <Text>All</Text>
                        </TabsTrigger>
                        <TabsTrigger className={'w-24'} value="pending">
                            <Text>Pending</Text>
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </View>


            <View style={{
                height: 550,
                width: '100%'
            }}>

                {activeTab === 'all' ? (
                    <SalesList showPendingOnly={false}/>
                ) : (
                    <SalesList showPendingOnly={true}/>
                )}
            </View>

            {/* Floating Action Button (FAB) */}
            <Fab
                position="bottom-right"
                size="medium"
                color="#3b82f6" // blue-500
                onPress={() => router.push('/(app)/sales/create')}
            >
                <Plus color="white" size={24} />
            </Fab>
        </Main>

    );
};

export default SalesScreen;
