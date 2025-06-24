//antigo - sem salvar duvida
import { Pressable, ScrollView, StyleSheet, Text, View, Share } from 'react-native';
import {useDataStore} from '../../../store/data'
import {api} from '../../../services/api'
import {useQuery} from '@tanstack/react-query'
import {Data} from '../../../types/data'
import { Link } from 'expo-router';

interface ResponseData{
    data: Data
}

export default function duvidaResult() {
    const user = useDataStore(state => state.user)
   
    const {data, isFetching, error, refetch} = useQuery({
        queryKey: ["duvidaResult", user?.duvida],
        queryFn: async () =>{
            try{
                if(!user?.duvida){
                    throw new Error("Failed load duvidaResult")
                }

                const response = await api.post("/create", {
                    duvida: user.duvida,
                })

                return response.data.data

            }catch(err){
                console.log(err); 
                throw err;
            }
        },
        enabled: !!user?.duvida
    });

    async function handleShare(){
        try{
            if(data && Object.keys(data).length === 0) return;

            const supllments = `${data?.resposta}`

            const message = `Resposta: ${supllments}`

            await Share.share({
                message: message
            })

        }catch(err){
            console.log(err);
        }
    }

    if(isFetching){
        return(
            <View style={styles.loading}>
                <Text style={styles.loadingText}>Gerando, trabalhando nisso</Text>
            </View>
        )
    }

    if(error){
        return(
            <View style={styles.loading}>
                <Text style={styles.loadingText}>Deu erro</Text>
                <Link href="/">
                    <Text style={styles.loadingText}>Tente Novamente</Text>
                </Link>
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerHeader}>
                <View style={styles.contentHeader}>
                    <Text style={styles.title}>tira duvida</Text>
                    <Pressable style={styles.buttonShare} onPress={handleShare}>
                        <Text style={styles.buttonShareText}>Compartilhar</Text>
                    </Pressable>
                </View>
            </View>

            <View style={styles.content}>
                {data && Object.keys(data).length > 0 && (
                    <>
                        <View style={styles.questionContainer}>
                            <Text style={styles.questionLabel}>Duvida</Text>
                            <Text style={styles.questionText}>{user?.duvida}</Text>
                        </View>

                        <View style={styles.answerContainer}>
                            <Text style={styles.answerLabel}>Resposta</Text>
                            <Text style={styles.answerText}>{data.resposta}</Text>
                        </View>

                        <Pressable style={styles.saveButton}>
                            <Text style={styles.saveButtonText}>Salvar Resposta</Text>
                        </Pressable>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        backgroundColor: "#001e57",
        justifyContent: 'center',
        alignItems: 'center'
    },
    loadingText: {
        fontSize: 18,
        color: "#FFFFFF",
        marginBottom: 4,
    },
    container: {
        backgroundColor: "#FFFFFF",
        flex: 1,
    },
    containerHeader: {
        backgroundColor: "#001e57",
        paddingTop: 60,
        paddingBottom: 20,
    },
    contentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        color: "#FFFFFF",
        fontWeight: 'bold'
    },
    buttonShare: {
        backgroundColor: "#1E90FF",
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
    },
    buttonShareText: {
        color: "#FFFFFF",
        fontWeight: '500',
    },
    content: {
        flex: 1,
        padding: 16,
    },
    questionContainer: {
        backgroundColor: "#F5F5F5",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    questionLabel: {
        fontSize: 16,
        color: "#001e57",
        fontWeight: 'bold',
        marginBottom: 8,
    },
    questionText: {
        fontSize: 16,
        color: "#333333",
    },
    answerContainer: {
        backgroundColor: "#E8F5E9",
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    answerLabel: {
        fontSize: 16,
        color: "#2E7D32",
        fontWeight: 'bold',
        marginBottom: 8,
    },
    answerText: {
        fontSize: 16,
        color: "#333333",
    },
    saveButton: {
        backgroundColor: "#4CAF50",
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: "#FFFFFF",
        fontWeight: 'bold',
        fontSize: 16,
    },
});
