import axios from 'axios'
const API_URL = process.env.APP_API_URL
const API_TOKEN = process.env.API_TOKEN

const client = function (API_URL, API_TOKEN) {
  const client = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${API_TOKEN}`
    }
  })

  return client
}

export default async ({ Vue }) => {
  Vue.prototype.$axios = await client(API_URL, API_TOKEN)
}

export { client }
