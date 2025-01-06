import api from "./api";

export const RequestServer = (method, endpoint, payload) => {

    console.log(payload, "payload")
    console.log(method, endpoint, "endpoint")
    return api[method](endpoint, payload)
        .then((res) => {
            console.log('inside HttpReq res ', res)
            if (res.status === 200) {
                console.log("status success ", res.data)
                return {
                    success: true, data: res.data
                }
            }
            else {
                console.log("error-status success ")
                return {
                    success: false,
                    error: {
                        status: res.status,
                        message: res.data.message
                    }
                }
            }
        }).catch((error) => {
            console.log('inside HttpReq error', error)
            console.log('inside HttpReq error content', error.response)
            return {
                success: false,
                error: {
                    status: error.response ? error.response.status : 'Error',
                    message: error.response ? error.response.data.content || error.response.data.message : 'Network Error'
                }
            }
        })
}
