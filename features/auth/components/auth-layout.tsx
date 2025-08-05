import {cn} from "~/lib/utils";

import {View} from "react-native";
import {Text} from "~/components/ui/text";
import {Main} from "~/components/layout/Main";

interface Props {
    children?: React.ReactNode
}

export default function AuthLayout({children}: Props) {
    return (
        <Main className={cn('bg-primary-foreground container grid h-svh max-w-none items-center justify-center',)}>
            <View className='mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8'>
                <View className='mb-4 flex items-center justify-center'>
                    <Text className='text-xl font-medium'>Copypoint app</Text>
                </View>
                {children}
            </View>
        </Main>
    )
}
