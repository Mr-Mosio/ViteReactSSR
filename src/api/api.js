import axios from 'axios';
import {cookies, parseCookie} from '../utils/utils.js';
import {useEffect, useState} from 'react';

const useApi = (req, url, method = "GET", options = {}) => {
  return {
    fetch: async () => {
      const OPTIONS = {
        headers: {},
        data: {},
        auth: false ,
        ...options,
      }
      try {
        const res = await axios({
          method: method.toUpperCase(),
          url: "BASE_URL" + url,
          headers: {
            ...OPTIONS.headers,
            Authorization:
                OPTIONS.auth && cookies(req?.cookies)?.token ? "Bearer " + cookies(req?.cookies)?.token?.token : undefined,
          },
          data: OPTIONS.data,
        })
        if (res.data.status){
          return res.data ;
        }else {
          throw new ApiError(res.data.message, res) ;
        }
      }catch (e) {
        return {code: e.response.status , status: false, data: e.data ?? null, message: e.status === false ? e.message : "مشکلی رخ داده است . لطفا مجدد تلاش کنید ."}
      }
    }
  }
}
useApi.hook = (request) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fetchData = async (data= undefined) => {
    setLoading(true)
    const res = await request.fetch(data)
    if (res.status){
      setData(res.data)
    }else {
      setError(res.message)
    }
    setLoading(false)
    return res ;
  }

  function init(data= undefined) {
    useEffect(() => {
      fetchData(data);
    }, [])
  }
  function reset() {
    setData(null)
    setLoading(false)
    setError(null)
  }
  return {
    reset,
    fetch: fetchData,
    init,
    data,
    setData,
    error,
    loading,
  }
}
export default useApi;

export function getPostsRequest(req) {
  return useApi(req?.request,"/posts", "GET")
}
class  ApiError extends Error {
  constructor(message, response) {
    super(message);
    this.response = response;
  }
}