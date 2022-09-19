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
import Containercl from './containercl';

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

const Clientreport = ({ idroute, index, date }) => {

    const [openbox, setOpenbox] = useState(false);
    const [clients, setClients] = useState([]);
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
                const response = await api.get('/reportroute', {
                    promotor_id: userreference,
                    idrota: idroute,
                    date: datem
                });
                setClients(response.data.clients);
                setLoading(false)
            } catch (err) {
                console.log(err)
            }
        }
        date();

    }, []);

    const clickOut = () => {
        setOpenbox(!openbox)
    }

    return (
        <View>
            <Text style={styles.textclients}>Clientes da rota</Text>
            {
                loading === false && clients.map((client, index) => (
                    <Containercl client={client[0]} index={index} date={datem} />
                ))
            }
        </View >
    );
};

const styles = StyleSheet.create({
    containerclient: {
        borderColor: Colors.grayboxroute,
        borderWidth: 1,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginTop: -9,
    },
    client: {
        backgroundColor: Colors.grayboxroute,
        paddingVertical: 15,
        paddingHorizontal: 5,
        marginVertical: 4,
        borderRadius: 4,
    },
    textclients: {
        color: Colors.blue,
        fontWeight: 'bold',
        marginBottom: 10,
    }
})

export default Clientreport;