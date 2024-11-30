import React from "react";
import { View, StyleSheet, TextInput } from "react-native";

export default function Input({
    value,
    onChangeText,
    placeholder,
    keyboardType = "default",
    editable,
    style,
    secureTextEntry = false, // Para habilitar o modo de senha
}) {
    return (
        <View style={[styles.containerInput, style]}>
            <TextInput
                style={styles.textInput}
                editable={editable}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry} // Oculta o texto para entradas de senha
            />
        </View>
    );
}

const styles = StyleSheet.create({
    containerInput: {
        justifyContent: "center",
        paddingHorizontal: 8,
        width: "80%",
        height: 40,
        borderRadius: 6,
        backgroundColor: "#fff",
        marginTop: 30,
    },
    textInput: {
        height: "100%",
        width: "100%",
        fontSize: 16,
        color: "#000",
    },
});
