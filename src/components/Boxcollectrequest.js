import React, { useEffect, useState, useMemo } from 'react';
import { RouteContext } from '../context';
import Colors from '../utils/Colors';
import api from '../services/api';
import { width, height, totalSize } from 'react-native-dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBox } from '@fortawesome/free-solid-svg-icons'
import Countitenscollectrequest from './Countitenscollectrequest';
import Norequest from './Norequest';
import { showMessage, hideMessage } from "react-native-flash-message";

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const Boxcollectrequest = ({ navigation, client, departament }) => {
    const [boxes, setBoxes] = useState([]);
    const [openbox, setOpenbox] = useState(false);

    useEffect(() => {
    }, []);

    useEffect(() => {
        return () => {
            setBoxes([])
        };
    }, []);

    const routeContext = React.useMemo(() => {
    });

    const clickOut = () => {
        setOpenbox(!openbox)
    }

    return (
        <View>
            <TouchableOpacity style={styles.boxes} onPress={clickOut}>
                <View style={styles.viewtext}>
                    <View style={styles.sideleft}>
                        <FontAwesomeIcon icon={faBox} size={27} style={styles.iconbox} />
                        <Text style={styles.textbox}> Não vinculado</Text>
                    </View>
                    <View style={styles.sideright}>
                        <Countitenscollectrequest client={client} departament={departament} />
                    </View>
                </View>
                <View style={openbox === true ? styles.openbox : styles.box}>
                    {
                        openbox === true ?
                            (
                                <Norequest client={client} departament={departament} />
                            )
                            :
                            null
                    }
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    viewtext: {
        display: 'flex',
        flexDirection: 'row',
        width: width(91),
        borderWidth: 1,
        backgroundColor: Colors.grayboxroute,
        borderColor: Colors.graygray,
        marginVertical: 10,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        padding: 5,
    },
    sideleft: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: width(50),
        paddingVertical: 1,
    },
    sideright: {
        alignItems: 'flex-end',
        width: width(38),
    },
    iconbox: {
        color: Colors.blue,
        marginRight: 5,
    },
    textbox: {
        alignItems: 'center',
        color: Colors.graygeneral,
        fontWeight: 'bold',
        fontSize: 16,
    },
    openbox: {
        borderWidth: 1,
        borderBottomLeftRadius: 3,
        borderBottomRightRadius: 3,
        width: width(91),
        borderWidth: 1,
        backgroundColor: Colors.white,
        borderColor: Colors.graygray,
        marginTop: -11,
        padding: 5,
    }
})

export default Boxcollectrequest;