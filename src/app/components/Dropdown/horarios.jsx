import * as React from "react";
import { StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { NameUser } from "../../index";

let horarioAndProfissional = []; // Objeto para armazenar os dados selecionados

export { horarioAndProfissional };

export default function Horarios({ value, label }) {
    const lista = [];
    const [profissionais, setProfissionais] = React.useState([]); // Estado para profissionais
    const [selectedProfissional, setSelectedProfissional] = React.useState(""); // Profissional selecionado
    const [selectedHorario, setSelectedHorario] = React.useState(""); // Horário selecionado

    // Função para buscar profissionais e horários do Firebase
    async function getProfissionalHorarios() {
        try {
            const snapshot = await getDocs(collection(db, "profissionais"));
            snapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    nome: doc.data().nome,
                    horarios: doc.data().horarios || [], // Garantir que existam horários
                });
            });
            setProfissionais(lista); // Atualizar o estado com a lista de profissionais
        } catch (error) {
            console.error("Erro ao buscar profissionais:", error);
        }
    }

    // Obter os horários do profissional selecionado
    const profissionalSelecionado = profissionais.find(p => p.id === selectedProfissional);
    const horariosDisponiveis = profissionalSelecionado ? profissionalSelecionado.horarios : [];

    // Atualizar o objeto horarioAndProfissional sempre que um horário ou profissional for selecionado
    React.useEffect(() => {
        if (selectedProfissional && selectedHorario) {
            const nomeProfissional = profissionalSelecionado ? profissionalSelecionado.nome : "";

            // Atualizar o objeto com id, nome e horário
            horarioAndProfissional = {
                id: selectedProfissional,
                nome: nomeProfissional,
                horario: selectedHorario,
            };

            console.log("horarioAndProfissional atualizado:", horarioAndProfissional);
        }
    }, [selectedProfissional, selectedHorario]);

    React.useEffect(() => {
        getProfissionalHorarios(); // Buscar os profissionais ao montar o componente
    }, []);

    return (
        <React.Fragment>
            {/* Picker para selecionar o profissional */}
            <Picker
                style={styles.picker}
                selectedValue={selectedProfissional}
                onValueChange={(itemValue) => setSelectedProfissional(itemValue)}
            >
                <Picker.Item label="Selecione um profissional" value="" />
                {profissionais.map((profissional) => (
                    <Picker.Item key={profissional.id} label={profissional.nome} value={profissional.id} />
                ))}
            </Picker>

            {/* Picker para selecionar o horário */}
            <Picker
                style={[styles.picker, { marginTop: 15 }]}
                selectedValue={selectedHorario}
                onValueChange={(itemValue) => setSelectedHorario(itemValue)}
            >
                <Picker.Item label="Selecione um horário" value="" />
                {horariosDisponiveis.map((horario, index) => (
                    <Picker.Item key={index} label={horario} value={horario} />
                ))}
            </Picker>
        </React.Fragment>
    );
}

const styles = StyleSheet.create({
    picker: {
        width: "90%",
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 4,
    },
});
