import React from 'react'
import {cn} from '~/lib/utils'
import {View} from "react-native";

interface MainProps {
    fixed?: boolean
    className?: string
    children?: React.ReactNode
    ref?: React.Ref<HTMLElement>
}

export const Main = ({fixed, className, children}: MainProps) => {
    return (
        <View
            className={cn(
                'peer-[.header-fixed]/header:mt-16',
                'px-5 py-10',
                fixed && 'fixed-main flex grow flex-col overflow-hidden',
                className
            )}

        >
            {children}
        </View>
    )
}

Main.displayName = 'Main'
