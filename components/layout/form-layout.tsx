import React from "react";
import { Main } from "~/components/layout/Main";
import {cn} from "~/lib/utils";
import {Text} from "~/components/ui/text";
import {View} from "react-native";


interface FormLayoutProps {
    children?: React.ReactNode
    header: string
    description: string
    aside?: React.ReactNode
    className?: string
}

export default function FormLayout({ children, header, description, className }: FormLayoutProps) {
    return (
        < >
            <Main>
                <View className='space-y-0.5'>
                    <Text className='text-xl font-bold tracking-tight md:text-2xl'>
                        {header}
                    </Text>
                    <Text className='text-muted-foreground'>
                        {description}
                    </Text>
                </View>

                <View className='flex flex-1 flex-col space-y-2 overflow-y-auto md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12'>
                    <View className={cn('flex w-full overflow-y-auto p-1', className)}>
                        {children}
                    </View>
                </View>
            </Main>
        </>
    )
}