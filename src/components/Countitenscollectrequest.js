import React, { useEffect, useState, useMemo } from 'react';
import { RouteContext } from '../context';
import Colors from '../utils/Colors';
import api from '../services/api';
import { width, height, totalSize } from 'react-native-dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBox } from '@fortawesome/free-solid-svg-icons'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const Countitenscollectrequest = ({ navigation, client, departament }) => {
    const [countitens, setCountitens] = useState(0);

    useEffect(() => {
        async function loadCountitens() {
            try {
                const userreference = await AsyncStorage.getItem('userreference');
                const response = await api.get('/countcollect', {
                    departament: departament,
                    client: client,
                    promotor_id: userreference
                });
                console.log(response.data)
                setCountitens(response.data.collect);
            } catch (err) {
                console.log(err)
            }
        };
        loadCountitens();
    }, []);


    useEffect(() => {
        return () => {
            setCountitens([])
        };
    }, []);

    const routeContext = React.useMemo(() => {
    });

    return (
        <View style={styles.boxtotal}>
            <Text style={styles.total}>Total de itens</Text>
            <Text style={styles.count}>{countitens}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    boxtotal: {
        textAlign: 'center',
    },
    total: {
        fontSize: 7,
    },
    count: {
        textAlign: 'center',
        fontSize: 10,
    }
})

export default Countitenscollectrequest;