import React, { useEffect, useState, useMemo } from 'react';
import { RouteContext } from '../context';
import Colors from '../../../utils/Colors';
import { width, height, totalSize } from 'react-native-dimension';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes, faTruck, faMapMarkerAlt, faBox, faCheck, faBriefcase } from '@fortawesome/free-solid-svg-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { showMessage, hideMessage } from "react-native-flash-message";
import moment, { updateLocale } from "moment";
import ptbr from 'moment/src/locale/pt-br';
import 'moment/locale/pt-br'  // without this line it didn't work
import api from '../../../services/api';

import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';

const Boxemptyreport = ({ client, departament, date }) => {
    const [openbox, setOpenbox] = useState(false);
    const [empties, setEmpties] = useState([]);
    const [loading, setLoading] = useState(false);
    const [datem, setDatem] = useState(moment(date).format('YYYY-MM-DD'));


    const routeContext = React.useMemo(() => {
    });

    const navigation = useNavigation();

    React.useEffect(() => {
        async function date() {
            try {
                const userreference = await AsyncStorage.getItem('userreference');
                setLoading(true)
                const response = await api.get('/reportboxinclient', {
                    promotor_id: userreference,
                    client: client,
                    departament: departament,
                    date: datem
                });

                setEmpties(response.data.boxclientvazia);
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        date();

    }, []);

    return (
        <View>
            <View style={styles.interntclient}>
                <Text style={styles.textclients}>Caixas vazia(s) entregue(s) neste cliente: </Text>
                <View style={styles.empties}>
                    {
                        loading === false && empties.map((empty, index) => (
                            <Text style={styles.nameemp}>{empty.cnt_nome}, </Text>
                        ))
                    }
                </View>                
                {
                    loading === false && empties.length === 0 ?
                    (
                        <View style={styles.none}>
                            <Text style={styles.nonetext}>
                                Nenhuma caixa vazia entregue para este cliente.
                            </Text>
                        </View>
                    )
                    :
                    null
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    interntclient: {
        borderColor: Colors.graygray,
        borderWidth: 1,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginTop: -5,
    },
    empties: {
        display: 'flex',
        flexDirection: 'row',
    },
    textclients: {
        color: Colors.blue,
        fontWeight: 'bold',
    },
    numberbox: {
        marginRight: 10,
    },
    textclients: {
        color: Colors.blue,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    nonetext: {
        textAlign: 'center',
    },
    nameemp: {
        backgroundColor: Colors.graygray,
        borderRadius:5,
        margin: 5,
        padding: 5,
        color: Colors.blue,
    }
})

export default Boxemptyreport;