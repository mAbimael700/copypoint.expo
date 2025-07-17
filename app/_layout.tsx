import '~/global.css';
import * as React from 'react';
import {Appearance, Platform} from 'react-native';

import {setAndroidNavigationBar} from '~/lib/android-navigation-bar';
import AppContent from "~/features/content/app-content";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

const usePlatformSpecificSetup = Platform.select({
    web: useSetWebBackgroundClassName,
    android: useSetAndroidNavigationBar,
    default: noop,
});

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            staleTime: 5 * 60 * 1000, // 5 minutos
        },
    },
});


export default function RootLayout() {
    usePlatformSpecificSetup();

    return (
        <QueryClientProvider client={queryClient}>
            <AppContent/>
        </QueryClientProvider>
    );
}

const useIsomorphicLayoutEffect =
    Platform.OS === 'web' && typeof window === 'undefined' ? React.useEffect : React.useLayoutEffect;

function useSetWebBackgroundClassName() {
    useIsomorphicLayoutEffect(() => {
        // Adds the background color to the html element to prevent white background on overscroll.
        document.documentElement.classList.add('bg-background');
    }, []);
}

function useSetAndroidNavigationBar() {
    React.useLayoutEffect(() => {
        setAndroidNavigationBar(Appearance.getColorScheme() ?? 'light');
    }, []);
}

function noop() {
}
