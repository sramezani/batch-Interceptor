import apiClient from "./apiClient";

const _generateLog = (type, number, res) => {
    console.log(
        '%c' + type + 'NO. ' + number + ' : ',
        'color: #004D40; font-weight: bold',
        res
    )
}

// All requests should run at the same time and produce only one request to the backend. All requests should return or reject.
function runTest() {
    const batchUrl = "/file-batch-api";

    // Should return [{id:"fileid1"},{id:"fileid2"}]
    apiClient.get(batchUrl, {params: {ids: ["fileid1","fileid2"]}}).then((res) => {
        _generateLog('Response', 1, res);
    }).catch((err) => {
        _generateLog('Rrror', 1, err);
    })

    // Should return [{id:"fileid2"}]
    apiClient.get(batchUrl, {params: {ids: ["fileid2"]}}).then((res) => {
        _generateLog('Response', 2, res);
    }).catch((err) => {
        _generateLog('Rrror', 2, err);
    })

    // Should reject as the fileid3 is missing from the response
    apiClient.get(batchUrl, {params: {ids: ["fileid3"]}}).then((res) => {
        _generateLog('Response', 3, res);
    }).catch((err) => {
        _generateLog('Rrror', 3, err);
    })

    setTimeout(() => {
        apiClient.get(batchUrl, {params: {ids: ["fileid1","fileid7"]}}).then((res) => {
            _generateLog('Response', 4, res);
        }).catch((err) => {
            _generateLog('Rrror', 4, err);
        })
    }, 2000);

    setTimeout(() => {
        apiClient.get(batchUrl, {params: {ids: ["fileid8"]}}).then((res) => {
            _generateLog('Response', 5, res);
        }).catch((err) => {
            _generateLog('Rrror', 5, err);
        })
    }, 4000);

    setTimeout(() => {
        apiClient.get(batchUrl, {params: {ids: ["fileid4","fileid5", "fileid3"]}}).then((res) => {
            _generateLog('Response', 6, res);
        }).catch((err) => {
            _generateLog('Rrror', 6, err);
        })
    }, 6000);

    setTimeout(() => {
        apiClient.get(batchUrl, {params: {ids: ["fileid2"]}}).then((res) => {
            _generateLog('Response', 7, res);
        }).catch((err) => {
            _generateLog('Rrror', 7, err);
        })
    }, 8000);
}

runTest();