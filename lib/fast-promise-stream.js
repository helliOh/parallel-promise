const { EventEmitter } = require("events");

async function sleep(ms){ return new Promise((resolve, reject) => setTimeout(() => resolve(true), ms)) }

class FastPromiseStream extends EventEmitter{
    constructor(options = {
        windowSize : 100,
        windowInterval : 0
    }){
        super();

        const { windowSize, retryTolerance } = options;

        this.buffer = [];
        this.windowSize = windowSize;
    }

    load(request){
        if(request instanceof Array){
            const validation = request.map(item => item instanceof Function);
            if(!validation) throw new Error(`[FaseRequest]\tLoadRequestFail\trequest should be exist and be a function`);

            this.buffer = this.buffer.concat(request);
        }
        else{
            if(!request || !request instanceof Function) throw new Error(`[FaseRequest]\tLoadRequestFail\trequest should be exist and be a function`);
            this.buffer.push(request);
        }
    }

    async run(){
        const jobs = [];

        while(this.buffer.length > 0 ){//slice jobs by window size.
            const job = this.buffer.splice(0, this.windowSize);
            jobs.push(job);
        }

        function runner(jobWindow){//the function would returns promise of a job window.
            return new Promise(async (resolve, reject) => {
                try{
                    const promises = await Promise.all(jobWindow.map(job => job()));
                    resolve(promises);
                }
                catch(e){
                    reject(e);
                }
            })
        }

        while(jobs.length > 0){//serialize jobs with window size.
            try{
                const jobWindow = jobs.shift();
                const response = await runner(jobWindow);
                this.emit('resolve', response);
                await sleep(this.windowInterval);
            }
            catch(e){
                this.emit(e);
            }
        }
        
        this.emit('done');
        this.removeAllListeners();
    }
}

module.exports = FastPromiseStream;