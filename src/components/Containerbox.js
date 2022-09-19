import React, { useEffect, useState, useMemo, useRef } from 'react';
import { RouteContext } from '../context';
import Colors from '../utils/Colors';
import api from '../services/api';
import { width, height, totalSize } from 'react-native-dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBox, faTruck } from '@fortawesome/free-solid-svg-icons'
import Countitens from './Countitens';
import Itens from './Itens';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Mymodal from './Modal';
import { showMessage, hideMessage } from "react-native-flash-message";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    TextInput,
    ActivityIndicator
} from 'react-native';
import { baseProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';

const ContainerBox = ({ box, navigation, client, departament, current, nocurrent, myref }) => {
    console.log(myref)
    const [openbox, setOpenbox] = useState(false);

    useEffect(() => {
    }, []);

    useEffect(() => {
        return () => {
        };
    }, []);

    const routeContext = React.useMemo(() => {
    });

    const clickOut = () => {
        setOpenbox(!openbox)
    }


    return (
        <>
            <TouchableOpacity style={styles.boxes} onPress={clickOut}>
                <View style={box.his_status === '2' ? styles.viewtext2 : styles.viewtext} ref={myref}>
                    <View style={styles.sideleft}>
                        <FontAwesomeIcon icon={faBox} size={27} style={styles.iconbox} />
                        <Text style={styles.textbox}>{box.caixa}</Text>
                    </View>
                    <View style={styles.sideright}>
                        <Countitens caixa={box.cnt_id} lacre={box.lcr_id} />
                    </View>
                </View>
                <View style={openbox === true ? styles.openbox : styles.box}>
                    {
                        openbox === true ?
                            (
                                <Itens caixa={box.cnt_id} lacre={box.lcr_id} />
                            )
                            :
                            null
                    }
                </View>
            </TouchableOpacity>
        </>
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
    viewtext2: {
        display: 'flex',
        flexDirection: 'row',
        width: width(91),
        borderWidth: 1,
        backgroundColor: '#bfffd2',
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
    iconboxdelivery: {
        color: Colors.white,
        marginLeft: 5,
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
    },
    leftAction: {
        display: 'flex',
        flexDirection: 'row',
        width: width(91),
        borderWidth: 1,
        backgroundColor: '#29BE56',
        borderColor: '#29BE56',
        marginVertical: 10,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        padding: 5,
    },
    actionText: {
        color: 'white',
    },
    inputpromoter: {
        borderWidth: 1,
        width: width(80),
        marginVertical: 20,
    },
    boxbutton: {
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 30,
    },

    delivery: {
        width: width(35),
        height: 40,
        textAlign: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: '#29BE56',
        borderRadius: 4
    },
    collect: {
        width: width(35),
        height: 40,
        textAlign: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.bluebottons,
        borderRadius: 4
    },
    sideleftbt: {
        width: width(40),
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    siderightbt: {
        width: width(40),
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    textwhite: {
        color: Colors.white,
    },
    titlemodal: {
        fontSize: 18,
        textAlign: 'center',
    },
    activity: {
        width: width(88),
    },
    none: {
        backgroundColor: '#fff',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
    },
    nonetext: {
        textAlign: 'center',
        color: '#29BE56',
    }
})

export default ContainerBox;