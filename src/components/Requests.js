import React, { useEffect, useState, useMemo } from 'react';
import { RouteContext } from '../context';
import Colors from '../utils/Colors';
import api from '../services/api';
import { width, height, totalSize } from 'react-native-dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faFileAlt } from '@fortawesome/free-solid-svg-icons'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

const Requests = ({ navigation, client, departament, idbox }) => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRequests() {
            try {
                const response = await api.get('/requestsinbox', {
                    departament: departament,
                    client: client,
                    caixa: idbox,
                });
                setLoading(false);
                setRequests(response.data.requests);
            } catch (err) {
                console.log(err.data)
            }
        };
        loadRequests();
    }, []);

    useEffect(() => {
        return () => {
            setRequests([])
        };
    }, []);

    const routeContext = React.useMemo(() => {
    });

    return (
        <View style={styles.containeritens}>
            {
                loading === true ?
                    (
                        <View style={styles.activity}>
                            <ActivityIndicator size="small" color="#0000ff" />
                        </View>
                    )
                    :
                    null
            }
            {
                requests.map((requests, index) => (
                    <View style={styles.iten} key={index}>
                        <View style={styles.itenlist}>
                            <View style={styles.sideicon}>
                                <FontAwesomeIcon icon={faFileAlt} size={21} style={styles.icon} />
                            </View>
                            <View style={styles.sidenome}>
                                <Text style={styles.nome}>{requests.ses_numero}</Text>
                            </View>
                        </View>
                    </View>
                ))
            }
        </View>
    );
};

const styles = StyleSheet.create({
    containeritens: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: "wrap",
    },
    itenlist: {
        display: 'flex',
        flexDirection: 'row',
    },
    sidenome: {
        marginLeft: 3,
    },
    sideicon: {
        marginLeft: 0,
    },
    iten: {
        width: width(43),
    },
    nome: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    qtde: {
        fontSize: 9,
    },
    icon: {
        color: Colors.bluelight,
    },
    activity: {
        width: width(88),
    }
})

export default Requests;