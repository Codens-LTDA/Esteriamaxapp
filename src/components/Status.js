import React, { useEffect, useState, useMemo } from 'react';
import { RouteContext } from '../context';
import Colors from '../utils/Colors';
import api from '../services/api';
import { width, height, totalSize } from 'react-native-dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

const Status = ({ navigation, client, departament }) => {
    console.log(client, departament)
    const [emergence, setEmergence] = useState([]);
    const [loading, setLoading] = useState(true);
    const [delivery, setDelivery] = useState([]);
    const [collect, setCollect] = useState([]);

    useEffect(() => {
        async function loadEmergence() {
            try {
                const userreference = await AsyncStorage.getItem('userreference');
                const response = await api.get('/countemergence', {
                    client: client,
                    promotor_id: userreference,
                });
                setLoading(false);
                setEmergence(response.data.emergence)
            } catch (err) {
                console.log(err.data)
            }
        };
        loadEmergence();

        async function loadDelivery() {
            try {
                const userreference = await AsyncStorage.getItem('userreference');
                const response = await api.get('/countdelivery', {
                    departament: departament,
                    client: client,
                    promotor_id: userreference,
                });
                if (response.data.delivery.length === 0) {
                    const userreference = await AsyncStorage.getItem('userreference');
                    const response = await api.get('/countdelivered', {
                        departament: departament,
                        client: client,
                        promotor_id: userreference,
                    });
                    setDelivery(response.data.delivery)
                } else {
                    setDelivery(response.data.delivery)
                }
            } catch (err) {
                console.log(err)
            }
        };
        loadDelivery();

        async function loadCollect() {
            try {
                const userreference = await AsyncStorage.getItem('userreference');
                const response = await api.get('/countboxcollect', {
                    departament: departament,
                    client: client,
                    promotor_id: userreference,
                });
                setCollect(response.data.boxescollect)
            } catch (err) {
                console.log(err.data)
            }
        };
        loadCollect();
    }, []);

    useEffect(() => {
        return () => {
            setEmergence([])
        };
    }, []);

    const routeContext = React.useMemo(() => {
    });

    return (
        <View style={styles.todo}>
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
                emergence.length > 0 ?
                    (
                        <>
                            {
                                emergence[0].emergence > 0 ?
                                    (
                                        <>
                                            <Text style={styles.urgent}>Emergência</Text>
                                        </>
                                    )
                                    :
                                    null
                            }
                        </>
                    )
                    :
                    null
            }
            {
                delivery > 0 ?
                    (
                        <>
                            {
                                delivery > 0 ?
                                    (
                                        <>
                                            <Text style={styles.delivery}>Entrega</Text>
                                        </>
                                    )
                                    :
                                    null
                            }
                        </>
                    )
                    :
                    null
            }
            {
                collect > 0 ?
                    (
                        <>
                            <Text style={styles.collect}>Coleta</Text>
                        </>
                    )
                    :
                    null
            }
        </View>
    );
};

const styles = StyleSheet.create({
    boxes: {
        display: 'flex',
        flexDirection: 'row',
    },
    todo: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: 2,
    },
    delivery: {
        backgroundColor: '#29BE56',
        margin: 1,
        fontSize: 9,
        borderRadius: 100,
        paddingHorizontal: 5,
        color: Colors.white,
        paddingVertical: 1,
    },
    collect: {
        backgroundColor: '#FF9226',
        margin: 1,
        fontSize: 9,
        borderRadius: 100,
        paddingHorizontal: 5,
        color: Colors.white,
        paddingVertical: 1,
    },
    urgent: {
        backgroundColor: '#FF0000',
        margin: 1,
        fontSize: 9,
        borderRadius: 100,
        paddingHorizontal: 5,
        paddingVertical: 1,
        color: Colors.white,
    },
})

export default Status;