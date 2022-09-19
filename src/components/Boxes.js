import React, { useEffect, useState, useMemo } from 'react';
import { RouteContext } from '../context';
import Colors from '../utils/Colors';
import api from '../services/api';
import { width, height, totalSize } from 'react-native-dimension';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBox, faTruck } from '@fortawesome/free-solid-svg-icons'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const Boxes = ({ navigation, client, departament }) => {
    const [boxes, setBoxes] = useState([]);

    useEffect(() => {
        async function loadBoxes() {
            try {
                const response = await api.get('/boxinclients', {
                    client: client,
                    departament: departament
                });
                setBoxes(response.data.boxinclient)

            } catch (err) {
                console.log(err.data)
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

    return (
        <View style={styles.container}>
            <View style={styles.viewboxes}>
                <FontAwesomeIcon icon={faBox} size={20} style={styles.iconboxes} />
                <Text style={styles.boxestext2}>Caixas no cliente:</Text>
            </View>
            <View style={styles.boxes}>
                {
                    boxes.length === 0 ?
                        (
                            <Text style={styles.boxestext2}>0</Text>
                        )
                        :
                        null
                }
                {
                    boxes.map((box, index) => (
                        <Text key={index} style={styles.boxestext}> {box.cnt_nome}, </Text>
                    ))
                }
            </View>
        </View>

    );
};

const styles = StyleSheet.create({
    container: {        
        width: width(91),
        marginVertical: -5,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        marginBottom: 5,
        padding: 5,
    },
    boxes: {
        display: 'flex',
        flexDirection: 'row',
    },
    boxestext2: {
        color: Colors.blue,
    },
    boxestext: {
        color: Colors.blue,
        backgroundColor: Colors.grayboxroute,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        marginHorizontal: 1,
    },
    viewboxes: {
        display: 'flex',
        flexDirection: 'row',
    },
    iconboxes: {
        marginRight: 5,
        color: Colors.blue,
    }
})

export default Boxes;