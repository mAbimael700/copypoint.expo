import {ActivityIndicator, View} from "react-native";
import {useColorScheme} from "~/lib/useColorScheme";
import {useAuth} from "~/features/auth/store/AuthStore";
import {DarkTheme, DefaultTheme, Theme, ThemeProvider} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import {PortalHost} from "@rn-primitives/portal";
import {NAV_THEME} from "~/lib/constants";
import {Text} from "~/components/ui/text";

import * as React from "react";
import {useEffect, useState, useRef} from "react";
import {Stack, useRouter, useSegments} from "expo-router";

const LIGHT_THEME: Theme = {
    ...DefaultTheme,
    colors: NAV_THEME.light,
};
const DARK_THEME: Theme = {
    ...DarkTheme,
    colors: NAV_THEME.dark,
};

function AppContent() {
    const { isDarkColorScheme } = useColorScheme();
    const auth = useAuth();
    const segments = useSegments();
    const router = useRouter();
    const [isNavigationReady, setIsNavigationReady] = useState(false);

    // Para evitar navegación múltiple
    const lastNavigationRef = useRef<string | null>(null);
    const hasNavigatedRef = useRef(false);

    // Inicialización una sola vez
    useEffect(() => {
        if (!auth.isInitialized) {
            auth.initialize().then(() => {
                setIsNavigationReady(true);
            });
        } else {
            setIsNavigationReady(true);
        }
    }, [auth.isInitialized, auth.initialize]);

    // Lógica de navegación
    useEffect(() => {
        if (!isNavigationReady || auth.isLoading || !auth.isInitialized) {
            return;
        }

        const inAuthGroup = segments[0] === '(auth)';
        const inAppGroup = segments[0] === '(app)';

        let targetRoute: string | null = null;

        // Solo navega si no hay una navegación manual reciente
        if (auth.isAuthenticated && inAuthGroup && !hasNavigatedRef.current) {
            targetRoute = '/(app)';
        } else if (!auth.isAuthenticated && inAppGroup && !hasNavigatedRef.current) {
            targetRoute = '/(auth)/sign-in';
        } else if (!auth.isAuthenticated && !inAuthGroup && !inAppGroup) {
            targetRoute = '/(auth)/sign-in';
        } else if (auth.isAuthenticated && !inAuthGroup && !inAppGroup) {
            targetRoute = '/(app)';
        }

        if (targetRoute && lastNavigationRef.current !== targetRoute) {
            lastNavigationRef.current = targetRoute;
            hasNavigatedRef.current = true;
            // @ts-ignore
            router.replace(targetRoute);
        }
    }, [
        auth.isAuthenticated,
        auth.isLoading,
        auth.isInitialized,
        isNavigationReady,
        segments[0],
        router
    ]);

    // Reset navigation tracking cuando cambia el segmento manualmente
    useEffect(() => {
        if (segments[0] && hasNavigatedRef.current) {
            lastNavigationRef.current = null;
            hasNavigatedRef.current = false;
        }
    }, [segments[0]]);

    // Mostrar loading mientras se inicializa o está cargando
    if (!isNavigationReady || auth.isLoading || !auth.isInitialized) {
        return (
            <View className="flex-1 justify-center items-center bg-background">
                <ActivityIndicator size="large" className="text-primary" />
                <Text className="text-muted-foreground mt-4">
                    {!auth.isInitialized ? 'Inicializando...' : 'Cargando...'}
                </Text>
            </View>
        );
    }

    return (
        <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
            <StatusBar style={isDarkColorScheme ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(app)" />
            </Stack>
            <PortalHost />
        </ThemeProvider>
    );
}

export default AppContent;