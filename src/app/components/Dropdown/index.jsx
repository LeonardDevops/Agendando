import *  as React from "react";
import { getDocs, collection } from "firebase/firestore";
import { Picker } from "@react-native-picker/picker";
import { db } from "../../firebaseConfig";


export default function Lpicker({ value, label }) {

    let listProf = [];
    let getProf;

    const [profissional, setProfissional] = React.useState([])


    React.useEffect(() => {


        async function getProfissional(params) {

            getProf = await getDocs(collection(db, 'profissionais'))
                .then((snapshot) => {
                    snapshot.forEach((doc) => {
                        listProf.push({
                            id: doc.id,
                            nome: doc.data().nome
                        })
                    })
                    setProfissional(listProf);
                    // console.log(profissional);
                }).catch(() => {

                })

        } getProfissional();

        console.log(profissional)

    }, [])


    const [selectedLanguage, setSelectedLanguage] = React.useState("");

    const pickerRef = React.useRef();

    function open() {
        pickerRef.current.focus();
    }

    function close() {
        pickerRef.current.blur();

    }
    return (
        <Picker style={{
            width: '90%',
            backgroundColor: "#fff",
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 4

        }}
            ref={pickerRef}
            selectedValue={selectedLanguage}
            onValueChange={(itemValue, itemIndex) =>
                setSelectedLanguage(itemValue)
            }

        >
            <Picker.Item label="Selecione um profissional" value="" />
            {profissional.map((item) => (

                < Picker.Item key={item.id} label={item.nome} value={item.nome} />
            ))}




        </Picker>
    )

}




