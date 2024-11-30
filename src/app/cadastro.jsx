import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert, TouchableOpacity } from "react-native";
import Button from "./components/Button/index2.jsx";
import Inputs from "./components/Inputs/index.jsx";
import NomeApp from "./components/NomeApp/index.jsx";
import { db } from "./firebaseConfig.js";
import { addDoc, collection } from "firebase/firestore";
import { router } from "expo-router";

export default function Cadastro() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [sobrenome, setSobrenome] = useState("")
    const [cpf, setCpf] = useState("")
    const [tipoUsuario, setTipoUsuario] = useState("cliente"); // Estado para definir "cliente" ou "profissional"

    async function handleRegister() {
        if (!nome || !email || !senha) {
            Alert.alert("Erro", "Todos os campos são obrigatórios!");
            return;
        }

        try {
            const collectionName = tipoUsuario === "cliente" ? "usuarios" : "profissionais";

            await addDoc(collection(db, collectionName), {
                nome: nome.trim(),
                sobrenome: sobrenome.trim(),
                cpf: cpf.trim(),
                email: email.trim(),
                senha: senha,
            });

            Alert.alert("Sucesso", `${tipoUsuario === "cliente" ? "Cliente" : "Profissional"} cadastrado com sucesso!`);
            setNome("");
            setEmail("");
            setSenha("");
            setSobrenome("");
            setCpf("")
            setTipoUsuario("cliente");
            router.push("/");
        } catch (erro) {
            console.error("Erro ao cadastrar: ", erro);
            Alert.alert("Erro", "Algo deu errado ao realizar o cadastro. Tente novamente.");
        }
    }

    return (
        <View style={styles.cointaineFull}>
            <NomeApp />
            <Image source={require("./assets/Images/logo.png")} style={styles.image} />

            <Text style={styles.textLabel}>Nome:</Text>
            <Inputs
                onChangeText={(e) => setNome(e)}
                value={nome}
                placeholder="Digite seu nome"
            />

            <Text style={styles.textLabel}>Email:</Text>
            <Inputs
                onChangeText={(e) => setEmail(e)}
                value={email}
                placeholder="Digite seu email"
                keyboardType="email-address"
            />

            <Text style={styles.label}>Senha:</Text>
            <Inputs
                onChangeText={(e) => setSenha(e)}
                value={senha}
                placeholder="Digite sua senha"
                secureTextEntry={true}
            />

            {/* Seleção de Tipo de Usuário */}
            <View style={styles.radioContainer}>
                <TouchableOpacity
                    style={[
                        styles.radioButton,
                        tipoUsuario === "cliente" && styles.radioButtonSelected,
                    ]}
                    onPress={() => setTipoUsuario("cliente")}
                >
                    <Text style={styles.radioText}>Clientes </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.radioButton,
                        tipoUsuario === "profissional" && styles.radioButtonSelected,
                    ]}
                    onPress={() => setTipoUsuario("profissional")}
                >
                    <Text style={styles.radioText}>Profissional</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.containerButton}>
                <Button onPress={handleRegister} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    cointaineFull: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
    },
    textLabel: {
        marginBottom: -22,
        marginRight: "65%",
        fontSize: 20,
    },
    label: {
        marginBottom: -21,
        marginTop: 10,
        marginRight: "60%",
        fontSize: 20,
    },
    containerButton: {
        width: "80%",
        borderRadius: 6,
        marginBottom: 25
    },
    image: {
        marginBottom: "3%",
    },
    radioContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 20,
        marginBottom: 20,
        width: "60%",
    },
    radioButton: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        alignItems: "center",
        backgroundColor: "#fff",
    },
    radioButtonSelected: {
        backgroundColor: "#27A4FE",
        borderColor: "#27A4FE",
    },
    radioText: {
        color: "#333",
        fontSize: 16,
    },
});
