import React, { useEffect } from 'react';
import {
  StatusBar,
  View,
  StyleSheet
} from 'react-native';
import OneSignal from 'react-native-onesignal'
//import SplashScreen from 'react-native-splash-screen';
import Colors from './utils/Colors';
import Navigation from './navigation/index';
import SplashScreen from 'react-native-splash-screen';
import FlashMessage, { showMessage, hideMessage } from "react-native-flash-message";
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './services/api';

const App = () => {
  //OneSignal Init Code
  OneSignal.setLogLevel(6, 0);
  OneSignal.setAppId("c30a1e3e-487c-4e8b-bd16-f59dbec99654");
  //END OneSignal Init Code

  //Method for handling notifications received while app in foreground
  OneSignal.setNotificationWillShowInForegroundHandler(notificationReceivedEvent => {

    console.log("OneSignal: notification will show in foreground:", notificationReceivedEvent);
    let notification = notificationReceivedEvent.getNotification();
    console.log("notification: ", notification);
    const data = notification.additionalData
    console.log("additionalData: ", data);
    // Complete with null means don't show a notification.
    notificationReceivedEvent.complete(notification);
  });

  //Method for handling notifications opened
  OneSignal.setNotificationOpenedHandler(notification => {
    console.log("OneSignal: notification opened:", notification);
  });

  useEffect(() => {
    async function getDevice() {
      const deviceState = await OneSignal.getDeviceState();
      console.log(deviceState);

      const userid = await AsyncStorage.getItem('userid');

      //insert extern user in onsignal device
      const response = await api.post('/adddevice', {
        app_id: 'c30a1e3e-487c-4e8b-bd16-f59dbec99654',
        identifier: deviceState.pushToken,
        language: 'pt',
        device_type: 1,
        external_user_id: userid
      });

      //insert device vinculate user
      const response2 = await api.post('/deviceuser', {
        token: deviceState.pushToken,
        id: response.data.id,
        usu_id: userid
      });
    }

    getDevice();
    SplashScreen.hide();
  });


  /**
      const deviceState = await OneSignal.getDeviceState();

       */

  return (
    <>
      <StatusBar barStyle="white-content" backgroundColor="#0E76EE" />
      <Navigation />
      <FlashMessage position="top" />
    </>
  );
};

export default App;