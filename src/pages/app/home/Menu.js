import React, { useEffect, useState, useMemo } from 'react';
import { HomeContext } from '../../../context';
import Header from '../../../components/Header';
import Colors from '../../../utils/Colors';
import { width, height, totalSize } from 'react-native-dimension';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTruck, faTag, faBoxOpen, faBox, faFileAlt, faQrcode } from '@fortawesome/free-solid-svg-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    Dimensions
} from 'react-native';

const Menu = ({ navigation }) => {
    const [tipo, setTipo] = useState('');

    const products = () => {
        navigation.navigate('Product', {});
    }

    const historic = () => {
        navigation.navigate('Historic', {});
    }

    const homeContext = React.useMemo(() => {
    });


    useEffect(() => {
        async function loadTipo() {
            try {
                const tipo = await AsyncStorage.getItem('type');
                setTipo(tipo)
            } catch (err) {
            }
        };
        loadTipo();
    }, []);

    useEffect(() => {
        return () => {
        };
    }, []);

    const route = () => {
        navigation.navigate('Home', {});
    }

    const scanboxproducao = () => {
        navigation.navigate('Scanboxproducao', {});
    }

    return (
        <ScrollView horizontal={true} style={styles.main} showsHorizontalScrollIndicator={false}>
            {
                tipo === 'producao' ?
                    (
                        <>
                            <TouchableOpacity style={styles.btnmenu} onPress={scanboxproducao}>
                                <FontAwesomeIcon icon={faQrcode} size={36} style={styles.iconstbn} />
                                <Text style={styles.namebtmmenu}>Receber caixas</Text>
                            </TouchableOpacity>
                        </>
                    )
                    :
                    (
                        <>
                            <TouchableOpacity style={styles.btnmenu} onPress={route}>
                                <FontAwesomeIcon icon={faTruck} size={36} style={styles.iconstbn} />
                                <Text style={styles.namebtmmenu}>Rotas de entregas</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnmenu} onPress={products}>
                                <FontAwesomeIcon icon={faTag} size={36} style={styles.iconstbn} />
                                <Text style={styles.namebtmmenu}>Tabela de produtos</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnmenu} onPress={historic}>
                                <FontAwesomeIcon icon={faFileAlt} size={36} style={styles.iconstbn} />
                                <Text style={styles.namebtmmenu}>Histórico de entregas</Text>
                            </TouchableOpacity>
                        </>
                    )

            }
        </ScrollView>
    );
};


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        width: width(100),
        marginTop: 10,
        position: 'absolute',
        bottom: 10,
        marginLeft: 9,
    },
    btnmenu: {
        backgroundColor: Colors.bluebottons,
        width: width(21),
        height: height(10),
        borderRadius: 8,
        margin: 5,
        paddingTop: 6,
        padding: 10,
    },
    namebtmmenu: {
        fontSize: 11,
        color: Colors.white,
        marginTop: 5,
    },
    iconstbn: {
        color: Colors.white,
    }
});

export default Menu;