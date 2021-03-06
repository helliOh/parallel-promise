### PURPOSE
---
Enfasting asynchronous job, especially API call.

## ACTION
---

```js
let fp = new AnyFastPromise(options)

/*
    New buffer with given windowSize(default : 100)
*/
```


```js
AnyFastPromise.load(Function)

/*
    Load new payload to instance
*/
```


```js
AnyFastPromise.run()

/*
    Run all jobs, job will be executed with chunk size.

    Set windowSize to prevent being blocked by API server when using HTTP request.
    Make sure that QPS(Quota per second) don't exceed the host server.
*/
```

### FastPromiseStream :: Event
```js
FastPromiseStream.on('error')//emits when error occurs
```

```js
FastPromiseStream.on('resolve')//emits when window be resolved
```

```js
FastPromiseStream.on('done')//emits when events ends
```

## USAGE
---

### FastPromise
```js
const axios = require('axios');

const { FastPromise } = require('./lib');

async function fetcher(){
    return new Promise(async (resolve, reject) =>{
        try{
            const foo1 = Math.floor( Math.random() * 100 );
            const foo2 = Math.floor( Math.random() * 100 );
            const url = `https://postman-echo.com/get?foo1=${foo1}&foo2=${foo2}`;
            const response = await axios.get(url);
            resolve(response.data);
        }
        catch(e){
            reject(e);
        }
    })
}

(async () =>{
    const jobs = new FastPromise({ windowSize : 1000, windowInterval : 1000 });

    for(let i=0; i<2000; i++) jobs.load(() => fetcher());

    const ret = await jobs.run();
    console.log(ret);
    console.log(ret.pop());
})()
```

### FastPromiseStream
```js
const axios = require('axios');

const { FastPromiseStream } = require('./lib');

async function fetcher(){
    return new Promise(async (resolve, reject) =>{
        try{
            const foo1 = Math.floor( Math.random() * 100 );
            const foo2 = Math.floor( Math.random() * 100 );
            const url = `https://postman-echo.com/get?foo1=${foo1}&foo2=${foo2}`;
            const response = await axios.get(url);
            resolve(response.data);
        }
        catch(e){
            reject(e);
        }
    })
}

(async () =>{
    const promiseStream = new FastPromiseStream({ windowSize : 1000 });

    for(let i=0; i<2000; i++) promiseStream.load(() => fetcher());

    promiseStream
    .on('resolve', (data) =>{
        console.log(data);
    })
    .on('error', (e) =>{
        console.error(e);
    })
    .on('done', (code) =>{
        console.log('done');
    })

    promiseStream.run();
})()
```

## OPTIONS
---
```js
new FastPromise(options = {
    windowSize : 'number',//(default: 1000) size of request chunk,
    windowInterval : 'number'//(default: 0) milliseconds if set, sleep for each chunk
} 

new FastPromiseStream(options = {
    windowSize : 'number',//(default: 1000) size of request chunk,
    windowInterval : 'number'//(default: 0) milliseconds if set, sleep for each chunk
} 
```