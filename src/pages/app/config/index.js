import React, { useEffect, useState, useMemo } from 'react';
import { ConfigContext } from '../../../context';
import Colors from '../../../utils/Colors';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import api from '../../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes, faTruck, faMapMarkerAlt, faUser, faKey } from '@fortawesome/free-solid-svg-icons'
import { width, height, totalSize } from 'react-native-dimension';
//import Splash from '../pages/auth/Splash';
import { showMessage, hideMessage } from "react-native-flash-message";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { set } from 'react-native-reanimated';

const Config = ({ navigation }) => {
    const [user, setUser] = useState('');
    const [open, setOpen] = useState(false);
    const [password, setPassword] = useState('');

    const configContext = React.useMemo(() => {
    });

    useEffect(() => {
        async function loadUser() {
            const name = await AsyncStorage.getItem('name');
            setUser(name)
        };
        loadUser();
    }, []);

    useEffect(() => {
        return () => {
        };
    }, []);

    const openShow = () => {
        setOpen(!open)
    }

    async function updatePass() {
        try {
            const userreference = await AsyncStorage.getItem('userreference');
            const response = await api.post('/password', {
                promoter: userreference,
                password: password,
                promotor: userreference
            });

            showMessage({
                message: "Sua senha foi alterada com sucesso.",
                type: "success",
            });

        } catch (err) {
            if (err.status == 401) {
                showMessage({
                    message: "Alguma coisa não está certa.",
                    type: "danger",
                });
            }
        }
        setPassword('')
    }

    const backHome = () => {
        navigation.navigate('Home', {});
    }

    return (
        <View style={styles.main}>
            <View style={styles.page}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={backHome}>
                        <FontAwesomeIcon icon={faTimes} size={30} style={styles.iconstbn} />
                    </TouchableOpacity>
                </View>
                <View style={styles.container}>
                    <View style={styles.avatar}>
                        <FontAwesomeIcon icon={faUser} size={50} style={styles.iconstbn2} />
                    </View>
                    <View>
                        <Text>{user}</Text>
                    </View>
                    <TouchableOpacity style={styles.btpass} onPress={openShow}>
                        <FontAwesomeIcon icon={faKey} size={25} style={styles.iconstbn3} />
                        <Text style={styles.textpass}>Alterar senha</Text>
                    </TouchableOpacity>
                </View>
                {
                    open === true ?
                        (
                            <View style={styles.boxpassword}>
                                <Text style={styles.textpass2}>Senha nova</Text>
                                <TextInput placeholder="Sua nova senha" secureTextEntry={true} onChangeText={text => setPassword(text)} value={password} style={styles.inputpass}></TextInput>
                                <TouchableOpacity style={styles.btpass2} onPress={updatePass}>
                                    <Text style={styles.textpass}>Salvar</Text>
                                </TouchableOpacity>
                            </View>
                        )
                        :
                        null
                }
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    page: {
        marginTop: '5%',
        paddingHorizontal: 10,
        backgroundColor: Colors.white,
        height: height(100),
        width: width(100),
    },
    page2: {
        marginTop: '5%',
        paddingHorizontal: 10,
        backgroundColor: Colors.white,
        height: height(75),
        width: width(95),
    },
    scroll: {
        marginBottom: 30,
    },
    header: {
        marginBottom: 5,
    },
    iconstbn: {
        marginTop: 5,
        marginLeft: 5,
        color: Colors.graygeneral,
    },
    iconstbn2: {
        marginTop: 5,
        marginLeft: 5,
        color: Colors.white,
    },
    containertitle: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20,
    },
    container: {
        marginTop: 40,
        textAlign: 'center',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',

    },
    avatar: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: Colors.gray,
        width: 80,
        height: 80,
        borderRadius: 100,
        padding: 10,
    },
    btpass: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: Colors.blue,
        width: 150,
        marginTop: 30,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 100,
    },
    btpass2: {
        display: 'flex',
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        backgroundColor: Colors.blue,
        width: width(85),
        marginTop: 30,
        paddingHorizontal: 10,
        paddingVertical: 10,
        borderRadius: 5,
    },
    iconstbn3: {
        marginRight: 10,
        color: Colors.white,
    },
    textpass: {
        color: Colors.white,
    },
    boxpassword: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: Colors.grayboxroute,
        borderWidth: 1,
        marginTop: 20,
        padding: 20,
        borderColor: Colors.gray,
    },
    inputpass: {
        borderWidth: 1,
        borderColor: Colors.gray,
        backgroundColor: Colors.white,
    },
    textpass2: {
        marginBottom: 5,
    }
});

export default Config;