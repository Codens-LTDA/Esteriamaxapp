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
import Containerbox from './Containerbox';
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

const Box = ({ navigation, client, departament }) => {
    const [boxes, setBoxes] = useState([]);
    const [boxes2, setBoxes2] = useState([]);
    const [loading, setLoading] = useState(true);
    const [finish, setFinish] = useState(false);
    const [openbox, setOpenbox] = useState(false);
    const [modal, setModal] = useState(false);
    const [receiver, setReceive] = useState('');
    const [current, setCurrent] = useState([]);
    const [delivered, setDelivered] = useState(false);
    const [indexsave, setIndex] = useState('');
    const [indexsave2, setIndex2] = useState('');
    const swipeableRef = useRef({});
    const routeRef = useRef({});

    useEffect(() => {
        async function loadBoxes() {
            const userreference = await AsyncStorage.getItem('userreference');
            const response = await api.get('/boxesdelivery', {
                client: client,
                departament: departament
            });
            setBoxes(response.data.delivery);

            const response2 = await api.get('/boxesdelivered', {
                client: client,
                departament: departament
            });
            setDelivered(true);
            setLoading(false)
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

    function Saveindex(index) {
        console.log(index + '  - s')
    }

    function LeftActions(progress, dragX) {
        const scale = dragX.interpolate({
            inputRange: [0, 100],
            outputRange: [0, 1],
            extrapolate: 'clamp'
        })

        return (
            <View style={styles.leftAction}>
                <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>Entregar</Animated.Text>
                <FontAwesomeIcon icon={faTruck} size={27} style={styles.iconboxdelivery} />
            </View>
        );
    }

    async function showcount(caixa, lacre) {
        const userreference = await AsyncStorage.getItem('userreference');
        const response = await api.get('/deliverypromotershow', {
            id_caixa: caixa,
            id_lacre: lacre,
            promotor_id: userreference
        });

        return response
    }



    const handleLeft = (box, index) => {
        setIndex(index)
        showcount(box.cnt_id, box.lcr_id).then(function (response) {
            if (response.data.countshow > 0) {
                setIndex('')
                showMessage({
                    message: "Esta caixa ja foi entregue",
                    type: "danger",
                });
                swipeableRef.current[index].close();
            } else {
                setCurrent(box)
                setModal(true)
            }
        })
    }

    const noneCurrent = () => {
        setCurrent([])
    }

    const hideModal = () => {
        setModal(false)
        swipeableRef.current[indexsave].close();
        setIndex('')
    }

    const deliveryMaterial = () => {
        setModal(false);
        delivery(current);
        setFinish(true);
        swipeableRef.current[indexsave].close();
        setIndex('')

    }

    async function delivery(box) {
        try {
            const userreference = await AsyncStorage.getItem('userreference');
            const response = await api.post('/deliverypromoter', {
                id_promotor: userreference,
                id_caixa: box.cnt_id,
                id_lacre: box.lcr_id,
                recebedor: receiver,
                status: 2,
            });

            if (response.data.response == 'sucess') {
                showMessage({
                    message: "Caixa entregue",
                    type: "success",
                });
            }

            routeRef.current[indexsave].setNativeProps({
                style: {
                    backgroundColor: '#bfffd2',
                }
            });

            setReceive('');
            setCurrent([])
        } catch (err) {

        }
    }


    return (
        <>
            {
                modal === true ?
                    (
                        <Mymodal modal={true} hideModal={hideModal}>
                            <Text style={styles.titlemodal}>Insira o nome de quem está recebendo os materiais</Text>
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
                                    <TouchableOpacity style={styles.delivery} onPress={event => deliveryMaterial()}>
                                        <Text style={styles.textwhite}>Entregar</Text>
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
                                    Nenhuma caixa para entrega foi encontrada.
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
                            ref={(element) => swipeableRef.current[index] = element}
                            renderLeftActions={LeftActions}
                            onSwipeableLeftOpen={event => handleLeft(box, index)}
                        >
                            <View>
                                <Containerbox box={box} current={current} nonecurrent={noneCurrent} myref={(element) => routeRef.current[index] = element}></Containerbox>
                            </View>
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
        margin: 20,
    },
    nonetext: {
        textAlign: 'center',
        color: '#29BE56',
    },
    teste: {
        backgroundColor: 'red',
    }
})

export default Box;