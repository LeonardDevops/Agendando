import React, { useState, useEffect } from "react";
import { View, Text, TextInput, FlatList, StyleSheet, Alert } from "react-native";
import { db } from "./firebaseConfig"; // Assumindo que você tenha o arquivo firebaseConfig.js configurado
import { collection, query, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Agendamentos({ navigation }) {
    const [agendamentos, setAgendamentos] = useState([]);
    const [profissionalId, setProfissionalId] = useState(null);
    const [filter, setFilter] = useState(""); // Filtro por nome ou data
    const [filteredAgendamentos, setFilteredAgendamentos] = useState([]); // Agendamentos filtrados

    useEffect(() => {
        async function fetchProfissionalId() {
            const jsonValue = await AsyncStorage.getItem("my-key");
            const user = jsonValue ? JSON.parse(jsonValue) : null;
            if (user) setProfissionalId(user.id);
        }
        fetchProfissionalId();
    }, []);

    useEffect(() => {
        if (!profissionalId) return;

        // Consulta os agendamentos do profissional logado
        const agendamentosRef = collection(db, "profissionais", profissionalId, "agendamentos");
        const q = query(agendamentosRef);

        // Escutando em tempo real as mudanças na coleção de agendamentos
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const agendamentosData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
            setAgendamentos(agendamentosData);
            setFilteredAgendamentos(agendamentosData); // Inicialmente, todos os agendamentos são mostrados
        });

        return () => unsubscribe(); // Limpar o listener quando o componente for desmontado
    }, [profissionalId]);

    useEffect(() => {
        // Aplicar filtro no array de agendamentos
        if (filter === "") {
            setFilteredAgendamentos(agendamentos);
        } else {
            const filtered = agendamentos.filter((agendamento) =>
                agendamento.nome.toLowerCase().includes(filter.toLowerCase()) ||
                agendamento.data.toLowerCase().includes(filter.toLowerCase()) ||
                agendamento.horario.toLowerCase().includes(filter.toLowerCase())
            );
            setFilteredAgendamentos(filtered);
        }
    }, [filter, agendamentos]);

    const renderAgendamentoItem = ({ item }) => (
        <View style={styles.agendamentoItem}>
            <Text style={styles.agendamentoText}>Nome: {item.nome}</Text>
            <Text style={styles.agendamentoText}>Data: {item.data}</Text>
            <Text style={styles.agendamentoText}>Horário: {item.hora}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Barra de pesquisa */}
            <TextInput
                style={styles.filterInput}
                placeholder="Filtrar por nome ou data"
                value={filter}
                onChangeText={setFilter}
            />

            {filteredAgendamentos.length === 0 ? (
                <Text style={styles.noAgendamentosText}>Nenhum agendamento encontrado.</Text>
            ) : (
                <FlatList
                    data={filteredAgendamentos}
                    keyExtractor={(item) => item.id}
                    renderItem={renderAgendamentoItem}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    filterInput: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    agendamentoItem: {
        backgroundColor: "#f9f9f9",
        padding: 15,
        marginBottom: 10,
        borderRadius: 5,
    },
    agendamentoText: {
        fontSize: 16,
        color: "#333",
    },
    noAgendamentosText: {
        fontSize: 16,
        color: "#888",
        fontWeight: 'bold',
        textAlign: "center",
    },
});
