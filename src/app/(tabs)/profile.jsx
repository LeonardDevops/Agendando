import * as React from "react";
import Input from "../components/Inputs/index";
import { Text, View, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { getDoc, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil() {
    const [user, setUser] = React.useState({
        nome: "",
        sobrenome: "",
        cpf: "",
        celular: "",
        sexo: "",
    });

    const [isEditing, setIsEditing] = React.useState(false); // Controla o estado de edição

    // Função para buscar dados do usuário no Firebase
    const fetchUserData = async (userId) => {
        try {
            const userRef = doc(db, "usuarios", userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                setUser(userSnap.data()); // Atualiza o estado com os dados do Firebase
            } else {
                console.log("Usuário não encontrado!");
            }
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        }
    };

    // Carregar os dados do usuário ao iniciar
    React.useEffect(() => {
        const loadUserData = async () => {
            try {
                const storedUserId = await AsyncStorage.getItem('my-key'); // Obtém o ID do usuário armazenado
                const parsedUserId = storedUserId ? JSON.parse(storedUserId) : null; // Faz o parse do JSON

                console.log(parsedUserId, 'testando variável');

                if (parsedUserId && parsedUserId.id) {
                    fetchUserData(parsedUserId.id); // Buscar os dados do usuário usando o ID
                } else {
                    console.log("ID do usuário não encontrado!");
                }
            } catch (error) {
                console.error("Erro ao carregar o ID do usuário", error);
            }
        };
        loadUserData(); // Chama a função para carregar os dados
    }, []); // O useEffect roda uma única vez ao montar o componente

    // Função para editar o perfil
    const editProfile = () => {
        setIsEditing(true); // Ativa o modo de edição
    };

    // Função para salvar o perfil no Firebase
    const saveProfile = async () => {
        if (isEditing) {
            setIsEditing(false); // Desativa o modo de edição

            const storedUserId = await AsyncStorage.getItem('my-key');
            const parsedUserId = storedUserId ? JSON.parse(storedUserId) : null;

            if (parsedUserId && parsedUserId.id) {
                const userRef = doc(db, "usuarios", parsedUserId.id); // Referência do documento do usuário

                const updatedData = {};
                if (user.nome) updatedData.nome = user.nome;
                if (user.sobrenome) updatedData.sobrenome = user.sobrenome;
                if (user.cpf) updatedData.cpf = user.cpf;
                if (user.celular) updatedData.celular = user.celular;
                if (user.sexo) updatedData.sexo = user.sexo;

                try {
                    if (Object.keys(updatedData).length > 0) {
                        await updateDoc(userRef, updatedData); // Atualiza apenas os campos modificados
                        console.log("Dados atualizados com sucesso.");
                    } else {
                        console.log("Nenhum dado foi alterado.");
                    }
                } catch (error) {
                    console.error("Erro ao salvar os dados:", error);
                }
            }
        }
    };

    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: "#F5F5F5" }}>

            <View style={styles.container}>
                <Text style={styles.textProfile}>{user.nome}</Text>
                <StatusBar barStyle={"light-content"} />

                <Text style={styles.label}>Nome:</Text>
                <Input
                    editable={isEditing}
                    value={user.nome}
                    onChangeText={(text) => setUser({ ...user, nome: text })}
                />

                <Text style={styles.label}>Sobrenome:</Text>
                <Input
                    editable={isEditing}
                    value={user.sobrenome}
                    onChangeText={(text) => setUser({ ...user, sobrenome: text })}
                />

                <Text style={styles.label}>Cpf:</Text>
                <Input
                    editable={isEditing}
                    value={user.cpf}
                    onChangeText={(text) => setUser({ ...user, cpf: text })}
                />

                <Text style={styles.label}>Celular:</Text>
                <Input
                    editable={isEditing}
                    value={user.celular}
                    onChangeText={(text) => setUser({ ...user, celular: text })}
                />

                <View style={styles.containerButtons}>
                    <TouchableOpacity onPress={editProfile} style={styles.button}>
                        <FontAwesome name="edit" size={40} color="black" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={saveProfile} style={styles.button}>
                        <FontAwesome name="check-square-o" size={40} color="black" />
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: 'center',
        backgroundColor: "#F5F5F5",
        marginTop: '40%',
    },
    textProfile: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
        marginTop: -40

    },
    label: {
        fontSize: 18,
        marginTop: 10,
        textAlign: 'left',
        width: '80%',
    },
    containerButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '80%',
        marginTop: 20,
    },
    button: {
        width: 60,
        height: 60,
        backgroundColor: "#fff",
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
    },
});
