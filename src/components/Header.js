import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Colors from '../utils/Colors';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logotms from '../assets/images/logo_tms.png';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBell, faCog, faDoorOpen } from '@fortawesome/free-solid-svg-icons'
import { width, height, totalSize } from 'react-native-dimension';
import moment, { updateLocale } from "moment";
import ptbr from 'moment/src/locale/pt-br';
import 'moment/locale/pt-br'  // without this line it didn't work

const Header = () => {
    const [userName, setUserName] = React.useState('');
    const [text, setText] = React.useState('-');
    const { signOut } = React.useContext(AuthContext);

    const navigation = useNavigation();

    React.useEffect(() => {
        async function date() {
            var currentTime = new Date();
            moment.updateLocale('pt-br');
            var day = moment().format('dddd');
            var daynumber = moment().format('DD');
            var month = moment().format('MMMM');
            var year = moment().format('YYYY');

            var text = `Hoje é ${day}, dia ${daynumber} de ${month} de ${year}`;
            setText(text);
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

    async function settings() {
        navigation.navigate('Config', {});
    }

    return (
        <View style={styles.container}>
            <View style={styles.containername}>
                <Text style={styles.nameuser}>Olá, {userName}</Text>
                <Text style={styles.date}>{text}</Text>
            </View>
            <View style={styles.bticons}>
                <TouchableOpacity style={styles.btns}>
                    <FontAwesomeIcon icon={faBell} size={30} style={styles.iconstbn} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btns} onPress={settings}>
                    <FontAwesomeIcon icon={faCog} size={30} style={styles.iconstbn} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.btns} onPress={signOut}>
                    <FontAwesomeIcon icon={faDoorOpen} size={30} style={styles.iconstbn} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 10,
        marginRight: 20,
    },
    containername: {
        width: width(60),
        padding: 3,
        paddingLeft: 10,
    },
    nameuser: {
        color: Colors.white,
        fontSize: 17,
    },
    date: {
        marginTop: 1,
        fontSize: 10,
        color: Colors.white,
    },
    bticons: {
        display: 'flex',
        flexDirection: 'row',
        width: width(35),
        padding: 3,
    },
    btns: {
        padding: 7,
    },
    iconstbn: {
        color: Colors.white,
    }
});

export default Header;