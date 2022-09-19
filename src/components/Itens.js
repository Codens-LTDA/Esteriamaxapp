import React, { useEffect, useState, useMemo } from 'react';
import { RouteContext } from '../context';
import Colors from '../utils/Colors';
import api from '../services/api';
import { width, height, totalSize } from 'react-native-dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTag } from '@fortawesome/free-solid-svg-icons'
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';

const Itens = ({ navigation, caixa, lacre }) => {
    const [itens, setItens] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadItens() {
            try {
                const response = await api.get('/itens', {
                    caixa: caixa,
                    lacre: lacre
                });
                setLoading(false);
                setItens(response.data.itens);
            } catch (err) {
                console.log(err.data)
            }
        };
        loadItens();
    }, []);

    useEffect(() => {
        return () => {
            setItens([])
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
                itens.map((iten, index) => (
                    <View style={styles.iten} key={index}>
                        <View style={styles.itenlist}>
                            <View style={styles.sideicon}>
                                <FontAwesomeIcon icon={faTag} size={21} style={styles.icon} />
                            </View>
                            <View style={styles.sidenome}>
                                <Text style={styles.nome}>{iten.pro_nome}</Text>
                                <Text style={styles.qtde}>Qtde: {iten.ise_qtd}</Text>
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
    },
    activity: {
        width: width(88),
    }
})

export default Itens;