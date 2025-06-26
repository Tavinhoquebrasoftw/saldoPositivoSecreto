import { router } from "expo-router";
import * as React from "react";
import { useState, useEffect } from "react";
import { StyleSheet, View, Image, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { supabase } from "../../lib/supabase";
import { Ionicons } from '@expo/vector-icons';

const Frame = () => {
  const [score, setScore] = useState(0);
  const [nome, setNome] = useState('');
  const [jornada, setJornada] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfilePictureUrl = async (path: string) => {
    if (!path) return null;
    try {
      const { data } = await supabase.storage
        .from('avatars')
        .getPublicUrl(path);
      
      return data?.publicUrl || null;
    } catch (error) {
      console.error('Erro ao buscar URL pública:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error || !user) {
          console.error('Erro ao obter usuário:', error);
          return;
        }

        setNome(user.user_metadata?.name || 'Usuário');
        
        const { data: userData, error: fetchError } = await supabase
          .from('users')
          .select('score, avatar_url')
          .eq('id', user.id)
          .single();

        if (fetchError) {
          console.error('Erro ao buscar dados do usuário:', fetchError);
        } else {
          setScore(userData.score);
          if (userData.avatar_url) {
            try {
              const publicUrl = await fetchProfilePictureUrl(userData.avatar_url);
              if (publicUrl) {
                // Verifica se a imagem existe
                const response = await fetch(publicUrl);
                if (response.ok) {
                  setAvatarUrl(publicUrl);
                } else {
                  console.warn('Avatar não encontrado no storage');
                  setAvatarUrl(null);
                }
              }
            } catch (error) {
              console.error('Erro ao verificar avatar:', error);
              setAvatarUrl(null);
            }
          } else {
            setAvatarUrl(null);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        setAvatarUrl(null);
      } finally {
        setLoading(false);
      }
    };

    Jornada();
    fetchUserData();
  }, []);

  const Jornada = () => {
    setJornada(1); // Exemplo: 1% completada
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00C20D" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        
        {/* Header simplificado */}
        <View style={styles.headerContainer}>
          <View style={styles.profileRow}>
            {avatarUrl ? (
              <Image 
                source={{ uri: avatarUrl }} 
                style={styles.profileImage} 
                onError={() => setAvatarUrl(null)}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Ionicons name="person" size={24} color="#fff" />
              </View>
            )}
            <Text style={styles.title}>Olá, {nome}</Text>
            
            {/* Score alinhado à direita */}
            <View style={styles.scoreContainer}>
              <View style={styles.scoreBox}>
                <Image source={require('../../assets/Dollar.png')}/>
                <Text style={styles.subtitle}>Cash :{score}</Text>
              </View>
            </View>
          </View>
        </View>
        
        <View style={styles.content}>
          {/* Card de Jornada */}
          <View style={styles.jornadaCard}>
            <View style={styles.jornadaContent}>
              <View style={styles.jornadaTextContainer}>
                <Text style={styles.jornadaTitle}>Jornada</Text>
                <Text style={styles.jornadaSubtitle}>{jornada}% completada</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${jornada}%` }]} />
              </View>
            </View>
          </View>

          {/* Cards principais */}

          
          <View style={styles.buttonsContainer}>

            
            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('pesquisar/pesquisar')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#00BFFF' }]}>
                <Ionicons name="search-circle" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Pesquise</Text>
            </TouchableOpacity>

             <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('NivelIC')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#0038ff' }]}>
                <Ionicons name="analytics-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Gestão</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('NivelIC2')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#FFA500' }]}>
                <Ionicons name="stats-chart" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Investimentos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('duvidas/duvidas')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#00FF57' }]}>
                <Ionicons name="help-circle-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Dúvidas</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('Prof2/page1')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#00FFBF' }]}>
                <Ionicons name="people-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Salas</Text>
            </TouchableOpacity>


            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('ranking/ranking')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#f9c82f' }]}>
                <Ionicons name="trophy-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Ranking Geral</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('desempenhoMenu')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#32CD32' }]}>
                <Ionicons name="rocket-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Meu desempenho</Text>
            </TouchableOpacity>

             <TouchableOpacity 
              style={styles.card}
              onPress={() => router.push('certificado/certificado')}
            >
              <View style={[styles.iconCircle, { backgroundColor: '#A52A2A' }]}>
                <Ionicons name="book-outline" size={24} color="#fff" />
              </View>
              <Text style={styles.cardTitle}>Conquistar meu certificado</Text>
            </TouchableOpacity>

          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001e57',
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Adiciona espaço entre os itens
  },
  scoreContainer: {
    flex: 1,
    alignItems: 'flex-end', // Alinha o score à direita
  },
  scoreBox: {
    flexDirection: 'row',
    backgroundColor: '#001e57',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: "#001e57",
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    backgroundColor: '#00C20D',
    padding: 20,
    paddingTop: 40,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileImagePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#001e57',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  jornadaCard: {
    backgroundColor: '#002f7a',
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  jornadaContent: {
    flexDirection: 'column',
  },
  jornadaTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  jornadaTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  jornadaSubtitle: {
    color: '#cfd3d6',
    fontSize: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4caf50',
  },
  buttonsContainer: {
    marginTop: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#002f7a',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Frame;
