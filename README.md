# batch-interceptor

### Run Project:
1- clone the project

2- install the packages
```
yarn
```
3- run the project
```
yarn start
```
4- open the browser console to get details


#### Problem:
The clients makes a number (X) of requests to the provided endpoint with different file ids. All these requests are done within a certain time interval (1st request happens at moment S, 2nd request at S+2sec, and so on). The interceptor is expected to "catch" all these requests (for example, all requests executed within 10 seconds) and converge them into a single one (that contains all ids) and then dispatch that single request to the server. Once the response comes back from the server, the client should be able to properly resolve each of the X requests it has initially made.

#### Solution:
We have multiple requests at different times in `test.js` (The latest request will be executed after 8 seconds)
In `interceptor.js` we will batch all requests.

##### Idea:
The idea is to cancel previous requests to the same endpoint, and let the last one execute.

We have a `TIME_INTERVAL = 2000` that's mean for a specific `url` this example `/file-batch-api` we will check if we didn't receive a new request we will call the API. Otherwise, we wait 2 seconds again.

- All parameters will be merge with this part of code (none duplicate)
```
allParams = [...new Set([...allParams, ...originalRequest.params.ids])];
```

When we get global response from server `(instance.interceptors.response)` (because we sent all paramaters)
we have 2 part:
- First part: the latest request by client. immediatly after we received response we will generate response based on this request params `_generateResponse` 
- Second part: previuse requests. Here we need wait for "First part" response. then we have this part of code:
```
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
```
Because we don't know when will receive a response. Every 1 second we will check, when the response received we will continue and generate responses for all previous requests with params ids we sent in cancellation.
If the generated response is empty we reject it by:
```
message: `${response.config.ids} is missing from the response`
```
