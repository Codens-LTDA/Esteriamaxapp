import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
const Stack = createStackNavigator();
import Home from '../pages/app/home';
import Product from '../pages/app/products';
import Route from '../pages/app/route';
import Scanboxproducao from '../pages/app/scanboxproducao';
import Scanboxpromotor from '../pages/app/scanboxpromotor';
import Scanmountbox from '../pages/app/scanmontagembox';
import Scanrequest from '../pages/app/scanrequest';
import Scanrequestothers from '../pages/app/scanrequestothers';
import Config from '../pages/app/config';
import Historic from '../pages/app/historic';

const App = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Product"
                component={Product}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Route"
                component={Route}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Scanboxproducao"
                component={Scanboxproducao}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Scanboxpromotor"
                component={Scanboxpromotor}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Scanmountbox"
                component={Scanmountbox}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Scanrequest"
                component={Scanrequest}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Scanrequestothers"
                component={Scanrequestothers}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Config"
                component={Config}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Historic"
                component={Historic}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
};

export default App;