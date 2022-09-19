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
} from 'react-native';

const Collect = ({ navigation, caixa, lacre }) => {
    const [collect, setCollect] = useState([]);

    useEffect(() => {
        async function loadItens() {
            try {
                const response = await api.get('/collect', {
                    caixa: caixa,
                    lacre: lacre
                });
                setCollect(response.data.collect);
            } catch(err){

            }
        };
        loadItens();
    }, []);

    useEffect(() => {
        return () => {
            setCollect([])
        };
    }, []);

    const routeContext = React.useMemo(() => {
    });

    return (
        <View style={styles.containeritens}>
            {
                collect.map((collect, index) => (
                    <View style={styles.iten} key={index}>
                        <View style={styles.itenlist}>
                            <View style={styles.sideicon}>
                                <FontAwesomeIcon icon={faFileAlt} size={21} style={styles.icon} />
                            </View>
                            <View style={styles.sidenome}>
                                <Text style={styles.nome}>{collect.ses_numero}</Text>
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
        fontSize: 9,
    },
    qtde: {
        fontSize: 9,
    },
    icon: {
        color: Colors.bluelight,
    }
})

export default Collect;