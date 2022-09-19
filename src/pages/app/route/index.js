import React, { useEffect, useState, useMemo } from 'react';
import { RouteContext } from '../../../context';
import Dash from './Dash';
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
//import Splash from '../pages/auth/Splash';

const Route = ({ navigation, route }) => {
    const [idrotacurrent, setIdCurrentRoute] = useState(route.params);

    const routeContext = React.useMemo(() => {
    });

    return (
        <RouteContext.Provider value={routeContext}>
            <View style={styles.main}>
                <Dash navigation={navigation} routesparams={idrotacurrent} />
            </View>
        </RouteContext.Provider>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.blue,
        alignItems: 'center',
    },
});

export default Route;