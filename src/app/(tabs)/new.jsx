import * as React from "react";
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Alert } from "react-native";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { horarioAndProfissional } from '../components/Dropdown/horarios';
import Horario from '../components/Dropdown/horarios';
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from "../firebaseConfig";

let jsonValue;
let user;
let agendamentos = []

export default function Agendamentos() {

    const [day, setDay] = React.useState([]); // Dias do agendamento
    const [Bolean, setBolean] = React.useState(false); // Verificador dos botões
    const [btn, setBtn] = React.useState("✚ NOVO"); // Texto do botão
    const [color, setColor] = React.useState("#27A4FE"); // Cor do botão
    const [getUsers, setGetUsers] = React.useState([]); // Valores do AsyncStorage

    // Função de calendário
    function Calendario() {
        if (Bolean === false) {
            setBolean(true);
            setBtn("✔ SALVAR");
            setColor("rgba(68, 229, 3, 0.54)");
        }

        const getData = async () => {
            try {
                user = jsonValue = await AsyncStorage.getItem('my-key');
                user = jsonValue != null ? JSON.parse(jsonValue) : null;
                console.log(jsonValue + 'storage'); // Variável vindo do AsyncStorage
            } catch (e) {
                console.error('Erro ao obter dados do AsyncStorage:', e);
            }
        };

        getData();
        console.log(Bolean);
    }

    // Função para verificar e registrar o agendamento
    async function RegistrarAgendamento() {
        if (Bolean === true) {
            setBolean(false);
            setBtn("✚ NOVO");
            setColor("#27A4FE");

            const agendamentoData = {
                id: user.id,
                nomeSolicitante: user.nome,
                data: day.dateString,
                idProfissional: horarioAndProfissional.id,
                hora: horarioAndProfissional.horario,
                nome: horarioAndProfissional.nome
            };

            // Verificar se já existe agendamento para o mesmo horário e dia
            const agendamentosRef = collection(db, "profissionais", horarioAndProfissional.id, "agendamentos");
            const q = query(agendamentosRef, where("data", "==", day.dateString), where("hora", "==", horarioAndProfissional.horario));
            const agendamentosSnapshot = await getDocs(q);

            if (!agendamentosSnapshot.empty) {
                // Se já existir agendamento para a mesma data e hora, mostrar alerta
                Alert.alert("Erro", "Já existe um agendamento neste horário e dia.");
                return;
            }

            // Se não houver agendamento, registrar o novo
            await addDoc(agendamentosRef, agendamentoData)
                .then((snapshot) => {
                    console.log('Agendamento registrado com sucesso:', snapshot);
                    // Atualize a lista de agendamentos ou faça outra ação necessária
                })
                .catch((erro) => {
                    console.log('Erro ao registrar agendamento:', erro);
                    Alert.alert("Erro", "Não foi possível registrar o agendamento.");
                });
        }
    }

    React.useEffect(() => {
        console.log("Horários do profissional:", horarioAndProfissional);
    }, [Bolean, user]);

    LocaleConfig.locales['Br'] = {
        monthNames: [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ],
        monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
        dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sabado'],
        dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
        today: "Hoje"
    };

    LocaleConfig.defaultLocale = 'Br';

    return (
        <ScrollView style={styles.containerFull}>
            {Bolean &&
                <View style={styles.containerFullc}>
                    <Calendar
                        style={styles.calendar}
                        headerStyle={{ borderBottomWidth: 0.5, borderBottomColor: "rgba(0, 187, 240, 0.41)", marginBottom: 5, marginTop: -40 }}
                        theme={{
                            textMonthFontWeight: 'bold', selectedDayBackgroundColor: "#F5F5F5", selectedDayTextColor: "#000",
                            calendarBackground: "rgba(0, 187, 240, 0.2)",
                            todayTextColor: "#FFF",
                            textDisabledColor: "#717171",
                        }}
                        minDate={new Date().toDateString()}
                        onDayPress={setDay}
                        markedDates={day && {
                            [day.dateString]: { selected: true }
                        }}
                    />
                </View>
            }

            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: '15%' }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 5 }}>Novo Agendamento:</Text>
                <Horario />

                {btn === "✚ NOVO" &&
                    <TouchableOpacity
                        onPress={Calendario}
                        style={{
                            backgroundColor: color,
                            width: '90%',
                            padding: 15,
                            marginBottom: '42%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 4,
                            marginTop: 5
                        }} >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{btn}</Text>
                    </TouchableOpacity>
                }

                {btn === "✔ SALVAR" &&
                    <TouchableOpacity
                        onPress={RegistrarAgendamento}
                        style={{
                            backgroundColor: color,
                            width: '90%',
                            padding: 15,
                            marginBottom: '42%',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 4,
                            marginTop: 5
                        }} >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{btn}</Text>
                    </TouchableOpacity>
                }
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    containerFull: {
        flex: 1,
        width: '100%',
        height: '100%',
        margin: 'auto',
    },
    containerFullc: {
        width: '100%',
        marginBottom: '10%'
    },
    calendar: {
        width: '100%',
        backgroundColor: 'transparent',
        marginTop: '10%',
        marginBottom: 20
    },
    agenda: {
        width: '100%',
        height: 500
    },
    btnadd: {
        width: '80%',
        borderRadius: 4,
        padding: 50,
        fontWeight: 'bold',
        justifyContent: 'center',
        alignItems: 'center',
        margin: "auto",
        marginBottom: '20%'
    },
    containerPicker: {
        width: "90%",
        flexDirection: 'row',
        backgroundColor: "#fff",
        borderBottomEndRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto'
    },
});
