import axios from "axios"
const baseUrl = process.env.API_BASE || '';

const parseUrl = (url,params) => {
  const str = Object.keys(params).reduce((result, key)=>{
    return result += `${key}=${params[key]}&`
  }, '')
  console.log('==>url',`${baseUrl}/api${url}?${str.substr(0,str.length-1)}`);
  return `${baseUrl}/api${url}?${str.substr(0,str.length-1)}`
}

export const get = (url, params)=>{
  return new Promise((resolve, reject)=>{
    params = params || {}
    axios.get(parseUrl(url, params)).then(resp=>{
      const data = resp.data;
      if(data && data.success) {
        resolve(data);
      } else {
        reject(data)
      }
    }).catch(reject);
  })
}

export const post = (url, params, data)=>{
  return new Promise((resolve, reject)=>{
    axios.post(parseUrl(url, params),data).then(resp=>{
      const data = resp.data;
      if(data && data.success) {
        resolve(data);
      } else {
        reject(data)
      }
    }).catch(reject);
  })
}