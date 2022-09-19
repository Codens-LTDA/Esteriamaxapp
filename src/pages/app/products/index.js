import React, { useEffect, useState, useMemo } from 'react';
import { ProductContext } from '../../../context';
import Colors from '../../../utils/Colors';
import { width, height, totalSize } from 'react-native-dimension';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes, faTag, faSearch } from '@fortawesome/free-solid-svg-icons'
import api from '../../../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NumberFormat from 'react-number-format';

import {
    View,
    Text,
    StyleSheet,
    Image,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    ScrollView,
    FlatList,
    ActivityIndicator
} from 'react-native';
//import Splash from '../pages/auth/Splash';

const Item = ({ title, value = 0 }) => (
    <View style={styles.row}>
        <View style={styles.containernome}>
            <Text style={styles.nome}>{title}</Text>
        </View>
        <View style={styles.containerprice}>
            <NumberFormat
            value={value}
            displayType={'text'}
            thousandSeparator={true}
            prefix={'R$ '}
            renderText={formattedValue => <Text  style={styles.price}>{formattedValue}</Text>} // <--- Don't forget this!
            />        
        </View>
    </View>
);

const Products = ({ navigation }) => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [opensearch, setOpenSearch] = useState();
    const [loading, setLoading] = useState(true);

    const flatListRef = React.useRef()

    const toTop = () => {
        // use current
        flatListRef.current.scrollToOffset({ animated: true, offset: 0 })
    }

    const productContext = React.useMemo(() => {
    });

    const renderItem = ({ item }) => (
        <Item title={item.nop_nome} value={item.nop_valor} />
    );

    useEffect(() => {
        async function loadProducts() {
            const response = await api.get('/products', {
                search: "",
                page: 1,
            });
            setProducts(response.data.products)
            setLoading(false);
        };
        loadProducts();
    }, []);

    useEffect(() => {
        return () => {
            setProducts([])
        };
    }, []);

    const backHome = () => {
        navigation.navigate('Home', {});
    }

    const searchChange = (event) => {
        setSearch(event)

        if (event.length > 3) {
            setOpenSearch(true)
            searchProducts(event)
        }/* else {
            if (event.length < 0) {
                searchProducts('')
            }
        }*/
    }

    async function lazyLoadproduct() {
        setLoading(true)        
        const response = await api.get('/products', {
            search: "",
            page: page+1,
        });
        console.log(response.data.products)
        setProducts([...products,...response.data.products])
        setPage(page + 1)
        setLoading(false)
    };

    const renderFooter = () => {
        if (loading === true) return null;
        return (
            <View style={styles.loading}>
                <ActivityIndicator size="small" color="#0000ff" />
            </View>
        );
    };

    async function searchProducts() {
        console.log('acionei')        
        setLoading(true) 
        setPage(1)        
        const tokenUser = await AsyncStorage.getItem('token');
        const response = await api.get('/products', {
            search: search,
            page: 1,
        });
        console.log('terminei')

        var arr = []

        setProducts([...response.data.products, ...arr])
        setPage(page + 1)
        setLoading(false)
    };

    return (
        <ProductContext.Provider value={productContext}>
            <View style={styles.main}>
                <View style={styles.page}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={backHome}>
                            <FontAwesomeIcon icon={faTimes} size={30} style={styles.iconstbn} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.sidesearch}>
                        <View style={styles.containertitle}>
                            <FontAwesomeIcon icon={faTag} size={30} style={styles.iconstitle} />
                            <Text style={styles.titlepage}>Materiais</Text>
                        </View>
                        <Text style={styles.textsearch}>Pesquise por algum material</Text>
                        <View style={styles.containersearch}>
                            <FontAwesomeIcon icon={faSearch} size={30} style={styles.iconsearch} />
                            <TextInput
                                style={styles.search}
                                placeholder={'Pesquisar'}
                                onChangeText={event => searchChange(event)}
                                  clearButtonMode='always'
                                value={search}
                            />
                        </View>
                    </View>
                    <View style={styles.viewflat}>
                        {
                            loading === true ?
                                (
                                    <View style={styles.wait}>
                                        <ActivityIndicator size="large" color="#0000ff" />
                                    </View>
                                )
                                :
                                null
                        }
                        <FlatList
                            data={products}
                            renderItem={renderItem}
                            keyExtractor={item => item.nop_id}
                            onEndReached={lazyLoadproduct}
                            onEndReachedThreshold={0.01}
                            removeClippedSubviews={true}
                            initialNumToRender={30}
                        />
                    </View>
                </View>
            </View>
        </ProductContext.Provider>
    );
};

const styles = StyleSheet.create({
    main: {
        flex: 1,
        backgroundColor: Colors.blue,
    },
    page: {
        marginTop: '5%',
        backgroundColor: Colors.white,
        height: height(98),
        width: width(100),
    },
    header: {
        marginBottom: 5,
    },
    iconstbn: {
        marginTop: 5,
        marginLeft: 5,
        color: '#545454',
    },
    viewflat: {
        margin: 10,
    },
    item: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        marginVertical: -1,
        marginHorizontal: 10,
        borderColor: '#000',
        borderWidth: 1,
    },
    row: {
        flexDirection: 'row',
        backgroundColor: Colors.lightlightBlue,
        marginBottom: 3,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 2,
    },
    containernome: {
        width: width(75),
    },
    containerprice: {
        width: width(20),
    },
    title: {
        fontSize: 12,
    },
    price: {
        fontSize: 12,

    },
    wait: {
        justifyContent: 'center',
        alignItems: 'center',
        height: height(80),
    },
    textwait: {
        width: 300,
        textAlign: 'center',
    },
    sidesearch: {
        padding: 10,
    },
    search: {
        borderColor: '#545454',
        borderWidth: 1,
        width: width(95),
        height: 40,
        marginBottom: 10,
        fontSize: 15,
    },
    textsearch: {
        marginBottom: 5,
    },
    titlepage: {
        fontSize: 22,
        marginBottom: 20,
        marginTop: -5,
        color: Colors.graygeneral,
    },
    containertitle: {
        display: 'flex',
        flexDirection: 'row',
    },
    containersearch: {
        display: 'flex',
        flexDirection: 'row',
    },
    iconstitle: {
        marginRight: 10,
        color: Colors.graygeneral,
    },
    iconsearch: {
        zIndex: 9,
        position: 'absolute',
        top: 5,
        right: 10,
        color: Colors.blue,
    },
    loading: {
        width: 100,
    }

});

export default Products;