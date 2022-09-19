import React from 'react';
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
import Colors from '../../utils/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context';
import api from '../../services/api';
import logo from '../../assets/images/tms.png';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faTimes, faTruck, faUser } from '@fortawesome/free-solid-svg-icons'
import { useNavigation } from '@react-navigation/native';
import { showMessage, hideMessage } from "react-native-flash-message";

const Loginproducao = ({ route }) => {
	const [user, setUser] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [isLoading, setIsLoading] = React.useState(false);
	const [usercode, setUsercode] = React.useState('');
	const { signIn } = React.useContext(AuthContext);
	const [loginTry, setLoginTry] = React.useState(false);
	const navigation = useNavigation();

	const onPressLogin = () => {
		handleSubmit();
	};

	const onPressLoginpromotor = () => {
		navigation.navigate('Login', { from: 'login' });
	};

	const onPressFastLogin = () => {
		navigation.navigate('Scanner', { from: 'login' });
	};

	const handleSubmit = async () => {
		if (validateInputs()) {
			try {
				const response = await api.post('/logintechnical', {
					login: user,
					password: password,
				});

				if (response.data.user.tipo === 'producao') {
					proceed(response.data);
				}
			} catch (err) {
				console.log(err);
				if (err.status == 401) {
					showMessage({
						message: "Login ou senha inválidos, ou este usuário não é um promotor.",
						type: "danger",
					});
				}
			}
			return;
		}
	};


	const validateInputs = () => {
		if (!user.length) {
			showMessage({
				message: "Informe o usuário",
				type: "danger",
			});
			return false;
		}

		if (!password.length) {
			showMessage({
				message: "Informe a senha",
				type: "danger",
			});
			return false;
		}

		return true;
	};

	const proceed = async response => {
		try {
			await AsyncStorage.setItem('username', response.user.usu_login);
			await AsyncStorage.setItem('userid', response.user.usu_id);
			await AsyncStorage.setItem('usernivel', response.user.usu_nivel);
			await AsyncStorage.setItem('userreference', response.user.usu_referencia);
			await AsyncStorage.setItem('token', response.token);
			await AsyncStorage.setItem('name', response.name);
			await AsyncStorage.setItem('type', response.user.tipo);
		} catch (e) {
			console.log(e);
		}
		signIn();
	};

	React.useEffect(() => {
		setIsLoading(false);

		if (route.params && !loginTry) {
			const code = route.params.qrvalue;
			if (code) {
				setUsercode(code);
				logUser();
			}
		}
	});

	if (isLoading) {
		//return <Splash />;
	}

	return (
		<KeyboardAvoidingView enabled={Platform.OS === 'ios' || Platform.OS === 'android'} behavior="padding" style={styles.main}>
			<View style={styles.logoContainer}>
				<Image
					style={styles.logo}
					source={logo}
				/>
			</View>
			<View style={styles.textlogin}>
				<FontAwesomeIcon icon={faUser} size={30} style={styles.iconstbn} />
				<Text style={styles.textfont}>Logue-se como produção</Text>
			</View>
			<View style={styles.SectionStyle}>
				<TextInput
					style={styles.inputs}
					placeholder="Produção"
					onChangeText={text => setUser(text)}
					value={user}
					onSubmitEditing={handleSubmit}
					underlineColorAndroid="transparent"
				/>
			</View>
			<View style={styles.SectionStyle}>
				<TextInput
					style={styles.inputs}
					placeholder="Senha"
					onChangeText={text => setPassword(text)}
					value={password}
					onSubmitEditing={handleSubmit}
					underlineColorAndroid="transparent"
					autoCapitalize="none"
					secureTextEntry={true}
					placeholderStyle={styles.placeholder}
				/>
			</View>
			<View style={styles.buttons}>
				<TouchableOpacity style={styles.buttonFirst} onPress={onPressLogin}>
					<Text style={styles.buttonsText}>Logar como produção</Text>
				</TouchableOpacity>
			</View>
			<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
				<View style={{ flex: 1, height: 3, backgroundColor: Colors.borderbottons }} />
				<View>
					<Text style={{ width: 50, textAlign: 'center', color: Colors.borderbottons }}>OU</Text>
				</View>
				<View style={{ flex: 1, height: 3, backgroundColor: Colors.borderbottons }} />
			</View>
			<View style={styles.buttons2}>
				<TouchableOpacity style={styles.buttonSecound} onPress={onPressLoginpromotor}>
					<FontAwesomeIcon icon={faTruck} size={30} style={styles.iconstbn2} />
					<Text style={styles.buttonsText}>Logue-se como promotor</Text>
				</TouchableOpacity>
			</View>
			{/*
			<Text style={styles.buttonsDevider}>ou</Text>
			<TouchableOpacity style={styles.button} onPress={onPressFastLogin}>
			<Image
			source={require('../../assets/images/metro-qrcode.png')}
			style={styles.ImageStyle}
			/>
			<Text style={styles.buttonsText}>Acesso Rápido</Text>
		</TouchableOpacity>        
			*/}
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	main: {
		flex: 1,
		padding: 20,
		backgroundColor: Colors.blue,
	},
	logoContainer: {
		alignItems: 'center',
		height: 150,
		justifyContent: 'center',
	},
	logo: {
		width: 150,
		resizeMode: 'contain',
	},
	SectionStyle: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 30
	},
	inputs: {
		flex: 1,
		backgroundColor: '#fff',
		borderRadius: 5,
		color: Colors.blue,
		paddingLeft: 10,
		fontSize: 18
	},
	ImageStyle: {
		padding: 10,
		margin: 5,
		height: 40,
		width: 40,
		resizeMode: 'stretch',
		alignItems: 'center',
	},
	buttons: {
		marginTop: 50,
	},
	button: {
	},
	buttonFirst: {
		alignItems: 'center',
		backgroundColor: Colors.bluebottons,
		borderRadius: 5,
		borderColor: Colors.bluebottons,
		borderWidth: 4,
		height: 50,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	buttons2: {
		marginTop: 20,
	},
	buttonSecound: {
		alignItems: 'center',
		backgroundColor: Colors.blue,
		borderRadius: 5,
		borderColor: Colors.borderbottons,
		borderWidth: 4,
		height: 50,
		flexDirection: 'row',
		justifyContent: 'center',
	},
	buttonsText: {
		textAlign: 'center',
		color: Colors.white,
		fontSize: 18,
		fontWeight: 'bold',
	},
	buttonsDevider: {
		color: Colors.black,
		alignSelf: 'center',
		paddingBottom: 15,
		fontSize: 16,
		marginTop: 15,
	},
	placeholder: {
		fontSize: 30,
		color: Colors.blue,
	},
	textlogin: {
		display: 'flex',
		flexDirection: 'row',
	},
	iconstbn: {
		color: Colors.borderbottons,
		marginRight: 10,
	},
	iconstbn2: {
		color: Colors.white,
		marginRight: 10,
	},
	textfont: {
		fontSize: 18,
		color: Colors.borderbottons,
	}
});



export default Loginproducao;
