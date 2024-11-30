import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";



export default function Button({ onPress }) {



    return (

        <TouchableOpacity

            style={styles.button} onPress={onPress} >


            <Text style={styles.text}>LOGIN</Text>

        </TouchableOpacity>

    )
}





const styles = StyleSheet.create({
    button: {
        width: '100%',
        height: 40,
        borderRadius: 6,
        backgroundColor: '#27A4FE',
        marginTop: 15,
        justifyContent: 'center',
        alignItems: 'center',

    },
    text: {
        color: '#fff'
    }

})