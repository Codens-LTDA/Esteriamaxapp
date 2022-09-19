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
} from 'react-native';

const Statuslarge = ({ navigation, client, departament, wich }) => {
    const [emergence, setEmergence] = useState([]);
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

                console.log(response.data.delivery)
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
                console.log(err.data)
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
                wich === 'delivery' ?
                    (
                        <>
                            <View style={styles.containerdelivery}>
                                <Text style={styles.delivery}>Entregas</Text>
                                <Text style={styles.textboxes}>Caixas para entrega: {delivery}</Text>
                            </View>
                        </>
                    )
                    :
                    null
            }
            {
                wich === 'collect' ?
                    (
                        <View style={styles.containerdelivery}>
                            <Text style={styles.collect}>Coletas</Text>
                            <>
                                <Text style={styles.textboxes}>Caixas para coleta: {collect === undefined ? 0 : collect}</Text>
                            </>
                        </View>
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
        fontSize: 12,
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingVertical: 2,
        color: Colors.white,
    },
    collect: {
        backgroundColor: '#FF9226',
        margin: 1,
        fontSize: 12,
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingVertical: 2,
        color: Colors.white,

    },
    urgent: {
        backgroundColor: '#FF0000',
        margin: 1,
        fontSize: 12,
        borderRadius: 100,
        paddingHorizontal: 10,
        paddingVertical: 2,
        color: Colors.white,
    },
    containerdelivery: {
        display: 'flex',
        flexDirection: 'row',
    },
    textboxes: {
        color: Colors.blue,
        marginLeft: 5,
        fontSize: 12,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default Statuslarge;