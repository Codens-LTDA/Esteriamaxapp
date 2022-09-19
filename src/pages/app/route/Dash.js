import React, { useEffect, useState, useMemo } from 'react';
import { RouteContext } from '../../../context';
import Header from '../../../components/Header';
import Colors from '../../../utils/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes, faTruck, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons'
import { width, height, totalSize } from 'react-native-dimension';
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu from './Menu';
import { useNavigation } from '@react-navigation/native';
import Clients from '../../../components/Clients';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    TouchableHighlight,
    Linking,
    ScrollView,
    RefreshControl,
    ActivityIndicator,
    Dimensions
} from 'react-native';


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const Dash = (props) => {
    const navigation = useNavigation();
    const [routes, setRoutes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [open, setOpen] = useState(false);
    const routeContext = React.useMemo(() => {
    });

    useEffect(() => {
        async function loadClients() {
            try {
                const userreference = await AsyncStorage.getItem('userreference');
                setLoading(true)
                const response = await api.get('/routes', {
                    promotor_id: userreference,
                    idrota: props.routesparams.idrota
                });
                console.log(response.data.clients)
                setRoutes(response.data.clients)
                setLoading(false)

            } catch (err) {
                console.log(err.data)
            }
        };
        loadClients();
    }, []);

    useEffect(() => {
        return () => {
            setRoutes([])
        };
    }, []);

    const renderLoading = () => {
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    };

    async function reloadClients() {
        setLoading(false)
        const userreference = await AsyncStorage.getItem('userreference');
        const response = await api.get('/routes', {
            promotor_id: userreference,
            idrota: props.routesparams.idrota
        });
        setRoutes(response.data.clients)
    };

    const onRefresh = React.useCallback(() => {
        setOpen(false);
        setRefreshing(true);
        reloadClients()
        wait(1000).then(() => setRefreshing(false));
    }, []);

    const backHome = () => {
        props.navigation.navigate('Home', {});
    }

    return (
        <RouteContext.Provider value={routeContext}>
            <View style={styles.main}>
                <View style={props.menu !== "nomenu" ? styles.page : styles.page2}>
                    <View style={styles.header}>
                        {
                            props.menu !== 'nomenu' ?
                                (
                                    <TouchableOpacity onPress={backHome}>
                                        <FontAwesomeIcon icon={faTimes} size={30} style={styles.iconstbn} />
                                    </TouchableOpacity>
                                )
                                :
                                null
                        }
                    </View>
                    <View style={styles.containertitle}>
                        <FontAwesomeIcon icon={faTruck} size={30} style={styles.iconstitle} />
                        <Text style={styles.titlepage}>Rotas de entregas e coletas</Text>
                    </View>
                    {
                        props.menu !== 'nomenu' ?
                            (<Menu navigation={navigation} idroute={props.routesparams.idrota} />)
                            :
                            null
                    }
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
                            routes !== undefined && routes.length === 0 ?
                                (
                                    <>
                                        <View style={styles.empty}>
                                            <Text style={styles.textempty}>Nenhuma rota encontrada até o momento.</Text>
                                        </View>
                                    </>
                                )
                                :
                                null
                        }
                        {

                            routes !== undefined && routes.map((route, index) => (
                                <Clients navigation={navigation} route={route[0]} loading={loading} refreshing={refreshing} key={index} index={index} menu={props.menu} page={props.page} />
                            ))
                        }

                    </ScrollView>
                </View>
            </View>
        </RouteContext.Provider>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

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
        height: windowHeight > 800 ? height(70) : height(61),
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
    containertitle: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20,
    },
    titlepage: {
        fontSize: 22,
        marginBottom: 20,
        marginTop: -5,
        color: Colors.graygeneral,
    },
    iconstitle: {
        marginRight: 10,
        color: Colors.graygeneral,
    },
    wait: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height(80),
    },
    empty: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        height: height(60),
    },
    textempty: {
        textAlign: 'center',
    },
    loading: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center',
        height: height(60),
    },
});

export default Dash;