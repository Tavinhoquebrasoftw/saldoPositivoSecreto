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

            // const response = await api.get<ResponseData>("/teste")

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

       <View style={{ paddingLeft: 16, paddingRight: 16, flex:1}}>
        {data && Object.keys(data).length > 0 && (
            <>
                <Text style={styles.duvida}>{data.resposta}</Text>

                <ScrollView>
                    <View style={styles.foods}>
                        <View style={styles.food}>
                            <View>
                        <Text>Resposta</Text>
                            </View>
                            <Text>{data.resposta}</Text>
                    </View>
                    </View>
                </ScrollView>
            </>

        )}
       </View>
   </View>
  );
}

const styles = StyleSheet.create({
    loading:{
        flex:1,
        backgroundColor: "#black",
        justifyContent:'center',
        alignItems:'center'
    },
    loadingText:{
        fontSize: 18,
        color: "#FFFFFF",
        marginBottom:4,
        justifyContent:'center',
        alignItems: 'center'

    },
    container:{
        backgroundColor: "black",
        flex:1,
    },
    containerHeader:{
        backgroundColor: "#F5F5F5",
        borderBottomLeftRadius:14,
        borderBottomRightRadius:14,
        paddingTop:60,
        paddingBottom:20,
        marginBottom:16,
    },
    contentHeader:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'space-between',
        paddingLeft: 16,
        paddingRight: 16
    },
    title:{
        fontSize:28,
        color: "black",
        fontWeight: 'bold'
    },
    buttonShare:{
        backgroundColor: "#1E90FF",
        alignItems:'center',
        justifyContent: 'center',
        padding: 8,
        borderRadius: 4,
    },
    buttonShareText:{
        color: "#FFFFFF",
        fontWeight: '500',
    },
    duvida:{
        fontSize: 20,
        color: "#F5F5F5",
        fontWeight: 'bold'
    },
    foods:{
        backgroundColor: "#FFFFFF",
        padding: 14,
        borderRadius: 8,
        marginTop: 8,
        gap:8,
    },

    food:{
        backgroundColor: 'rgba(208, 208, 208, 0.40)',
        padding: 8,
        borderRadius: 4,
    }
})
