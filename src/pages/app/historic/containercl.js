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
import Deliveredreport from './deliveredreport';
import Collectedreport from './collectedreport';
import Boxemptyreport from './boxemptyreport';

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

const Containercl = ({ client, index, date }) => {
    console.log(client)
    const [openbox, setOpenbox] = useState(false);
    const [delivereds, setDelivered] = useState([]);
    const [loading, setLoading] = useState(false);


    const routeContext = React.useMemo(() => {
    });

    const navigation = useNavigation();

    React.useEffect(() => {

    }, []);

    const clickOut = () => {
        setOpenbox(!openbox)
    }

    return (
        <View style={styles.cccl}>
            <TouchableOpacity style={openbox === false ? styles.boxroute : styles.boxrouteopen} key={index} onPress={clickOut}>
                <View>
                    <View style={styles.client}>
                        <View style={styles.sideleft}>
                            <Text>{client.cli_nome}</Text>
                            <Text>Departamento: {client.dpto_nome}</Text>
                        </View>
                        <View style={styles.sideright}>
                            {console.log(client)}
                            {
                                client.hr_checkall === '1' ?
                                    (
                                        <View style={styles.boxstatusconclude}>
                                            <Text style={styles.textconclude}>Finalizado</Text>
                                        </View>
                                    )
                                    :
                                    (
                                        <View style={styles.boxstatusnotconclude}>
                                            <Text style={styles.textconclude}>Não finalizado</Text>
                                        </View>
                                    )
                            }
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
            {
                openbox === true ?
                    (
                        <>
                            <Deliveredreport client={client.cli_id} departament={client.dpto_id} date={date} />
                            <Collectedreport client={client.cli_id} departament={client.dpto_id} date={date} />
                            <Boxemptyreport client={client.cli_id} departament={client.dpto_id} date={date} />
                        </>
                    ) :
                    null
            }
        </View>
    );
};

const styles = StyleSheet.create({
    cccl: {
        margin: 0,
        padding: 5,
    },
    client: {
        backgroundColor: Colors.graygray,
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginVertical: 4,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
    },

    textclients: {
        color: Colors.blue,
        fontWeight: 'bold',
    },
    sideleft: {
        width: width(60),
    },
    sideright: {
        width: width(28),
    },
    textconclude: {
        textAlign: 'center',
        color: Colors.white,
    },
    boxstatusconclude: {
        backgroundColor: '#099cf2',
        paddingVertical: 1,
        paddingHorizontal: 0,
        borderRadius: 3,
    },
    boxstatusnotconclude: {
        backgroundColor: '#f71313',
        paddingVertical: 1,
        paddingHorizontal: 6,
        borderRadius: 3,
    }
})

export default Containercl;