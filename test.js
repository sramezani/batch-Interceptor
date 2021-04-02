import apiClient from "./apiClient";

// All requests should run at the same time and produce only one request to the backend. All requests should return or reject.
function runTest() {
    const batchUrl = "/file-batch-api";

    // Should return [{id:"fileid1"},{id:"fileid2"}]
    apiClient.get(batchUrl, {params: {ids: ["fileid1","fileid2"]}}).then((res) => {
        console.log('response 1', res);
    }).catch((err) => {
        console.log('error 1', err);
    })

    // Should return [{id:"fileid2"}]
    apiClient.get(batchUrl, {params: {ids: ["fileid2"]}}).then((res) => {
        console.log('response 2', res);
    }).catch((err) => {
        console.log('error 2', err);
    })

    // Should reject as the fileid3 is missing from the response
    apiClient.get(batchUrl, {params: {ids: ["fileid3"]}}).then((res) => {
        console.log('response 3', res);
    }).catch((err) => {
        console.log('error 3', err);
    })

    setTimeout(() => {
        apiClient.get(batchUrl, {params: {ids: ["fileid1","fileid7"]}}).then((res) => {
            console.log('response 4', res);
        }).catch((err) => {
            console.log('error 4', err);
        })
    }, 2000);

    setTimeout(() => {
        apiClient.get(batchUrl, {params: {ids: ["fileid3"]}}).then((res) => {
            console.log('response 5', res);
        }).catch((err) => {
            console.log('error 5', err);
        })
    }, 4000);

    setTimeout(() => {
        apiClient.get(batchUrl, {params: {ids: ["fileid4","fileid5", "fileid3"]}}).then((res) => {
            console.log('response 6', res);
        }).catch((err) => {
            console.log('error 6', err);
        })
    }, 6000);

    setTimeout(() => {
        apiClient.get(batchUrl, {params: {ids: ["fileid2"]}}).then((res) => {
            console.log('response 7', res);
        }).catch((err) => {
            console.log('error 7', err);
        })
    }, 8000);
}

runTest();