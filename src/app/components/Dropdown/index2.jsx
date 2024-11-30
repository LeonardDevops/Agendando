import *  as React from "react";
import { StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";


export default function Lpicker() {
    const [selectedLanguage, setSelectedLanguage] = React.useState("");
    const [enabled, setEnabled] = React.useState(false);

    const pickerRef = React.useRef();

    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();
    }
    return (
        < Picker enabled={false} style={styles.containerInput}
            ref={pickerRef}
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedLanguage(itemValue)
            }>
            <Picker.Item label={"Masculino"} value={"Masculino"} />
            <Picker.Item label={"Feminino"} value={"Feminino"} />

        </Picker>
    )

}



const styles = StyleSheet.create({
    containerInput: {
        justifyContent: 'center',
        paddingHorizontal: 8,
        width: '80%',
        height: 40,
        borderRadius: 6,
        backgroundColor: '#fff',
        marginTop: 30

    }
})
