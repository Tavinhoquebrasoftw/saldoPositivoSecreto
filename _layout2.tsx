import { router, Stack, SplashScreen } from "expo-router";
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from "react-native-gesture-handler";

const queryClient = new QueryClient();

export default function RootLayout() {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <MainLayout />
            </QueryClientProvider>
        </AuthProvider>
    );
}

function MainLayout() {
    const { setAuth } = useAuth();

    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hideAsync();
        }, 2000);
    }, []);

    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {
            if (session) {
                setAuth(session.user);
                router.replace('(tabs)/TelaMenu');
                return;
            }
            setAuth(null);
            router.replace('TelaInicial');
        });
    }, []);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack
                screenOptions={{
                    headerShown: false,
                    headerStyle: { backgroundColor: '#001e57' },
                    headerShadowVisible: false,
                    headerTintColor: '#fff',

                    animation: 'slide_from_right',
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                    fullScreenGestureEnabled: true,
                }}
            >
                <Stack.Screen name="(tabs)" options={{
                    headerShown: false,
                    gestureEnabled: false,
                }} />

                <Stack.Screen name="TelaInicial" options={{
                    headerShown: false,
                    gestureEnabled: false,
                }} />

                <Stack.Screen
                    name="Subnivel"
                    options={{
                        headerShown: true,
                        title: "",
                        headerTintColor: "#f5f5f5"
                    }}
                />

                <Stack.Screen
                    name="EditPerfil"
                    options={{
                        headerShown: true,
                        title: "",
                        headerTintColor: "#0f466c"
                    }}
                />

                <Stack.Screen
                    name="desempenho"
                    options={{
                        headerShown: false,
                        title: "",
                        headerTintColor: "#f5f5f5"
                    }}
                />



                <Stack.Screen
                    name="rec-senha/esqueci-senha"
                    options={{
                        headerShown: true,
                        title: "",
                        headerTintColor: "#f5f5f5"
                    }}
                />

                <Stack.Screen
                    name="criarQuestao"
                    options={{
                        headerShown: true,
                        title: "",
                        headerTintColor: "#f5f5f5"
                    }}
                />
                <Stack.Screen
                    name="Prof2/criar"
                    options={{
                        headerShown: false,
                        headerTintColor: "#f5f5f5"
                    }}
                />

                <Stack.Screen
                    name="Desafios/GestaoD/TelaConceitos"
                    options={{
                        headerShown: true,
                        title: "",
                        headerTintColor: "#f5f5f5"
                    }}
                />

                <Stack.Screen
                    name="ranking/ranking"
                    options={{
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name="certificado/certificado"
                    options={{
                        headerShown: false,
                    }}
                />

            </Stack>

            {/* autentication */}
            <Stack>

                <Stack.Screen
                    name="cads"
                    options={{
                        headerShown: true,
                        title: "Cadastro",
                        headerTintColor: "#f5f5f5"
                    }}
                />

                <Stack.Screen
                    name="login"
                    options={{
                        headerShown: true,
                        title: "Login",
                        headerTintColor: "#f5f5f5"
                    }}
                />

                <Stack.Screen
                    name="index"
                    options={{ headerShown: false }}
                />


            </Stack>

            {/* search function */}
            <Stack>
                <Stack.Screen
                    name="pesquisar/pesquisar"
                    options={{
                        headerShown: false,
                    }}
                />

                <Stack.Screen
                    name="pesquisar/infor"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>

            {/* niveis e resumos */}
            <Stack
                screenOptions={{
                    headerShown: false,
                    headerStyle: { backgroundColor: '#001e57' },
                    headerShadowVisible: false,
                    headerTintColor: '#fff',

                    animation: 'slide_from_right',
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                    fullScreenGestureEnabled: true,
                }}>

                <Stack.Screen
                    name="NivelIC"
                    options={{
                        headerShown: false,
                        title: "Conceitos Iniciais",
                        headerTintColor: "#f5f5f5",

                    }}
                />

                <Stack.Screen
                    name="NivelIC2"
                    options={{
                        headerShown: false,
                        headerTintColor: "#f5f5f5"
                    }}
                />

                <Stack.Screen
                    name="Resumos/Gestao/ResAuto"
                    options={{
                        headerShown: false,
                        title: "Automóveis",
                        headerTintColor: "#f5f5f5",
                    }}
                />
                <Stack.Screen
                    name="Resumos/Investimentos/ResBolsa"
                    options={{
                        headerShown: false,
                        title: "Automóveis",
                        headerTintColor: "#f5f5f5",
                    }}
                />

                <Stack.Screen
                    name="Resumos/Investimentos/ResFundo"
                    options={{
                        headerShown: false,
                        title: "Automóveis",
                        headerTintColor: "#f5f5f5",
                    }}
                />
                <Stack.Screen
                    name="Resumos/Investimentos/ResTesouro"
                    options={{
                        headerShown: false,
                        title: "Automóveis",
                        headerTintColor: "#f5f5f5",
                    }}
                />
            </Stack>


            {/* investment-simulator */}
            <Stack
                screenOptions={{
                    headerShown: false,
                    headerStyle: { backgroundColor: '#001e57' },
                    headerShadowVisible: false,
                    headerTintColor: '#fff',

                    animation: 'slide_from_right',
                    gestureEnabled: true,
                    gestureDirection: 'horizontal',
                    fullScreenGestureEnabled: true,
                }}>

                <Stack.Screen
                    name="features/investment-simulator/index"
                    options={{title:'Simulador'}}
                />

            </Stack>

            {/* Views about questions and answers */}
            <Stack>

                <Stack.Screen
                    name="/duvidas/duvidas"
                    options={{
                        headerShown: false,
                        headerTintColor: "#f5f5f5"
                    }}
                />

                <Stack.Screen
                    name="duvidaResult/index"
                    options={{
                        headerShown: false
                    }}
                />

                <Stack.Screen
                    name="/duvidas/duvidaSalva"
                    options={{
                        headerShown: false
                    }}
                />

            </Stack>

            {/* InvestBett */}
            <Stack>
                <Stack.Screen
                    name="/InvestBett1/index"
                    options={{
                        headerShown: false
                    }}
                />
                <Stack.Screen
                    name="/"
                    options={{
                        headerShown: false
                    }}
                />
            </Stack>

            {/* Orçamento Interativo */}
            <Stack>
                <Stack.Screen
                    name="/screens/budget"
                    options={{
                        headerShown: false
                    }}
                />
            </Stack>
            {/* topic7 */}
            <Stack>
                 <Stack.Screen
                    name="features/economic-crisis/screens/crisis-scenarios"
                    options={{
                        headerShown: false
                    }}
                />

                 <Stack.Screen
                    name="features/economic-crisis/screens/crisis-details/[id]"
                    options={{
                        headerShown: false
                    }}
                />
            </Stack>

        </GestureHandlerRootView>
    );
}
