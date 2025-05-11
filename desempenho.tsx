
import * as React from "react";
import {  StyleSheet, View, Text, ImageBackground } from "react-native";
import { PieChart } from 'react-native-svg-charts';
import { supabase } from "../lib/supabase";
import { useDataStore } from "../../store/dataQuestions";
import { api } from "../../services/api2";
import { useQuery } from "@tanstack/react-query";
import {Data} from "../../types/dataQuestion";

interface ResponseData{
	data: Data
}

const background = require("../assets/Saldo3.png");


const ResumoGrfico = () => {
  
  const [score, setScore] = React.useState<number>(0);
  const [nscore, setNScore] = React.useState<number>(0);

  const {data, isFetching, error} = useQuery({
	queryKey: ["questao"],
	queryFn: async ()=> {
		try{
			if(!user){
				throw new Error("Failed")
			}

			const response = await api.get<ResponseData>("/teste")
			// const response = await api.post("/create", {
			// 	questao1: user.questao1,
			// 	questao2: user.questao2,
			// 	questao3: user.questao3
			// })
			console.log(response.data)
			return response.data
		}
		catch(err){
			console.log(err);
		}
	}
  })

  const setPageOne = useDataStore(state => state.setPageOne)

  const user = useDataStore(state => state.user)
  console.log(user);

  function handleCreate(data: FormData){
	console.log("passando dados");
	setPageOne({
		questao1: data.questao1,
		questao2: data.questao2,
		questao3: data.questao3,
	})
  }

  React.useEffect(() => {

    const fetchUserData = async () => {
      const userScore = await UserScore();
      const userNScore = await UserNScore();

      setScore(userScore);
      setNScore(userNScore);
    };

    fetchUserData();
  }, []);


  const UserScore = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.error('Erro ao obter usuário:', error);
      return 0;
    }

    const userId = data.user.id;

    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('score')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Erro ao buscar pontuação:', fetchError);
      return 0;
    }

    return userData?.score || 0;
  };


  const UserNScore = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.error('Erro ao obter usuário:', error);
      return 0;
    }

    const userId = data.user.id;

    const { data: userData, error: fetchError } = await supabase
      .from('users')
      .select('nscore')
      .eq('id', userId)
      .single();

    if (fetchError) {
      console.error('Erro ao buscar pontuação:', fetchError);
      return 0;
    }

    return userData?.nscore || 0;
  };

 
  const data2 = [score, nscore];


  const pieData = data2
    .filter((value) => value > 0)
		.map((value, index) => ({
      value,
      svg: {
        fill: index === 0 ? '#00c20d' : '#e11919',
        onPress: () => console.log('press', index),
      },
      key: `pie-${index}`,
    }));

	if(isFetching){
		return(
			<View>
				<Text>Gerando questoes</Text>
			</View>
		)
	}
	if(error){
		return(
			<View>
				<Text>falha ao Gerando questoes</Text>
			</View>
		)
	}
  return (
    <View style={styles.resumoGrfico}>
		<ImageBackground source={background} style={styles.resumoGrfico}> 
      <PieChart style={{ height: 400 }} data={pieData} />
     
      <View style={styles.resumoGrficoChild} />
      <Text style={[ styles.errosLayout]}>Acertos</Text>
      <Text style={[ styles.errosLayout]}>Erros</Text>
     
		<View style={styles.rere}>

			<View style={styles.rere1}>
			<View style={styles.acerto1}/><Text style={styles.desem}>Acertos: {score}</Text>
			</View>

			<View style={styles.rere2}>
			<View style={styles.acerto2}/><Text style={styles.desem}>Erros: {nscore}</Text>
			</View>
{/* atualiar para vint2 */}
		</View>
		<View>
			<Text>dasdsda</Text>
		</View>
		</ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
 
  resumoGrfico1FlexBox: {
    textAlign: "center",
    color: "#fff",
    lineHeight: 99,
    letterSpacing: 0,
    position: "absolute"
  },
  desem:
  {
	fontFamily: 'system-ui',
	elevation:10,
	fontSize:20,
	marginTop: '25%',
  },
  acerto1:
  {
	width:25,
	height:25,
	backgroundColor: "#00C20D",
	marginRight:1,
	marginLeft: 10,
	marginTop: 50,
	borderRadius:5,
  },
  acerto2:
  {
	width:25,
	height:25,
	backgroundColor: "#e11919",
	marginRight:1,
	marginLeft: 10,
	marginTop: 50,
	borderRadius:5,
  },
	rectangleViewShadowBox: {
		height: 36,
		backgroundColor: "rgba(245, 245, 245, 0.81)",
		transform: [
			{
				rotate: "-128.2deg"
			}
		],
		borderRadius: 20,
		shadowOpacity: 1,
		elevation: 4,
		shadowRadius: 4,
		shadowOffset: {
			width: 0,
			height: 4
		},
		shadowColor: "rgba(0, 0, 0, 0.25)",
		width: 394,
		position: "absolute"
	},
	rere1:
	{
		width: 'auto',
		height:'auto',
		flexDirection:'row',
		gap:10,

	},
	rere2:
	{
		width: 'auto',
		height:'auto',
		flexDirection:'row',
		gap:27,

	},

	rere:
	{
		marginTop: "25%",
		marginLeft:"25%",
		width:200,
		height:200,
		backgroundColor:"#F5F5F5",
		borderRadius: 8,
		textAlign: 'center',
		alignItems:'center',
	},
	textTypo: {
		fontFamily: "Sintony",
		textAlign: "center",
		color: "#fff",
		lineHeight: 99,
		letterSpacing: 0,
		fontSize: 36,
		position: "absolute"
	},
	resumoChildShadowBox1: {
		height: 169,
		width: 110,
		shadowColor: "rgba(0, 0, 0, 0.5)",
		left: 47,
		top: 575,
		borderRadius: 10,
		shadowOpacity: 1,
		elevation: 4,
		shadowRadius: 4,
		shadowOffset: {
			width: 0,
			height: 4
		},
		position: "absolute"
	},
	errosLayout: {
		height: 31,
		width: 58,
		justifyContent: "center",
		alignItems: "center",
		display: "flex",
		color: "#001e57",
		fontSize: 14,
		fontFamily: "Sintony",
		textAlign: "center",
		lineHeight: 99,
		letterSpacing: 0,
		position: "absolute"
	},
	resumoChildLayout: {
		height: 16,
		width: 15,
		borderRadius: 6,
		left: 59,
		position: "absolute"
	},
	rectangleIconPosition: {
		opacity: 0.75,
		left: -4,
		position: "absolute"
	},
	iconLayout: {
		height: "100%",
		overflow: "hidden",
		width: "100%"
	},
	userLayout: {
		height: 24,
		width: 24,
		top: 810,
		position: "absolute"
	},
	resumoChildShadowBox: {
		backgroundColor: "#00c20d",
		shadowOpacity: 1,
		elevation: 4,
		shadowRadius: 4,
		shadowOffset: {
			width: 0,
			height: 4
		},
		shadowColor: "rgba(0, 0, 0, 0.25)"
	},
	cpiaDeSaldo22: {
		top: -80,
		left: -508,
		width: 2160,
		height: 1080,
		position: "absolute"
	},
	resumoGrficoChild: {
		top: 786,
		left: -1,
		backgroundColor: "rgba(16, 112, 180, 0.95)",
		height: 72,
		width: 394,
		position: "absolute"
	},
	resumoGrfico1: {
		top: 112,
		left: 6,
		fontWeight: "700",
		fontFamily: "Poppins-Bold",
		fontSize: 36,
		textAlign: "center",
		color: "#fff",
		lineHeight: 99,
		letterSpacing: 0
	},
	resumoGrficoItem: {
		left: 474,
		height: 133,
		transform: [
			{
				rotate: "-128.2deg"
			}
		],
		shadowOpacity: 1,
		elevation: 4,
		shadowRadius: 4,
		shadowOffset: {
			width: 0,
			height: 4
		},
		shadowColor: "rgba(0, 0, 0, 0.25)",
		backgroundColor: "#f5f5f5",
		borderRadius: 20,
		top: 278,
		width: 394,
		position: "absolute"
	},
	resumoGrficoInner: {
		top: 250,
		left: 429
	},
	rectangleView: {
		top: 248,
		left: 450
	},
	saldo22: {
		top: 0,
		left: 314,
		width: 95,
		height: 95,
		position: "absolute"
	},
	designSemNome11: {
		top: 174,
		left: -317,
		borderRadius: 30,
		width: 1054,
		height: 593,
		position: "absolute"
	},
	ellipseIcon: {
		top: 281,
		left: 61,
		position: "absolute"
	},
	resumoGrficoChild1: {
		left: 63,
		top: 278,
		position: "absolute"
	},
	text: {
		top: 300,
		left: 197
	},
	text1: {
		top: 410,
		left: 128
	},
	resumoGrficoChild3: {
		backgroundColor: "#f5f5f5",
		height: 169,
		width: 110,
		shadowColor: "rgba(0, 0, 0, 0.5)",
		left: 47,
		top: 575
	},
	resumoGrficoChild4: {
		backgroundColor: "rgba(245, 245, 245, 0.85)",
		borderColor: "#00c20d",
		borderWidth: 2,
		borderStyle: "solid"
	},
	resumoGrficoChild5: {
		top: 585,
		left: 53,
		backgroundColor: "rgba(245, 245, 245, 0.83)",
		width: 97,
		height: 149,
		borderRadius: 10,
		shadowOpacity: 1,
		elevation: 4,
		shadowRadius: 4,
		shadowOffset: {
			width: 0,
			height: 4
		},
		shadowColor: "rgba(0, 0, 0, 0.25)",
		position: "absolute"
	},
	resumoGrficoChild6: {
		top: 612,
		backgroundColor: "#93d333"
	},
	resumoGrficoChild7: {
		backgroundColor: "#e11919",
		top: 652
	},
	estatisticaGeral: {
		top: 179,
		left: 100,
		fontSize: 24,
		fontFamily: "Poppins-Regular"
	},
	resumoGrficoChild8: {
		top: 788,
		borderRadius: 12,
		borderColor: "rgba(129, 199, 132, 0.5)",
		borderWidth: 1,
		width: 408,
		height: 12,
		backgroundColor: "#00c20d",
		shadowOpacity: 1,
		elevation: 4,
		shadowRadius: 4,
		shadowOffset: {
			width: 0,
			height: 4
		},
		shadowColor: "rgba(0, 0, 0, 0.25)",
		borderStyle: "solid"
	},
	rectangleIcon: {
		top: 800,
		borderRadius: 2
	},
	icon: {
		maxWidth: "100%",
		maxHeight: "100%",
		// nodeWidth: "9.16%",
		// nodeHeight: "4.23%"
	},
	iconHelpOutline: {
		left: "82.44%",
		top: "95.07%",
		right: "8.4%",
		bottom: "0.7%",
		width: "9.16%",
		height: "4.23%",
		position: "absolute"
	},
	resumoGrficoChild9: {
		top: 803,
		left: 220,
		position: "absolute"
	},
	icon1: {
		// nodeWidth: 24,
		// nodeHeight: 24
	},
	user: {
		left: 130
	},
	home: {
		left: 33
	},
	barChartIcon: {
		left: 227,
		overflow: "hidden"
	},
	resumoGrficoChild10: {
		top: -174,
		left: 101,
		width: 933,
		height: 7,
		borderRadius: 20,
		backgroundColor: "#00c20d",
		position: "absolute"
	},
	resumoGrfico: {
		backgroundColor: "#001e57",
		flex: 1,
		height: 852,
		overflow: "hidden",
		width: "100%"
	}
});

export default ResumoGrfico;
