const axios = require('axios');
const qs = require('qs');

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