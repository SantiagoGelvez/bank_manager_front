import axios from 'axios';
import Swal from 'sweetalert2'

const apiClient = axios.create({
    baseURL: 'http://localhost:8001/api/',
    withCredentials: true,
})

apiClient.interceptors.response.use(function (response) {
    return response;
}, function (error) {
    if (error.response.status === 'EE_NETWORK' || error.response.status === 500) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'We have a problem with the network, please try again later',
        })
    }
    return Promise.reject(error);
});

export default apiClient;