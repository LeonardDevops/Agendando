import React, { useState, useEffect } from "react";
import { View, Text, Modal, StyleSheet, TextInput, TouchableOpacity, Alert } from "react-native";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { router } from "expo-router";
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { db } from "./firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profissionais() {
    const [modalVisible, setModalVisible] = useState(false);
    const [horario, setHorario] = useState("");
    const [profissionalId, setProfissionalId] = useState(null);
    const [selected, setSelected] = useState(2);
    const [logoutModalVisible, setLogoutModalVisible] = useState(false); // Estado para controle do modal de logout

    useEffect(() => {
        async function fetchProfissionalId() {
            const jsonValue = await AsyncStorage.getItem("my-key");
            const user = jsonValue ? JSON.parse(jsonValue) : null;
            if (user) setProfissionalId(user.id);
        }
        fetchProfissionalId();
    }, []);

    async function handleAddHorario() {
        if (!horario) {
            Alert.alert("Erro", "Por favor, insira um horário válido.");
            return;
        }

        try {
            if (!profissionalId) {
                Alert.alert("Erro", "Profissional não identificado.");
                return;
            }

            const profissionalRef = doc(db, "profissionais", profissionalId);

            await updateDoc(profissionalRef, {
                horarios: arrayUnion(horario),
            });

            Alert.alert("Sucesso", "Horário adicionado com sucesso!");
            setHorario("");
            setModalVisible(false);
        } catch (error) {
            console.error("Erro ao adicionar horário: ", error);
            Alert.alert("Erro", "Não foi possível adicionar o horário. Tente novamente.");
        }
    }

    const handleSelect = (index) => {
        setSelected(index === selected ? null : index);
    };

    const selectedRoute = () => {
        router.push("/horario");
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem("my-key");
            router.push("/");
        } catch (error) {
            console.error("Erro ao deslogar: ", error);
            Alert.alert("Erro", "Não foi possível deslogar.");
        }
    };

    const showLogoutModal = () => {
        setLogoutModalVisible(true);
    };

    const hideLogoutModal = () => {
        setLogoutModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Crie seus horários</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Digite o horário (ex: 08:00)"
                            value={horario}
                            onChangeText={setHorario}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButtonModal]}
                                onPress={handleAddHorario}
                            >
                                <Text style={styles.buttonText}>Adicionar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal de confirmação de logout */}
            <Modal
                visible={logoutModalVisible}
                transparent={true}
                animationType="fade"
                onRequestClose={hideLogoutModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Deseja realmente sair?</Text>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={hideLogoutModal}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.addButtonModal]}
                                onPress={handleLogout}
                            >
                                <Text style={styles.buttonText}>Sair</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <View style={styles.containerFooter}>
                <TouchableOpacity onPress={() => {
                    setModalVisible(true);
                    handleSelect(1);
                }}>
                    <View style={styles.iconContainer}>
                        <MaterialIcons
                            style={[styles.icon, selected === 1 && styles.selectedIcon]}
                            name="add-alarm"
                            size={28}
                            color={selected === 1 ? '#fff' : '#000'}
                        />
                        <Text style={styles.textFooter}>Horario</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        marginRight: 15,
                        padding: 2,
                        backgroundColor: '#F5F5F5',
                        borderRadius: 100,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.2,
                        shadowRadius: 4,
                        elevation: 1,
                    }}
                    onPress={showLogoutModal}>
                    <View style={styles.iconContainer}>
                        <AntDesign
                            style={[styles.icon, selected === 0 && styles.selectedIcon]}
                            name="logout"
                            size={25}
                            color={selected === 0 ? '#fff' : '#000'}
                        />
                    </View>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                    handleSelect(2);
                    selectedRoute();
                }}>
                    <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                            style={[styles.icon, selected === 2 && styles.selectedIcon]}
                            name="view-agenda"
                            size={28}
                            color={selected === 2 ? '#fff' : '#000'}
                        />
                        <Text style={styles.textFooter}>Agenda</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: "90%",
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        padding: 10,
        borderRadius: 5,
        width: "48%",
        alignItems: "center",
    },
    cancelButton: {
        backgroundColor: "#ccc",
    },
    addButtonModal: {
        backgroundColor: "#27A4FE",
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
    textFooter: {
        fontSize: 14,
        color: '#000',
    },
    containerFooter: {
        backgroundColor: "#fff",
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: '-185%'
    },
    iconContainer: {
        alignItems: 'center',
    },
    icon: {
        color: '#000',
        borderRadius: 100,
        padding: 4,
        marginBottom: 0,
    },
    selectedIcon: {
        backgroundColor: '#27A4FE',
    },
});
