import React from "react";
import {Main} from "~/components/layout/Main";
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

export default function FormLayout({children, header, description, className}: FormLayoutProps) {
    return (
        < >
            <Main fixed className={'flex-col gap-4'}>
                <View className={'border-b border-muted-foreground py-2 mx-5'}>
                    <Text className='text-3xl font-bold tracking-tight md:text-2xl'>
                        {header}
                    </Text>
                    <Text className='text-muted-foreground'>
                        {description}
                    </Text>
                </View>

                <View className={cn(className)}>
                    {children}
                </View>

            </Main>
        </>
    )
}