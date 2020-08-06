class Queue{
    constructor(arr=[]){
        this.size = 0;
        this.buffer = [];

        if(typeof(arr) == 'number'){
            this.buffer = Array.apply(null, Array(arr)).map(e => 0);
            this.size = arr;
        }
        else if(typeof(arr) == 'object' && arr instanceof Array){
            this.buffer = Array.from(arr);
            this.size = arr.length;
        }
        else if(typeof(arr) == 'string' && !isNaN(arr)){
            this.buffer = Array.apply(null, Array(Number(arr))).map(e => 0);
            this.size = Number(arr);
        }
        else if(arr){
            console.log(`[Queue]\tWarning\tQueueConstructorFailed\nQueue initialized with empty array.\nGiven parameter\n${arr}\nAllowed param : Array or number`);
        }
    }

    push(e){
        this.size = this.buffer.push(e);
        return this.size;
    }

    pop(){
        this.size = this.buffer.length-1 > 0 ? this.buffer.length-1 : this.buffer.size;
        return this.buffer.shift();
    }

    all(){ return Array.from(this.buffer); }

    popAll(){
        const ret = Array.from(this.buffer);
        this.buffer = [];
        this.size = 0;
        return ret;
    }
}

module.exports = Queue;