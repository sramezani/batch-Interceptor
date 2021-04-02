import axios from 'axios';

const TIME_INTERVAL = 2000; // 2 seconds

const _generateResponse = (ids, gloalResponse) => {
    let res = [];
    ids.map((item) => {
        const index = gloalResponse.map((e) => e.id).indexOf(item);
        if (index > -1) {
            res.push(gloalResponse[index])
        }
    });
    return res;
}

function batchInterceptor(instance) {

    let currentRequest = {};
    let allParams = [];
    let batchResponse = [];
    let cancelConfig = {}

    instance.interceptors.request.use((req) => {
        let originalRequest = req;

        allParams = [...new Set([...allParams, ...originalRequest.params.ids])];

        if (currentRequest[req.url]) {
            const source = currentRequest[req.url];
            delete currentRequest[req.url];
            source.cancel(cancelConfig);
        }

        cancelConfig = {
            ids: originalRequest.params.ids
        }

        const CancelToken = axios.CancelToken;
        const source = CancelToken.source();
        originalRequest.cancelToken = source.token;
        currentRequest[req.url] = source;
        
        originalRequest.ids = originalRequest.params.ids;
        originalRequest.params = {ids: allParams};

        return new Promise((resolve) => setTimeout(() => {
            resolve(originalRequest)
        }, TIME_INTERVAL))

    }, (err) => {
        return Promise.reject(err);
    });

    instance.interceptors.response.use( async (response) => {
        if (currentRequest[response.request.responseURL]) {
            delete currentRequest[response.request.responseURL];
        }

        batchResponse = response.data.items;
        const res = _generateResponse(response.config.ids, batchResponse);

        return new Promise((resolve, reject) => {
            if (res.length) {
                resolve(res)
            }
            else {
                reject({
                    message: `${response.config.ids} is missing from the response`
                })
            }
        });
    },
    async (error) => {

        async function waitUntilResponse() {
            return await new Promise(resolve => {
                const interval = setInterval(() => {
                if (batchResponse.length) {
                    resolve();
                    clearInterval(interval);
                };
                }, 1000);
            });
        }
        await waitUntilResponse();

        const { config, message } = error;
        const originalRequest = config;

        if (axios.isCancel(error)) {
            return new Promise((resolve, reject) => {
                const res = _generateResponse(message.ids, batchResponse);
                if (res.length) {
                    resolve(res)
                }
                else {
                    reject({
                        message: `${message.ids} is missing from the response`
                    })
                }
            });
        }

        if (currentRequest[originalRequest.url]) {
            delete currentRequest[originalRequest.url];
        }

        return Promise.reject(error);
    });
}

export default batchInterceptor;