### PURPOSE
---
Enfast asynchronous job, especially API call.

### ACTION
---

1. #### FastPromise(object)
New buffer with given windowSize(default : 100)

2. #### FastPromise.load(Function)
Load new payload to instance

3. #### FasetPromise.run()
Run all jobs, job will be executed with chunk size.

Set windowSize to prevent being blocked by API server when using HTTP request.
Make sure that QPS(Quota per second) don't exceed the host server.

### USAGE
---

```js
const axios = require('axios');

const { FastPromise } = require('./lib/fast-promise');

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
    const jobs = new FastPromise({ windowSize : 1000 });

    for(let i=0; i<2000; i++) jobs.load(() => fetcher());

    const ret = await jobs.run();
    console.log(ret);
    console.log(ret.pop());
})()
```

### OPTIONS
---
```js
new FastPromise(options = {
    windowSize : 'number'//size of request chunk
} 
```