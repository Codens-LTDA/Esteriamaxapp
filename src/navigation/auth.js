import React from 'react';
import 'react-native-gesture-handler';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../pages/auth/Login';
import Loginproducao from '../pages/auth/Loginproducao';

const Stack = createStackNavigator();

const Auth = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Loginproducao" component={Loginproducao} />
        </Stack.Navigator>
    );
};

export default Auth;