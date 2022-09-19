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
    ScrollView,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import api from '../../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes, faTruck, faMapMarkerAlt, faUser, faKey } from '@fortawesome/free-solid-svg-icons'
import { width, height, totalSize } from 'react-native-dimension';
import moment, { updateLocale } from "moment";
import ptbr from 'moment/src/locale/pt-br';
import 'moment/locale/pt-br'  // without this line it didn't work
//import Splash from '../pages/auth/Splash';
import { showMessage, hideMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DatePicker from 'react-native-date-picker'
import { Button } from 'react-native'
import { set } from 'react-native-reanimated';
import Places from './places';

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Config = ({ navigation }) => {

    const [userName, setUserName] = React.useState('');
    const [date2, setDate] = useState(
        new Date())
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState();
    const [text, setText] = React.useState('-');
    const [routeplaces, routePlaces] = React.useState([]);
    const configContext = React.useMemo(() => {
    });
    const [refreshing, setRefreshing] = useState(false);

    React.useEffect(() => {
        async function date() {
            try {
                const userreference = await AsyncStorage.getItem('userreference');
                setLoading(true)
                const response = await api.get('/reportroutesplaces', {
                    promotor_id: userreference,
                    date: moment(date2).format('YYYY-MM-DD')
                    ,
                });
                routePlaces(response.data.routes);
                setLoading(false)
            } catch (err) {
                console.log(err.data)
            }
        }
        date();

        const unsubscribe = navigation.addListener('focus', () => {
            const loadName = async () => {
                const userName = await AsyncStorage.getItem('name');
                setUserName(userName);
            };
            loadName();
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        return () => {
        };
    }, []);

    const openShow = () => {
        setOpen(!open)
    }

    async function datechoose(date) {
        try {
            date = moment(date).format('YYYY-MM-DD');
            console.log(date)

            const userreference = await AsyncStorage.getItem('userreference');
            setLoading(true)
            const response = await api.get('/reportroutesplaces', {
                promotor_id: userreference,
                date: date,
            });
            routePlaces(response.data.routes);
            setLoading(false)
        } catch (err) {
            console.log(err.data)
        }
    }

    const backHome = () => {
        navigation.navigate('Home', {});
    }

    async function reloadRoutes () {
        try {
            var date = moment(date2).format('YYYY-MM-DD');
            const userreference = await AsyncStorage.getItem('userreference');
            setLoading(true)
            const response = await api.get('/reportroutesplaces', {
                promotor_id: userreference,
                date: date,
            });
            routePlaces(response.data.routes);
            setLoading(false)
        } catch (err) {
            console.log(err)
        }        
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        reloadRoutes()
        wait(1000).then(() => setRefreshing(false));
    }, []);

    return (
        <View style={styles.main}>
            <View style={styles.page}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={backHome}>
                        <FontAwesomeIcon icon={faTimes} size={30} style={styles.iconstbn} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.title}>Relatório de rotas {moment(date2).format('DD/MM/YYYY')}</Text>

                <Button title="Selecione uma data" onPress={() => setOpen(true)} />
                <DatePicker
                    modal
                    locale={'pt-br'}
                    open={open}
                    date={date2}
                    onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)
                        datechoose(date)
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />

                <View>
                    <ScrollView
                        style={styles.scroll}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                        {
                            loading === false && routeplaces.map((place, index) => (
                                <View>
                                    <Places place={place} index={index} date={date2} />
                                </View>
                            ))
                        }
                    </ScrollView>                            
                </View>
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
    header: {
        marginBottom: 5,
    },
    title: {
        fontSize: 20,
        margin: 10,
        marginBottom: 20,
        textAlign: 'center',
    },
    scroll: {
        marginBottom: 160,
    },
});

export default Config;