import React, { useEffect, useState, useMemo } from 'react';
import { HomeContext } from '../../../context';
import Dash from './Dash';
import Menu from './Menu';
import Header from '../../../components/Header';
import Colors from '../../../utils/Colors';
import { width, height, totalSize } from 'react-native-dimension';
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
//import Splash from '../pages/auth/Splash';

const Home = ({ navigation }) => {

    const homeContext = React.useMemo(() => {
    });

    return (
        <HomeContext.Provider value={homeContext}>
            <View style={styles.main}>
                <Header />
                <Dash navigation={navigation} />
                <Menu navigation={navigation} />
            </View>
        </HomeContext.Provider>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.blue,
        alignItems: 'center',
        width: width(100),
    },
});

export default Home;