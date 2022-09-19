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

const Collectedreport = ({ client, departament, date }) => {
    console.log(client, departament, date)
    const [openbox, setOpenbox] = useState(false);
    const [collecteds, setCollected] = useState([]);
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
                const response = await api.get('/reportcollected', {
                    promotor_id: userreference,
                    client: client,
                    departament: departament,
                    date: datem
                });

                setCollected(response.data.boxescollect);
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
                <Text style={styles.textclients}>Caixa(s) coletada(s) neste cliente: </Text>
                {
                    loading === false && collecteds.map((collected, index) => (
                        <View style={styles.delivered}>
                            <View style={styles.numberbox}>
                                <Text>{collected.caixa}</Text>
                            </View>
                            <View>
                                <Text>{collected.cnt_name}</Text>
                            </View>
                        </View>
                    ))
                }
                {
                    loading === false && collecteds.length === 0 ?
                        (
                            <View style={styles.none}>
                                <Text style={styles.nonetext}>
                                    Nenhuma caixa coletada foi encontrada.
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
    delivered: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fcdfc4',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 4,
        borderRadius: 4,
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
    }
})

export default Collectedreport;