import axios from 'axios';

console.log(process.env.EXPO_PUBLIC_API_URL)
const ApiHttpClient = axios.create({
    baseURL: `${process.env.EXPO_PUBLIC_API_URL}/api/`,  // URL base de la API
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,  // Configuración de tiempo de espera
});

// Interceptores de respuesta o petición, si es necesario
ApiHttpClient.interceptors.response.use(
    response => response,
    error => Promise.reject(error)
);

export default ApiHttpClient;