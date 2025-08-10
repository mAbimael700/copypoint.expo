import React from 'react';

import {Text} from "~/components/ui/text";
import {Main} from "~/components/layout/Main";
import {StoreSwitcher} from "~/features/stores/components/switch/StoreSwitcher";
import {View} from "react-native";
import {useAuth} from "~/features/auth/store/AuthStore";
import {Button} from "~/components/ui/button";
import {LogOut} from "lucide-react-native";

const Settings = () => {
    const {logout} = useAuth()
    return (
        <Main className={'space-y-4 flex-col gap-4'}>
            <Text>Este es settings
            </Text>

            <View>
                <StoreSwitcher/>
            </View>
                <Button className={'flex-row gap-2'} onPress={() => logout()}>
                    <Text>Logout</Text>
                    <LogOut/>
                </Button>

        </Main>
    );
};

export default Settings;