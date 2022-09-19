import { create } from 'apisauce';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = create({
    baseURL: 'http://skm.com.br/apiesterimax/v1',
    timeout: 20000,
    method: 'HEAD',
    mode: 'no-cors',
    withCredentials: true,
    crossdomain: true,
});

api.addResponseTransform(response => {
    if (!response.ok) throw response;
});

api.axiosInstance.interceptors.request.use(
    async config => {
        const token = await AsyncStorage.getItem('token')

        console.log(token)

        if (token) {
            config.headers.token = token
        } else {
            const token = await AsyncStorage.setItem('token', 'notoken')
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)


export default api;