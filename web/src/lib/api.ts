import axios from 'axios'
import * as ipconfig from './ipconfig'

export const api = axios.create({
  baseURL: `http://${ipconfig.getIpAddress()}:3333`,
})
