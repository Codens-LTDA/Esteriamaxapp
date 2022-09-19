import React, { useEffect, useState, useMemo } from 'react';
import { HomeContext } from '../../../context';
import Header from '../../../components/Header';
import Colors from '../../../utils/Colors';
import { width, height, totalSize } from 'react-native-dimension';
import Dashroute from '../route/Dash';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBell, faCog, faDoorOpen, faBox, faTag, faMapSigns, faSun, faCloudMoon, faClock, faCheck } from '@fortawesome/free-solid-svg-icons';
import api from '../../../services/api';
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
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    TouchableHighlight,
    ActivityIndicator,
    Dimensions,
    RefreshControl
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment, { updateLocale } from "moment";
import ptbr from 'moment/src/locale/pt-br';
import 'moment/locale/pt-br'  // without this line it didn't work
import { showMessage, hideMessage } from "react-native-flash-message";

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Dash = ({ navigation }) => {
    const [tipo, setTipo] = useState('');
    const [boxes, setBoxes] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = React.useState('-');
    const [year, setYear] = React.useState('-');
    const [text, setText] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const route = (idrota) => {
        navigation.navigate('Route', { idrota });
    }

    const historic = () => {
    }

    async function done(route) {
        try {
            const userreference = await AsyncStorage.getItem('userreference');
            const response = await api.post('/finishroute', {
                promotor: userreference,
                route: route,
            });

            if (response.data.finishroutes == 'ok') {
                showMessage({
                    message: "Rota finalizada com sucesso",
                    type: "success",
                });
            } else {
                showMessage({
                    message: "Esta rota ainda tem clientes para serem resolvidos.",
                    type: "warning",
                });
            }
        } catch (err) {
            console.log(err.data)
        }
    }

    async function reloadRoutes() {
        setLoading(false)
        try {
            const userreference = await AsyncStorage.getItem('userreference');
            setLoading(true)
            var day = moment().format('dddd');
            day = day.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            day = day.substring(0, day.indexOf('-'));

            const response = await api.get('/routesplaces', {
                promotor_id: userreference,
                day: day
            });
            setRoutes(response.data.routes)
            setLoading(false)
        } catch (err) {
            console.log(err.data)
        }
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        reloadRoutes()
        wait(1000).then(() => setRefreshing(false));
    }, []);


    useEffect(() => {
        async function loadTipo() {
            try {
                const tipo = await AsyncStorage.getItem('type');
                setTipo(tipo)

                if (tipo === 'producao') {
                    setLoading(true)
                    async function loadBoxes() {
                        try {
                            const userid = await AsyncStorage.getItem('userid');
                            const response = await api.get('/receiveshow', {
                                colaborador: userid
                            });
                            setBoxes(response.data.boxes)
                            setLoading(false);
                        } catch (err) {
                            console.log(err.data)
                        }
                    };
                    loadBoxes();
                }
            } catch (err) {
            }
        };
        loadTipo();

        async function loadRoutes() {
            try {
                const userreference = await AsyncStorage.getItem('userreference');
                setLoading(true)
                var day = moment().format('dddd');
                day = day.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                day = day.substring(0, day.indexOf('-'));

                const response = await api.get('/routesplaces', {
                    promotor_id: userreference,
                    day: day
                });
                setRoutes(response.data.routes)
                setLoading(false)
            } catch (err) {
                /*Message token invalid */
                console.log(err.data)
            }
        };
        loadRoutes();

        async function date() {
            var currentTime = new Date();
            moment.updateLocale('pt-br');
            var month = moment().format('MMMM');
            var year = moment().format('YYYY');
            setMonth(month);
            setYear(year);
        }
        date();


        async function date2() {
            var currentTime = new Date();
            moment.updateLocale('pt-br');
            var day = moment().format('dddd');
            var daynumber = moment().format('DD');
            var month = moment().format('MM');
            var year = moment().format('YYYY');

            var text = `Rotas para hoje ${day}, dia ${daynumber} do ${month} de ${year}`;
            setText(text);
        }
        date2();
    }, []);

    useEffect(() => {
        return () => {
        };
    }, []);


    const homeContext = React.useMemo(() => {
    });

    const renderLoading = () => {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    };

    return (
        <HomeContext.Provider value={homeContext}>
            <ScrollView
                style={styles.scroll}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
            >
                <TouchableWithoutFeedback onPress={tipo === 'producao' ? historic : null}>
                    <View style={styles.main}>
                        <View accessible={false} >
                            {
                                tipo === 'producao' ?
                                    (
                                        <>
                                            <Text style={styles.title}>Caixas lidas no mês {month} de {year}</Text>
                                            {
                                                loading === true ?
                                                    (
                                                        <>
                                                            {
                                                                renderLoading()
                                                            }
                                                        </>
                                                    )
                                                    :
                                                    null
                                            }
                                            {
                                                loading === false && boxes.map((box, index) => (
                                                    <View style={styles.boxproducao} key={index}>
                                                        <View style={styles.box}>
                                                            <FontAwesomeIcon icon={faBox} size={22} style={styles.iconstbn} />
                                                            <Text style={styles.qrcode}>{box.caixa}</Text>
                                                        </View>
                                                        <View style={styles.lacre}>
                                                            <Text style={styles.textlacre}>lacre: </Text>
                                                            <Text style={styles.textlacre}>{box.his_idlacre}</Text>
                                                        </View>
                                                    </View>
                                                ))
                                            }
                                        </>
                                    )
                                    :
                                    (
                                        <>
                                            <Text style={styles.textdateroutesplace}>{text}</Text>
                                            {
                                                loading === false && routes.map((routes, index) => (
                                                    <TouchableWithoutFeedback onPress={event => route(routes.hr_idrota)} key={index}>
                                                        <View style={styles.boxrouteplace}>
                                                            <View>
                                                                <View style={styles.container}>
                                                                    <FontAwesomeIcon icon={faMapSigns} size={22} style={styles.iconstbn} />
                                                                    <Text style={styles.text}>{routes.reg_nome}</Text>
                                                                </View>
                                                                <View style={styles.container}>
                                                                    {
                                                                        routes.periodo === 'Manhã' ?
                                                                            (<FontAwesomeIcon icon={faSun} size={22} style={styles.iconstbn} />)
                                                                            :
                                                                            (<FontAwesomeIcon icon={faCloudMoon} size={22} style={styles.iconstbn} />)
                                                                    }
                                                                    <Text style={styles.text}>Período: {routes.periodo}</Text>
                                                                    <FontAwesomeIcon icon={faClock} size={22} style={styles.iconstbn} />
                                                                    <Text style={styles.textobs}>{routes.rota_observacao}</Text>
                                                                </View>
                                                            </View>
                                                            <View style={styles.sidedone}>
                                                                <TouchableOpacity style={styles.done} onPress={event => done(routes.rota_id)}>
                                                                    <FontAwesomeIcon icon={faCheck} size={21} style={styles.iconswhite} />
                                                                    <Text style={styles.iconswhite}>Concluir </Text>
                                                                </TouchableOpacity >
                                                            </View>
                                                        </View>
                                                    </TouchableWithoutFeedback>
                                                ))
                                            }
                                        </>
                                    )
                            }
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </ScrollView>
        </HomeContext.Provider>
    );
};


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    main: {
        flexDirection: 'column',
        backgroundColor: Colors.white,
        width: width(95),
        height: windowHeight > 800 ? height(66) : height(56),
        marginTop: 10,
        borderRadius: 8,
    },

    boxproducao: {
        display: 'flex',
        flexDirection: 'row',
        margin: 5,
        backgroundColor: Colors.grayboxroute,
        borderRadius: 5,
        padding: 6,
    },
    box: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    },
    iconstbn: {
        marginRight: 5,
        color: Colors.bluelight,
    },
    qrcode: {
        fontSize: 18,
        color: Colors.blue,
    },
    lacre: {
        display: 'flex',
        flexDirection: 'row',
        marginLeft: 15,
        alignItems: 'center',
        alignContent: 'center',
    },
    textlacre: {
        fontSize: 18,
        color: Colors.blue,
    },
    title: {
        fontSize: 18,
        margin: 10,
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        height: height(60),
    },
    boxrouteplace: {
        display: 'flex',
        flexDirection: 'row',
        margin: 5,
        backgroundColor: Colors.lightBlue,
        borderRadius: 5,
        padding: 6,

    },
    textdateroutesplace: {
        textAlign: 'center',
        margin: 15,
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        margin: 4,
    },
    text: {
        marginLeft: 2,
        marginRight: 6,
    },
    textobs: {
        marginLeft: 2,
        marginRight: 6,
        textTransform: 'capitalize',
    },
    scroll: {
        height: '65%',
    },

    done: {
        width: width(27),
        height: 30,
        textAlign: 'center',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.blue,
        borderColor: 3,
        borderColor: Colors.blue,
        borderWidth: 2,
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 3,
        marginVertical: 2,
        display: 'flex',
        flexDirection: 'row',
    },

    sidedone: {
        alignItems: 'flex-end',
        alignContent: 'flex-end',
        justifyContent: 'center',
        width: width(30),
        alignItems: 'flex-end',
    },

    iconswhite: {
        color: Colors.white,
    }

});

export default Dash;