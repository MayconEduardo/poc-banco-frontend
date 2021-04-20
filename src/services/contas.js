import { http } from './config'

export default {
    listarContas:() => {
        return http.get('conta')
    },
    deposito:(id, valor) => {
        return http.post(`conta/deposito/${id}`, valor)
    },
    saque:(id, valor) => {
        return http.post(`conta/saque/${id}`, valor)
    }
}