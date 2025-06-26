import { View, Text, ActivityIndicator, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import ProfilePictureUpload from '../funcaoP';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function Perfil() {
  const [userId, setUserId] = useState<string | null>(null);
  const [nome, setNome] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
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

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        console.error('Erro ao obter usuário:', error);
        return;
      }

      setNome(user.user_metadata?.name || 'Usuário');
      setEmail(user.email || 'Não informado');
      setUserId(user.id);

      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Erro ao buscar avatar:', profileError);
      } else if (profileData?.avatar_url) {
        try {
          const publicUrl = await fetchProfilePictureUrl(profileData.avatar_url);
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
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      setAvatarUrl(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        setNome(session.user.user_metadata?.name || 'Usuário');
        setEmail(session.user.email || 'Não informado');
        fetchUserData();
      } else {
        setUserId(null);
        setNome(null);
        setEmail(null);
        setAvatarUrl(null);
      }
    });

    return () => authListener?.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.replace('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container2}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00C20D" />
        </View>
      </View>
    );
  }

  if (!userId) {
    return (
      <View style={styles.container}>
        <Text style={styles.loginMessage}>Por favor, faça login para acessar seu perfil</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        {avatarUrl ? (
          <Image
            source={{ uri: avatarUrl }}
            style={styles.profileImage}
            onError={() => setAvatarUrl(null)}
          />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Ionicons name="person" size={60} color="#00C20D" />
          </View>
        )}

        <ProfilePictureUpload userId={userId} onUpload={fetchUserData} />

        <Text style={styles.userName}>{nome}</Text>
        {/* <Text style={styles.userEmail}>{email}</Text> */}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Minha conta</Text>

        <View style={styles.menuItem}>
          <Ionicons name="person-circle" size={24} color="#00C20D" />
          <View style={styles.infoContainer}>
            <Text style={styles.menuItemText}>Informações pessoais</Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => router.push('rec-senha/nova-senha')}
        >
          <Ionicons name="lock-closed" size={24} color="#00C20D" />
          <Text style={styles.menuItemText}>Mudar senha</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      {/* <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>

        <View style={styles.menuItem}>
          <Ionicons name="notifications" size={24} color="#00C20D" />
          <Text style={styles.menuItemText}>Notificações</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </View>
      </View> */}

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001E57',
  },
  container2: {
    flex: 1,
    backgroundColor: "#001e3c",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderContainer: {
    backgroundColor: "#002b57",
    padding: 20,
    borderRadius: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loginMessage: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginTop: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: '#001E57',
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#00C20D',
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#002b57',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#00C20D',
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: '#ccc',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 15,
    marginHorizontal: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00C20D',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  emailText: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  logoutButton: {
    margin: 20,
    padding: 15,
    backgroundColor: '#d32f2f',
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
