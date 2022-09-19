import React, { useEffect, useState, useMemo } from 'react';
import { RouteContext } from '../context';
import Colors from '../../../utils/Colors';
import { width, height, totalSize } from 'react-native-dimension';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes, faTruck, faMapMarkerAlt, faBox, faCheck, faBriefcase } from '@fortawesome/free-solid-svg-icons'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { showMessage, hideMessage } from "react-native-flash-message";
import Clientreport from './clientreport';

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
    ActivityIndicator
} from 'react-native';

const Place = ({ place, index, date }) => {
    const [openbox, setOpenbox] = useState(false);

    const routeContext = React.useMemo(() => {
    });

    const navigation = useNavigation();

    const clickOut = () => {
        setOpenbox(!openbox)
    }

    return (
        <View>
            <TouchableOpacity style={openbox === false ? styles.boxroute : styles.boxrouteopen} key={index} onPress={clickOut}>
                <View style={styles.boxplace}>
                    <View style={styles.sideleft}>
                        <Text>{place.reg_nome}</Text>
                    </View>
                    <View style={styles.sideright}>
                        {
                            place.rota_status === '1' ?
                                (
                                    <View style={styles.boxstatusnotconclude}>
                                        <Text style={styles.textconclude}>Não concluída</Text>
                                    </View>
                                )
                                :
                                (
                                    <View style={styles.boxstatusconclude}>
                                        <Text style={styles.textconclude}>Concluída</Text>
                                    </View>
                                )
                        }
                    </View>
                </View>
            </TouchableOpacity>
            <View style={openbox === true ? styles.openbox : styles.openboxnone}>
                {
                    openbox === true ?
                        (
                            <>
                                <Clientreport idroute={place.rota_id} index={index} date={date} />
                            </>
                        )
                        :
                        null
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    boxplace: {
        backgroundColor: Colors.grayboxroute,
        paddingVertical: 15,
        paddingHorizontal: 5,
        marginVertical: 10,
        borderRadius: 4,
        display: 'flex',
        flexDirection: 'row',
    },
    sideright: {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        width: width(40),
    },
    sideleft: {
        width: width(60)
    },
    boxstatusconclude: {
        backgroundColor: '#29BE56',
        paddingVertical: 1,
        paddingHorizontal: 6,
        borderRadius: 3,
    },
    boxstatusnotconclude: {
        backgroundColor: '#FF9226',
        paddingVertical: 1,
        paddingHorizontal: 6,
        borderRadius: 3,
    },
    textconclude: {
        color: '#fff',
    },
    textnotconclude: {
        color: '#000',
    }
})

export default Place;