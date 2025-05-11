import { router, Stack, SplashScreen } from "expo-router";
import { AuthProvider, useAuth } from '../contexts/AuthContext'
import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { color } from "@rneui/themed/dist/config";
import {QueryClientProvider, QueryClient} from '@tanstack/react-query'

const queryClient = new QueryClient();

export default function RootLayout() {

   
    return (
        <AuthProvider>
             <QueryClientProvider client={queryClient}>
            <MainLayout />
            </QueryClientProvider>
        </AuthProvider>
    )
}

function MainLayout() {
    const { setAuth } = useAuth()
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hideAsync();
        }, 2000);
    }, []);


    useEffect(() => {
        supabase.auth.onAuthStateChange((_event, session) => {

            if (session) {
                setAuth(session.user)
                router.replace('/(tabs)/TelaMenu')
                return;
            }

            setAuth(null);
            router.replace('TelaInicial')
        })
    }, [])

    
    return (
        <Stack screenOptions={{
            headerShown:false,
            headerStyle: {
                backgroundColor: '#001e57',
            },
            headerShadowVisible: false,
            headerTintColor: '#fff',
        }}>
           

            <Stack.Screen name="(tabs)" options={{ headerShown: false}} />

            <Stack.Screen
                name="TelaInicial"
                options={{
                    headerShown: false,
                    headerTintColor: "#0f466c",
                }} />

            <Stack.Screen
                name="NivelIC"
                options={{
                    headerShown: true,
                    title: "Conceitos Iniciais",
                    headerTintColor: "#f5f5f5",
                }} />

            <Stack.Screen
                name="NivelIC2"
                options={{
                    headerShown: true,
                    title: "Investimentos",
                    headerTintColor: "#f5f5f5",
                }} />

            <Stack.Screen
                name="Subnivel"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />

            <Stack.Screen
                name="EditPerfil"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#0f466c",
                }} />

            <Stack.Screen
                name="cads"
                options={{
                    headerShown: true,
                    title: "Cadastro",
                    headerTintColor: "#f5f5f5",
                }} />

            <Stack.Screen
                name="login"
                options={{
                    headerShown: true,
                    title: "Login",
                    headerTintColor: "#f5f5f5",
                }} />

            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }} />

            {/* <Stack.Screen
                name="/Resumos/Gestao/Rescard"
                options={{
                    headerShown: true,
                    title: 'Cartão',
                    headerTintColor: "#f5f5f5",
                }} /> */}

            <Stack.Screen
                name="/Resumos/Gestao/ResAuto"
                options={{
                    headerShown: true,
                    title: "Automóveis",
                    headerTintColor: "#f5f5f5",
                }} />

            {/* <Stack.Screen
                name="/Resumos/Gestao/ResConceitos"
                options={{
                    headerShown: true,
                    title: "Conceitos",
                    headerTintColor: "#f5f5f5",
                }} />
            <Stack.Screen
                name="/Resumos/Gestao/ResImovel"
                options={{
                    headerShown: true,
                    title: "Imóveis",
                    headerTintColor: "#f5f5f5",
                }} />

            <Stack.Screen
                name="/Resumos/Investimentos/ResBolsa"
                options={{
                    headerShown: true,
                    title: "Bolsa de Valores",
                    headerTintColor: "#f5f5f5",
                }} />

            <Stack.Screen
                name="/Resumos/Investimentos/ResConceitosTaxa"
                options={{
                    headerShown: true,
                    title: "Taxas",
                    headerTintColor: "#f5f5f5",
                }} />

            <Stack.Screen
                name="/Resumos/Investimentos/ResFundo"
                options={{
                    headerShown: true,
                    title: "Fundo Imobiliário",
                    headerTintColor: "#f5f5f5",
                }} />

            <Stack.Screen
                name="/Resumos/Investimentos/ResTesouro"
                options={{
                    headerShown: true,
                    title: "Tesouro Direto",
                    headerTintColor: "#f5f5f5",
                }} /> */}

            {/* Desafios */}

            {/* <Stack.Screen
                name="/Desafios/GestaoD/DAuto"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} /> */}
            {/* <Stack.Screen
                name="/Desafios/GestaoD/DImovel"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />
                 <Stack.Screen
                name="senha"
                options={{
                    headerShown: true,
                    title: "sneha",
                    headerTintColor: "#f5f5f5",
                }} /> */}
                 {/* <Stack.Screen
                name="/Desafios/GestaoD/TelaConceitos"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />
            <Stack.Screen
                name="/Desafios/InvestimentosD/DConceitosTaxa"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />

            <Stack.Screen
                name="/Desafios/InvestimentosD/DBolsa"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />

            <Stack.Screen
                name="/Desafios/InvestimenotosD/DCard"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} /> */}
                <Stack.Screen
                name="/Desafios/TelaDesafio"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />
            <Stack.Screen
                name="desempenho"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />
            
            <Stack.Screen
                name="tiduvida"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />

            <Stack.Screen
                name="/duvidaResult/index"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />

                {/* recuperação de senha */}

                <Stack.Screen
                name="/recSsenha/esqueci-senha"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />
                 <Stack.Screen
                name="/recSsenha/resetar-senha"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />
                <Stack.Screen
                name="/recSsenha/nova-senha"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />

                <Stack.Screen
                name="/Prof2/page1"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />
                <Stack.Screen
                name="/Prof2/lista"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />
                <Stack.Screen
                name="/Prof2/inSala"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />
                <Stack.Screen
                name="/Alunos/EntrarSala"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />
                <Stack.Screen
                name="/Alunos/MinhasSalas"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />
                
                 <Stack.Screen
                name="duvidas"
                options={{
                    headerShown: true,
                    title: "",
                    headerTintColor: "#f5f5f5",
                }} />


        </Stack>


    );
}