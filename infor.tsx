import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getResumosByCard } from '../../../services/serviceGetResumo';
import { Resumo } from '../../../services/serviceGetResumo';

export default function ResumoCardScreen() {
  const { cardName } = useLocalSearchParams<{ cardName: string }>();
  const router = useRouter();
  const [resumos, setResumos] = useState<Resumo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!cardName) {
      router.back();
      return;
    }

    const fetchResumos = async () => {
      try {
        setLoading(true);
        const resumosData = await getResumosByCard(cardName);
        setResumos(resumosData);
        
        if (resumosData.length === 0) {
          setError('Nenhum resumo encontrado para este tópico.');
        }
      } catch (err) {
        console.error(err);
        setError('Erro ao carregar resumos. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchResumos();
  }, [cardName]);

  const handleRefresh = async () => {
    setError('');
    const resumosData = await getResumosByCard(cardName || '');
    setResumos(resumosData);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C20D" />
        <Text style={styles.loadingText}>Carregando resumos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
          {cardName}
        </Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <MaterialIcons name="refresh" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleRefresh} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {resumos.map((resumo) => (
            <View key={resumo.id} style={styles.card}>
              <Text style={styles.cardTitle}>{resumo.titulo}</Text>
              <Text style={styles.cardContent}>{resumo.conteudo}</Text>
              
              <View style={styles.cardFooter}>
                <Text style={styles.cardSource}>{resumo.fonte}</Text>
                <Text style={styles.cardDate}>{resumo.dataAtualizacao}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#001e57',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#001e57',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
  },
  refreshButton: {
    marginLeft: 12,
  },
  scrollContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#001e57',
    marginBottom: 12,
  },
  cardContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 8,
  },
  cardSource: {
    fontSize: 12,
    color: '#00C20D',
    fontStyle: 'italic',
  },
  cardDate: {
    fontSize: 12,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#d9534f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#00C20D',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
