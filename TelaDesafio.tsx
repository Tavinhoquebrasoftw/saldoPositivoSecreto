import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { getQuestionsByModule } from '../../../services/getQuestions';

const TelaDesafio = () => {
  interface Question {
    id: string;
    pergunta: string;
    resposta: string;
    alternativaA: string;
    alternativaB: string;
    alternativaC: string;
    alternativaD: string;
  }

  // Alternativas
  type AlternativaKey = 'alternativaA' | 'alternativaB' | 'alternativaC' | 'alternativaD';

  const { module } = useLocalSearchParams();
  const moduleString = Array.isArray(module) ? module[0] : module;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!moduleString) {
      console.warn("Módulo não informado");
      setLoading(false);
      return;
    }

    const fetchQuestions = async () => {
      const data = await getQuestionsByModule(moduleString);
      setQuestions(data);
      setLoading(false);
    };

    fetchQuestions();
  }, [moduleString]);

  const [wrongQuestions, setWrongQuestions] = useState<string[]>([]);

const handleAnswer = (option: string) => {
  if (showAnswer) return;

  setSelected(option);
  setShowAnswer(true);

  const correctLetter = questions[current].resposta;
  const isCorrect = option === correctLetter;

  if (isCorrect) {
    setScore((prev) => prev + 1);
  } else if (wrongQuestions.length < 3) {
    setWrongQuestions(prev => [...prev, questions[current].pergunta]);
  }

  setTimeout(() => {
    setSelected(null);
    setShowAnswer(false);
    setCurrent((prev) => prev + 1);
  }, 1500);
};



  if (loading) {
    return (
      <View style={styles.container2}>
                  <View style={styles.loaderContainer}>
                    <ActivityIndicator size="large" color="#00ff00" />
                  </View>
                </View>
    );
  }

  if (!loading && questions.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Nenhuma pergunta encontrada para este módulo.</Text>
      </View>
    );
  }

  if (current >= questions.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>Fim do módulo!</Text>
        <Text style={styles.subtitle}>Pontuação: {score} / {questions.length}</Text>
        <TouchableOpacity
        style={styles.button}
     onPress={() => {
    router.push({
      pathname: '/desempenho',
      params: {
        correctAnswers: score.toString(),
        totalQuestions: questions.length.toString(),
        questao1: wrongQuestions[0] || '',
        questao2: wrongQuestions[1] || '',
        questao3: wrongQuestions[2] || '',
        module: moduleString || ''
      }
    });
  }}
>
  <Text style={styles.buttonText}>Ver desempenho</Text>
</TouchableOpacity>
      </View>
    
    );
  }

  const currentQuestion = questions[current];
  const alternativas = ['A', 'B', 'C', 'D'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{moduleString}</Text>
      <Text style={styles.question}>{currentQuestion.pergunta}</Text>

      {alternativas.map((key) => {
        const keyName = `alternativa${key}` as AlternativaKey;
        const optionText = currentQuestion[keyName];
        const isCorrect = currentQuestion.resposta === key;
        const isSelected = selected === key;

        let backgroundColor = "#eee";
        if (showAnswer) {
          if (isCorrect) backgroundColor = "#4caf50"; // verde
          else if (isSelected) backgroundColor = "#f44336"; // vermelho
        }
        if (showAnswer) {
          if (key === currentQuestion.resposta) {
            backgroundColor = "#4caf50"; // verde se é a correta
          } else if (isSelected) {
            backgroundColor = "#f44336"; // vermelho se foi a errada escolhida
          }
        }

        return (
          <TouchableOpacity
            key={key}
            style={[styles.option, { backgroundColor }]}
            onPress={() => handleAnswer(key)}
          >
            <Text style={styles.optionText}>{key}) {optionText}</Text>
          </TouchableOpacity>
        );
      })}

      <Text style={styles.progress}>
        Pergunta {current + 1} de {questions.length}
      </Text>
    </View>
  );
};

export default TelaDesafio;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
   container2: {
      flex: 1,
      backgroundColor: "#001e3c", // azul escuro
      justifyContent: "center",
      alignItems: "center",
    },
    button: {
  backgroundColor: '#001e57',
  padding: 15,
  borderRadius: 10,
  marginTop: 20,
},
buttonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},
    loaderContainer: {
      backgroundColor: "#002b57", // um tom ainda mais escuro, opcional
      padding: 20,
      borderRadius: 20,
    },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 10,
  },
  question: {
    fontSize: 18,
    marginBottom: 20,
  },
  option: {
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  optionText: {
    fontSize: 16,
  },
  progress: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
});
