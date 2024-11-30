import React from "react";
import { View, Text, StyleSheet } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';


export default function NomeApp(params) {
    return (
        <View style={styles.containerNomeapp}>
            <Text style={styles.text2}>AGENDAND</Text>


            <AntDesign
                style={{
                    backgroundColor: 'rgba(39, 164, 254, 0.5)',
                    height: 36,
                    width: 36,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 50,
                    marginBottom: 10
                }}
                name="checkcircle"
                size={30}
                color="#fff"
            />

        </View>
    )
}



const styles = StyleSheet.create({
    containerNomeapp: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '80%',
        height: 60,
        marginBottom: 20,

    },
    text2: {


        fontSize: 30,
        fontWeight: '300',
        color: 'black',
        paddingVertical: 6,
        lineHeight: 26,
    },




})
