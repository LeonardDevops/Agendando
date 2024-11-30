import React from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert } from "react-native";
import Button from "./components/Button/index";
import Input from "./components/Inputs/index";
import NomeApp from "./components/NomeApp/index";
import { router, Link } from "expo-router";
import { getDocs, collection, query, where } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { db } from "./firebaseConfig";

let NameUser;

export { NameUser };

export default function Login() {
  let listaUsuarios = [];
  let listaProfissionais = [];
  const [usuarios, setUsuarios] = React.useState([]);
  const [profissionais, setProfissionais] = React.useState([]);
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");

  async function login() {
    const user = usuarios.find((data) => email === data.email && senha === data.senha);

    if (user) {

      const storageId = user.id;
      const storageNome = user.nome;
      console.log(`${storageNome} usuário logado como cliente`);
      await storeData({ id: storageId, nome: storageNome });
      router.push("/(tabs)/profile"); // Página para clientes
      NameUser = { nUser: storageNome, dtIdUser: storageId };
      return;
    }

    const profissional = profissionais.find(
      (data) => email === data.email && senha === data.senha
    );
    if (profissional) {
      const storageId = profissional.id;
      const storageNome = profissional.nome;
      console.log(`${storageNome} usuário logado como profissional`);
      await storeData({ id: storageId, nome: storageNome });
      router.push("/Profissional"); // Página para profissionais
      NameUser = { nUser: storageNome, dtIdUser: storageId };
      return;
    }

    Alert.alert("Erro", "Email ou senha incorretos!");
  }

  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem("my-key", jsonValue);
      console.log(`${value}`);
    } catch (e) {
      console.log("Erro ao salvar os dados");
    }
  };

  React.useEffect(() => {
    async function buscaUsuarios() {
      try {
        const snapshotUsuarios = await getDocs(collection(db, "usuarios"));
        snapshotUsuarios.forEach((doc) => {
          listaUsuarios.push({
            id: doc.id,
            email: doc.data().email,
            senha: doc.data().senha,
            nome: doc.data().nome,
            sobrenome: doc.data().sobrenome
          });
        });
        setUsuarios(listaUsuarios);

        const snapshotProfissionais = await getDocs(collection(db, "profissionais"));
        snapshotProfissionais.forEach((doc) => {
          listaProfissionais.push({
            id: doc.id,
            email: doc.data().email,
            senha: doc.data().senha,
            nome: doc.data().nome,

          });
        });
        setProfissionais(listaProfissionais);
      } catch (erro) {
        console.log("Erro ao buscar usuários ou profissionais: " + erro);
      }
    }
    buscaUsuarios();
  }, [usuarios]);

  return (
    <View style={styles.cointaineFull}>
      <NomeApp />
      <Image style={styles.image} source={require("./assets/Images/logo.png")} />

      <Text style={styles.textLabel}>Email:</Text>
      <Input
        value={email}
        onChangeText={(e) => setEmail(e)}
        placeholder="Digite seu email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha:</Text>
      <Input
        value={senha}
        onChangeText={(e) => setSenha(e)}
        placeholder="Digite sua senha"
        secureTextEntry={true} // Habilita modo senha
      />

      <View style={styles.containerButton}>
        <Button onPress={login} />
      </View>

      <View style={styles.containerRegister}>
        <TouchableOpacity>
          <Text style={styles.textRegister}>Não possui conta? |</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Link style={styles.textRegister} href={"/cadastro"}>
            <Text style={styles.textRegister}>Registrar</Text>
          </Link>
        </TouchableOpacity>
      </View>
      <View style={styles}>

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
  },
  image: {
    marginBottom: "12%",
  },
  containerRegister: {
    justifyContent: "flex-start",
    marginLeft: 20,
    gap: 10,
    flexDirection: "row",
    width: "80%",
    marginTop: 5,
  },
  textRegister: {
    fontSize: 15,
    marginTop: 5,
    color: "#0127E4",
  },
  footerNavigation: {
    width: '100%',
    height: 40,
    backgroundColor: "#F5F5F5"
  }
});
