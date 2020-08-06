const axios = require('axios');
const qs = require('qs');

const { FastPromise, FastPromiseStream } = require('./lib');

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
    const jobs = new FastPromise({ windowSize : 500 });

    for(let i=0; i<2000; i++) jobs.load(() => fetcher());

    const ret = await jobs.run();
    console.log(ret);
    console.log(ret.pop());

    const promiseStream = new FastPromiseStream({ windowSize : 100, windowInterval : 100 });

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