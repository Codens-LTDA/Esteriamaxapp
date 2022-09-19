import React, { useEffect, useState, useMemo } from 'react';
import { RouteContext } from '../../../context';
import Header from '../../../components/Header';
import Colors from '../../../utils/Colors';
import { width, height, totalSize } from 'react-native-dimension';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTruck, faTag, faBoxOpen, faBox, faFileAlt, faHome } from '@fortawesome/free-solid-svg-icons'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView
} from 'react-native';

const Menu = ({ navigation, idroute }) => {
    const routeContext = React.useMemo(() => {
    });

    const route = () => {
        navigation.navigate('Home', { idroute: idroute });
    }

    const mountBox = () => {
        navigation.navigate('Scanmountbox', { idroute: idroute });
    }


    return (
        <View horizontal={true} style={styles.main}>
            <TouchableOpacity style={styles.btnmenu} onPress={route}>
                <FontAwesomeIcon icon={faHome} size={29} style={styles.iconstbn} />
                <Text style={styles.namebtmmenu}>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnmenu} onPress={mountBox}>
                <FontAwesomeIcon icon={faBoxOpen} size={29} style={styles.iconstbn} />
                <Text style={styles.namebtmmenu}>Montagem de caixa</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnmenu}>
                <FontAwesomeIcon icon={faFileAlt} size={29} style={styles.iconstbn} />
                <Text style={styles.namebtmmenu}>Histórico de rotas</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flexDirection: 'row',
        width: width(100),
        marginTop: -10,
        marginBottom: 10,
        marginLeft: -3,
    },
    btnmenu: {
        backgroundColor: Colors.white,
        width: width(20),
        borderRadius: 4,
        margin: 4,
        paddingTop: 6,
        padding: 10,
        borderWidth: 1,
        borderColor: '#D1D1D1',
    },
    namebtmmenu: {
        fontSize: 10,
        color: Colors.blue,
        marginTop: 5,
    },
    iconstbn: {
        color: Colors.blue,
    }
})

export default Menu;