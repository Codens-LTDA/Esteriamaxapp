import React, { useEffect, useState, useMemo, useRef } from 'react';
import { RouteContext } from '../context';
import Colors from '../utils/Colors';
import api from '../services/api';
import { width, height, totalSize } from 'react-native-dimension';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBox, faTruck } from '@fortawesome/free-solid-svg-icons'
import Countitenscollect from './Countitenscollect';
import Request from './Requests';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Mymodal from './Modal';
import { showMessage, hideMessage } from "react-native-flash-message";
import Containerboxcollect2 from './Containerboxcollect2'
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

const Boxcollect = ({ navigation, client, departament }) => {
    const [boxes, setBoxes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [finish, setFinish] = useState(false);
    const [openbox, setOpenbox] = useState(false);
    const [modal, setModal] = useState(false);
    const [receiver, setReceive] = useState('');
    const [current, setCurrent] = useState('');
    const [collected, setCollected] = useState(false);
    const [indexsave, setIndex] = useState('');
    const swipeableRef = useRef({});
    const routeRef = useRef({});

    useEffect(() => {
        async function loadBoxes() {
            try {
                const userreference = await AsyncStorage.getItem('userreference');
                const response = await api.get('/boxcollect', {
                    client: client,
                    departament: departament,
                    promotor_id: userreference
                });

console.log(response.data)

                if (response.data.boxescollect.length === 0) {
                    const userreference = await AsyncStorage.getItem('userreference');
                    const response = await api.get('/boxcollected', {
                        client: client,
                        departament: departament,
                        promotor_id: userreference
                    });
                    setLoading(false);
                    /*                    setCollected(true);/*
                      /*                  setBoxes(response.data.boxescollect);*/
                } else {
                    setLoading(false);
                    setBoxes(response.data.boxescollect);
                }
            } catch (err) {

            }
        };
        loadBoxes();
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

    function RightActions(progress, dragX) {

        const scale = dragX.interpolate({
            inputRange: [-100, 0],
            outputRange: [1, 0],
            extrapolate: 'clamp'
        })

        return (
            <View style={styles.rightAction}>
                <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>Coletar</Animated.Text>
                <FontAwesomeIcon icon={faTruck} size={27} style={styles.iconboxdelivery} />
            </View>
        );
    }

    async function showcount(caixa, lacre) {
        const userreference = await AsyncStorage.getItem('userreference');
        const response = await api.get('/collectpromotershow', {
            id_caixa: caixa,
            id_lacre: lacre,
            promotor_id: userreference
        });

        return response
    }

    const handleRight = (box, index) => {
        setIndex(index)
        showcount(box.cnt_id, box.lcr_id).then(function (response) {
            if (response.data.countshow > 0) {
                setIndex('')
                showMessage({
                    message: "Esta caixa ja foi coletada",
                    type: "danger",
                });
                swipeableRef.current[index].close();
            } else {
                setCurrent(box)
                setModal(true)
            }
        })

    }

    const hideModal = () => {
        setModal(false)
        swipeableRef.current[indexsave].close();
        setIndex('')
    }

    const collectMaterial = () => {
        setModal(false)
        collect(current)
        setFinish(true);
        swipeableRef.current[indexsave].close();
        setIndex('')
    }

    async function collect(box) {
        const userreference = await AsyncStorage.getItem('userreference');
        const response = await api.post('/collectpromoter', {
            id_promotor: userreference,
            id_caixa: box.cnt_id,
            id_lacre: box.lcr_id,
            entregador: receiver,
            status: 3,
        });

        if (response.data.response == 'sucess') {
            showMessage({
                message: "Caixa coletada",
                type: "success",
            });
        }

        routeRef.current[indexsave].setNativeProps({
            style: {
                backgroundColor: '#fcdfc4',
            }
        });

        setReceive('');
        setCurrent([])
    }
    return (
        <>
            {
                modal === true ?
                    (
                        <Mymodal modal={true} hideModal={hideModal}>
                            <Text style={styles.titlemodal}>Insira o nome de quem está lhe entregando os materiais</Text>
                            <TextInput style={styles.inputpromoter}
                                onChangeText={event => setReceive(event)}
                                value={receiver}
                                placeholder="Recebedor" />
                            <View style={styles.boxbutton}>
                                <View style={styles.siderightbt}>
                                    <TouchableOpacity style={styles.collect} onPress={event => hideModal()}>
                                        <Text style={styles.textwhite}>Voltar</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.sideleftbt}>
                                    <TouchableOpacity style={styles.delivery} onPress={event => collectMaterial()}>
                                        <Text style={styles.textwhite}>Coletar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Mymodal>
                    )
                    :
                    null
            }
            <View>
                {
                    loading === false && boxes.length === 0 ?
                        (
                            <View style={styles.none}>
                                <Text style={styles.nonetext}>
                                    Nenhuma caixa para coleta foi encontrada.
                                </Text>
                            </View>
                        )
                        :
                        null
                }
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
                    boxes.map((box, index) => (
                        <Swipeable
                            renderRightActions={RightActions}
                            onSwipeableRightOpen={event => handleRight(box, index)}
                            ref={(element) => swipeableRef.current[index] = element}
                        >
                            <Containerboxcollect2 box={box} client={client} departament={departament} myref={(element) => routeRef.current[index] = element}></Containerboxcollect2>
                        </Swipeable>
                    ))
                }
            </View>
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
        backgroundColor: '#fcdfc4',
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
    },
    rightAction: {
        display: 'flex',
        flexDirection: 'row-reverse',
        width: width(91),
        borderWidth: 1,
        backgroundColor: '#FF9226',
        borderColor: '#FF9226',
        marginVertical: 10,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        padding: 5,
    },
    actionText: {
        color: '#fff',
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
        backgroundColor: '#FF9226',
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
    iconboxdelivery: {
        color: Colors.white,
        marginLeft: 5,
    },
    none: {
        backgroundColor: '#fff',
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        margin: 20,
    },
    nonetext: {
        textAlign: 'center',
        color: '#FF9226',
    }
})

export default Boxcollect;