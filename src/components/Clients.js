import React, { useEffect, useState, useMemo } from 'react';
import { RouteContext } from '../context';
import Colors from '../utils/Colors';
import { width, height, totalSize } from 'react-native-dimension';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes, faTruck, faMapMarkerAlt, faBox, faCheck, faBriefcase } from '@fortawesome/free-solid-svg-icons'
import Boxes from './Boxes';
import Status from './Status';
import Statuslarge from './Statuslarge';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Box from './Box';
import api from '../services/api';
import Mymodal from './Modal';
import Boxcollect from './Boxcollect';
import Boxcollectrequest from './Boxcollectrequest';
import { useNavigation } from '@react-navigation/native';
import { showMessage, hideMessage } from "react-native-flash-message";
import {
   View,
   Text,
   Linking,
   StyleSheet,
   Image,
   TextInput,
   KeyboardAvoidingView,
   Platform,
   TouchableOpacity,
   ScrollView,
   ActivityIndicator
} from 'react-native';

const Client = ({ route, loading, refreshing, index, menu, page }) => {
   const [openbox, setOpenbox] = useState(false);
   const [modal, setModal] = useState(false);
   const [client, setClient] = useState(false);

   const routeContext = React.useMemo(() => {
   });

   const navigation = useNavigation();

   const goScan = (cli) => {
      navigation.navigate('Scanboxpromotor', {
         cli: cli,
      });
   }


   async function loadDeliverycount() {
   }

   const hideModal = () => {
      setModal(false)
   }

   async function getCordinates(query) {
      const token = 'pk.eyJ1IjoibmFpbHNvbiIsImEiOiJja3g2NndybmwwYmZqMm9xbXoxaGdyM3g3In0.z_DPAw3gKXzrpca-bKPcfw';

      const response = api.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?country=br&routing=true&access_token=${token}`, {
      });
      return response
   }

   const goMap = (route) => {
      console.log(route)

      getCordinates(route)
         .then((res) => {
            console.log(res.data.features[0]);
            let cordinates = res.data.features[0].center
            console.log(cordinates)

            const latitude = cordinates[1];
            const longitude = cordinates[0];
            const label = route;


            const url = Platform.select({
               ios: "maps:" + latitude + "," + longitude + "?q=" + label,
               android: "geo:" + latitude + "," + longitude + "?q=" + label
            });
            Linking.openURL(url);

         })
   }

   async function finishclient(idclient) {
      try {
         const userreference = await AsyncStorage.getItem('userreference');
         const response = await api.get('/countdelivery', {
            departament: route.dpto_id,
            client: route.cli_id,
            promotor_id: userreference,
         });

         const responsecollect = await api.get('/countcollect', {
            departament: route.dpto_id,
            client: route.cli_id,
            promotor_id: userreference,
         });

         if (response.data.delivery !== 0) {
            showMessage({
               message: "Este cliente não pode ser finalizado, ainda tem caixas para entregar.",
               type: "warning",
            });
         } else if (responsecollect.data.collect !== 0) {
            showMessage({
               message: "Este cliente não pode ser finalizado, ainda tem caixas para coletar.",
               type: "warning",
            });
         } else {
            loadDeliverycount();
            setModal(true);
         }



      } catch (err) {
         console.log(err)
      }
   }

   async function finish() {
      const userreference = await AsyncStorage.getItem('userreference');
      const response = await api.post('/finishclient', {
         idclient: route.cli_id,
      });


      if (response.data.response == 'sucess') {
         showMessage({
            message: "Cliente finalizado",
            type: "success",
         });
      }
      setClient(null);
      setModal(false);
   }

   const clickOut = () => {
      setOpenbox(!openbox)
   }

   return (
      <View style={styles.boxroutes}>
         {
            modal === true ?
               (
                  <Mymodal modal={true} hideModal={hideModal}>
                     <Text style={styles.titlemodal}>Você está prestes a finalizar este cliente. Ele não aparecerá mais na lista de rotas, tem certeza?</Text>
                     <View style={styles.boxbutton}>
                        <View style={styles.siderightbt}>
                           <TouchableOpacity style={styles.collect} onPress={event => hideModal()}>
                              <Text style={styles.textwhite}>Voltar</Text>
                           </TouchableOpacity>
                        </View>
                        <View style={styles.sideleftbt}>
                           <TouchableOpacity style={styles.delivery} onPress={event => finish()}>
                              <Text style={styles.textwhite}>Finalizar</Text>
                           </TouchableOpacity>
                        </View>
                     </View>
                  </Mymodal>
               )
               :
               null
         }

         <TouchableOpacity style={openbox === false ? styles.boxroute : styles.boxrouteopen} key={index} onPress={clickOut}>
            <View style={styles.sideleft}>
               <Text style={styles.nome}>{route.cli_nome}</Text>
               <View style={styles.boxdepartament}>
                  <Text style={styles.tiponome}>Setor: </Text>
                  <Text style={styles.nome}>{route.dpto_nome}</Text>
               </View>
               <Text style={styles.address}>
                  {route.cli_logradouro + ', n°' + route.cli_numero + ', ' + route.cli_bairro + ' - Cep: ' + route.cli_cep}
               </Text>
            </View>
            <View style={menu !== "nomenu" ? styles.sideright : styles.sideright2}>
               <Status client={route.cli_id} key={index} index={index} departament={route.dpto_id} />
               <TouchableOpacity onPress={(event) => goScan(route.cli_id)} style={styles.boxempty}>
                  <FontAwesomeIcon icon={faBox} size={21} style={styles.iconsbt2} />
                  <Text style={styles.mapbt2}>Caixas vazias</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={(event) => goMap(route.cli_logradouro + ' ' + route.cli_numero + ' ' + route.cli_cep + ' ' + route.cli_bairro)} style={styles.gomap}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} size={21} style={styles.iconsbt} />
                  <Text style={styles.mapbt}>Google Maps</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={(event) => finishclient(route.cli_id)} style={styles.gomap2}>
                  <FontAwesomeIcon icon={faCheck} size={21} style={styles.iconsbt} />
                  <Text style={styles.mapbt}>Finalizar </Text>
               </TouchableOpacity>
            </View>
         </TouchableOpacity>
         {
            refreshing === false ?
               (
                  <View style={openbox === true ? styles.openbox : styles.openboxnone}>
                     {
                        openbox === true ?
                           (
                              <>
                                 <Boxes client={route.cli_id} key={index} index={index} departament={route.dpto_id} />
                                 <View>
                                    <Statuslarge client={route.cli_id} departament={route.dpto_id} key={index} index={index} wich="delivery" />
                                    <Box client={route.cli_id} departament={route.dpto_id} />
                                    <Statuslarge client={route.cli_id} departament={route.dpto_id} key={index} index={index} wich="collect" />
                                    <Boxcollect client={route.cli_id} departament={route.dpto_id} />
                                    <Boxcollectrequest client={route.cli_id} key={index} departament={route.dpto_id} />
                                 </View>
                              </>
                           )
                           :
                           null
                     }
                  </View>
               )
               :
               null
         }
      </View>
   );
};

const styles = StyleSheet.create({
   boxroute: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: Colors.grayboxroute,
      borderColor: Colors.grayborderroute,
      borderWidth: 1,
      borderRadius: 3,
      marginVertical: 4,
      paddingVertical: 4,
      paddingHorizontal: 7,
   },
   boxrouteopen: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: Colors.grayboxroute,
      borderColor: Colors.grayborderroute,
      borderWidth: 1,
      borderTopLeftRadius: 3,
      borderTopRightRadius: 3,
      marginVertical: 4,
      paddingVertical: 4,
      paddingHorizontal: 7,
   },
   iconsbt: {
      color: Colors.blue,
   },
   iconsbt2: {
      marginRight: 1,
      color: Colors.white,
   },
   sideleft: {
      width: width(52),
   },
   sideright: {
      width: width(40),
      alignItems: 'flex-end',
   },
   sideright2: {
      width: width(35),
      alignItems: 'flex-end',
   },
   nome: {
      fontSize: 14,
      color: Colors.blue,
      textTransform: 'capitalize',
   },
   tiponome: {
      fontSize: 14,
      color: Colors.blue,
      textTransform: 'capitalize',
      fontWeight: 'bold',
   },
   address: {
      fontSize: 11,
      color: Colors.blue,
      textTransform: 'capitalize',
   },
   gomap: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: Colors.white,
      borderColor: 3,
      borderColor: Colors.blue,
      borderWidth: 1,
      paddingHorizontal: 6,
      paddingVertical: 3,
      borderRadius: 3,
      marginVertical: 2,
   },
   gomap2: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: Colors.white,
      borderColor: 3,
      borderColor: Colors.blue,
      borderWidth: 1,
      paddingHorizontal: 18,
      paddingVertical: 3,
      borderRadius: 3,
      marginVertical: 2,

   },
   boxempty: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: Colors.blue,
      borderColor: 3,
      borderColor: Colors.white,
      borderWidth: 1,
      paddingHorizontal: 6,
      paddingVertical: 6,
      borderRadius: 3,
      marginVertical: 2,
   },
   mapbt: {
      fontSize: 11,
      color: Colors.blue,
   },
   mapbt2: {
      fontSize: 11,
      color: Colors.white,
   },
   containermenu: {
      backgroundColor: 'red',
      height: 30,
   },
   openbox: {
      display: 'flex',
      backgroundColor: Colors.white,
      borderColor: Colors.grayborderroute,
      borderWidth: 1,
      borderTopWidth: 0,
      borderBottomLeftRadius: 3,
      borderBottomRightRadius: 3,
      paddingVertical: 4,
      paddingHorizontal: 7,
      marginTop: -4,
   },
   openboxnone: {
      display: 'none',
   },
   titlemodal: {
      fontSize: 18,
      textAlign: 'center',
   },

   boxbutton: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: 100,
      marginBottom: 30,
   },


   siderightbt: {
      width: width(40),
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
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


   delivery: {
      width: width(35),
      height: 40,
      textAlign: 'center',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      backgroundColor: Colors.blue,
      borderRadius: 4
   },

   boxdepartament: {
      display: 'flex',
      flexDirection: 'row',
   },

   iconsbt33: {
      marginRight: 5,
   },

   textwhite: {
      color: Colors.white,
   }
})

export default Client;