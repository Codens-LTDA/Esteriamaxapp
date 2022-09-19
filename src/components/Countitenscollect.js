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

const Countitenscollect = ({ navigation, client, departament }) => {
    const [countitens, setCountitens] = useState([]);

    useEffect(() => {
        async function loadCountitens() {
            try {
                const response = await api.get('/countcollectinbox', {
                    departament: departament,
                    client: client
                });
                setCountitens(response.data.boxescollect[0]);

            } catch (err) {
                console.log(err.data)
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
            <Text style={styles.count}>{countitens.collect}</Text>
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

export default Countitenscollect;