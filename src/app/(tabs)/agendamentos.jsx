import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TextInput, StyleSheet } from "react-native";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserAgendamentos() {
    const [agendamentos, setAgendamentos] = useState([]);
    const [filteredAgendamentos, setFilteredAgendamentos] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [loading, setLoading] = useState(true);
    const [trust, setTrust] = useState();

    let unsubscribeList = []; // Armazena os listeners para limpeza posterior
    useEffect(() => {

        const fetchAgendamentos = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem("my-key");
                const user = jsonValue ? JSON.parse(jsonValue) : null;

                if (!user) {
                    console.error("Usuário não encontrado.");
                    setLoading(false);
                    return;
                }

                const profissionaisRef = collection(db, "profissionais");

                // Configurar snapshot para os profissionais
                const profissionaisUnsub = onSnapshot(profissionaisRef, (snapshot) => {
                    let allAgendamentos = [];

                    // Configurar snapshot para os agendamentos de cada profissional
                    snapshot.docs.forEach((profissionalDoc) => {
                        const agendamentosRef = collection(
                            db,
                            "profissionais",
                            profissionalDoc.id,
                            "agendamentos"
                        );

                        const q = query(agendamentosRef, where("id", "==", user.id));
                        const agendamentosUnsub = onSnapshot(q, (agendamentosSnapshot) => {
                            const updatedAgendamentos = agendamentosSnapshot.docs.map((doc) => ({
                                id: doc.id,
                                ...doc.data(),
                            }));

                            allAgendamentos = [...allAgendamentos, ...updatedAgendamentos];
                            allAgendamentos.sort((a, b) => new Date(a.data) - new Date(b.data));

                            setAgendamentos([...allAgendamentos]);
                            setFilteredAgendamentos([...allAgendamentos]);
                            setLoading(false);
                        });

                        unsubscribeList.push(agendamentosUnsub);
                    });
                });

                unsubscribeList.push(profissionaisUnsub);
            } catch (error) {
                console.error("Erro ao buscar agendamentos:", error);
                setLoading(false);
            }
        };

        fetchAgendamentos();

        // Limpar todos os listeners ao desmontar o componente
        return () => {
            unsubscribeList.forEach((unsubscribe) => unsubscribe());
        };
    }, []);

    useEffect(() => {
        const filtered = agendamentos.filter((item) =>
            item.nome.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredAgendamentos(filtered);
    }, [searchText,]);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Carregando agendamentos...</Text>
            </View>
        );
    }

    if (filteredAgendamentos.length === 0) {
        return (
            <View style={styles.container}>
                <Text>Você não possui agendamentos.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Pesquisar por profissional"
                value={searchText}
                onChangeText={setSearchText}
            />
            <FlatList
                data={filteredAgendamentos}
                keyExtractor={(item, index) => `${item.id}-${index}`}
                renderItem={({ item }) => (
                    <View style={styles.agendamento}>
                        <Text style={styles.text}>Profissional: {item.nome}</Text>
                        <Text style={styles.text}>Data: {item.data}</Text>
                        <Text style={styles.text}>Hora: {item.hora}</Text>
                        <Text style={styles.text}>Cliente: {item.nomeSolicitante}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f5f5",
    },
    searchBar: {
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
    },
    agendamento: {
        backgroundColor: "#ffffff",
        padding: 16,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    text: {
        fontSize: 16,
        color: "#333",
    },
});
