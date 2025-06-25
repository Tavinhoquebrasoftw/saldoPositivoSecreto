import * as React from "react";
import { StyleSheet, View, Text, ImageBackground, ActivityIndicator, Dimensions } from "react-native";
import { PieChart } from 'react-native-svg-charts';
import { supabase } from "../lib/supabase";
import { useDataStore } from "../../store/dataQuestions";
import { api } from "../../services/api2";
import { useQuery } from "@tanstack/react-query";
import { ResponseData1 } from "../../types/dataQuestion";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity } from "react-native";
import { Feather } from '@expo/vector-icons';
import { router } from "expo-router";

const { width } = Dimensions.get('window');

interface ResponseData {
  data: ResponseData1;
}
export interface NovaQuestao {
  enunciado: string;
  alternativas: string[];
  correta: number;
  feedback: string;
}

const background = require("../assets/Saldo3.png");

function Header({ title, showBackButton = true }: { title: string; showBackButton?: boolean }) {
  return (
    <View style={headerStyles.container}>
      <View style={headerStyles.content}>
        <View style={headerStyles.headerContent}>
          {showBackButton && (
            <TouchableOpacity 
              onPress={() => router.back()} 
              style={headerStyles.backButton}
            >
              <Feather name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
          )}
          
          <View style={headerStyles.titleContainer}>
            <Text style={headerStyles.title}>
              {title}
            </Text>
            <View style={headerStyles.decorativeLine} />
          </View>
        </View>
      </View>
    </View>
  );
}

const ResumoGrafico = () => {
  const {
    questao1,
    questao2,
    questao3,
    correctAnswers,
    totalQuestions,
    module
  } = useLocalSearchParams();

  const [score, setScore] = React.useState<number>(0);
  const [nscore, setNScore] = React.useState<number>(0);

    React.useEffect(() => {
    if (correctAnswers && totalQuestions) {
      const correct = parseInt(correctAnswers as string);
      const total = parseInt(totalQuestions as string);
      setScore(correct);
      setNScore(total - correct);
    }
  }, [correctAnswers, totalQuestions]);

  const user = useDataStore((state) => state.user);
  const [newQuestions, setNewQuestions] = React.useState<NovaQuestao[]>([]);
  const [loadingNew, setLoadingNew] = React.useState(false);

  const { data, isFetching, error } = useQuery<ResponseData>({
    queryKey: ["questao", questao1, questao2, questao3],
    queryFn: async () => {
      if (!user) throw new Error("Usuário não autenticado.");
      const response = await api.post<ResponseData>("/create", {
        questao1,
        questao2,
        questao3,
      });
      return response.data;
    },
  });
console.log({
  correctAnswers,
  totalQuestions,
  questao1,
  questao2,
  questao3,
  module
});

  const handleGenerateNew = async () => {
    try {
      setLoadingNew(true);
      const response = await api.post("/create", {
        questao1,
        questao2,
        questao3,
      });
      setNewQuestions(response.data.data.questoes);
    } catch (err) {
      console.error("Erro ao gerar novas questões:", err);
    } finally {
      setLoadingNew(false);
    }
  };

  const pieData = [
    {
      value: score,
      svg: { fill: '#00c20d' },
      key: 'pie-correct',
    },
    {
      value: nscore,
      svg: { fill: '#e11919' },
      key: 'pie-incorrect',
    }
  ].filter(item => item.value > 0);

  if (isFetching) {
    return (
      <View style={styles.container}>
        <Header title="" />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#00ff00" />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Header title="Resumo" />
        <View style={styles.centered}>
          <Text style={styles.errorText}>Erro ao carregar dados.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Desempenho" />
      <ImageBackground source={background} style={styles.backgroundImage}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.chartContainer}>
            <View style={{ height: 250, width: width - 40, justifyContent: 'center', alignItems: 'center' }}>
              {pieData.length > 0 ? (
                <PieChart
                  style={{ height: 250, width: width - 40 }}
                  data={pieData}
                  innerRadius={'60%'}
                  padAngle={0}
                />
              ) : (
                <Text style={styles.noDataText}>Nenhum dado disponível</Text>
              )}
            </View>
            
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.colorBox, { backgroundColor: '#00c20d' }]} />
                <Text style={styles.label}>Acertos: {score}</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.colorBox, { backgroundColor: '#e11919' }]} />
                <Text style={styles.label}>Erros: {nscore}</Text>
              </View>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.generateButton}
              onPress={handleGenerateNew}
              disabled={loadingNew}
            >
              <Text style={styles.buttonText}>Criar Novas Questões</Text>
            </TouchableOpacity>

             <TouchableOpacity 
              style={styles.generateButton}
              onPress={()=> router.replace('(tabs)/TelaMenu')}
              disabled={loadingNew}
            >
              <Text style={styles.buttonText}>Voltar para o Menu</Text>
            </TouchableOpacity>
            
            {loadingNew && (
              <ActivityIndicator size="large" color="#00ff00" style={{ marginTop: 20 }} />
            )}

            {newQuestions.length > 0 && (
              <View style={styles.questionsContainer}>
                <Text style={styles.sectionTitle}>Novas Questões Geradas</Text>
                {newQuestions.map((q, index) => (
                  <View key={index} style={styles.questionCard}>
                    <Text style={styles.questionTitle}>Pergunta {index + 1}</Text>
                    <Text style={styles.questionText}>{q.enunciado}</Text>
                    {q.alternativas.map((alt, i) => (
                      <Text key={i} style={styles.optionText}>
                        {String.fromCharCode(65 + i)}) {alt}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const headerStyles = StyleSheet.create({
  container: {
    backgroundColor: "#001e57",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    paddingTop: 40,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: "#FFF",
    marginBottom: 8,
  },
  decorativeLine: {
    height: 4,
    width: '40%',
    backgroundColor: '#FFF',
    borderRadius: 2,
    opacity: 0.7,
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#002b57",
    padding: 20,
    borderRadius: 20,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
  },
  noDataText: {
    color: '#001e57',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  legend: {
    marginTop: 20,
    width: '100%',
    paddingHorizontal: 30,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  label: {
    fontSize: 18,
    fontWeight: '600',
    color: "#001e57",
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  generateButton: {
    top:10,
    backgroundColor: '#001e57',
    margin:5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questionsContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#001e57',
    marginBottom: 15,
    textAlign: 'center',
  },
  questionCard: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  questionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 10,
    color: '#001e57',
  },
  questionText: {
    marginBottom: 15,
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  optionText: {
    marginBottom: 8,
    fontSize: 14,
    color: '#555',
  },
});

export default ResumoGrafico;
