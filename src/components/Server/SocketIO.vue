<template>
    <div>
        <div class="row">

            <div class="col-3">
                <q-input :disable="websocketStatus===2 || websocketStatus===1" v-model="domain" label="ip address"/>
            </div>
            <div class="col-2">
                <q-input :disable="websocketStatus===2 || websocketStatus===1" v-model="port" label="port" prefix=":" />
            </div>
            <div class="col-3">
                <q-input :disable="websocketStatus===2 || websocketStatus===1" v-model="nameSpace" label="namespace" prefix="/" />
            </div>
            <div style="margin-top: 20px">
                <q-btn :color="connectButtonColor[websocketStatus]" text-color="black" :label="lb" style="margin-left: 20px" @click="clickBtn()" />
            </div>
            <q-spinner-hourglass
                    v-if="websocketStatus===1"
                    color="purple"
                    size="md"
            />
        </div>

        <div class="row">
            <div class="col-1"></div>
            <div class="col-4">
                <q-input v-model="message"/>
            </div>
            <div class="col-1"></div>
            <div class="col">
                <q-btn color="white" :disable="websocketStatus!==2" text-color="black" label="send" style="margin-top: 20px" @click="sendSocketMessage()" />
            </div>
        </div>
    </div>
</template>

<script>
    import io from 'socket.io';
    //import Server from 'worker-loader!./express_server'
    export default {
        name: "SocketIO",
        data() {
            return {
                worker: null,
                socket: null,
                httpServer: null,
                port: '5000',
                domain: 'localhost',
                nameSpace: '',
                message: '',
                websocketStatus: 0, // 0 关闭 1 正在连接 2 连接成功 3 连接失败
                connectButtonColor: ['white', 'grey', 'red', 'white'],
                lb: '监听'
            }
        },
        methods: {
            clickBtn(){
                if(this.lb === '监听'){
                    this.lb = '断开';
                    this.startSocketIO()
                }
                else{
                    this.lb = '监听';
                    this.closeSocketIO()
                }
            },
            startSocketIO() {
                this.websocketStatus = 1;


                let sk = io(5000, {
                    cors: {
                        origin: '*'
                    }
                });

                sk.on('connection', function () {
                    console.log('connected');
                });

/*
                io.on('connection', function () {
                    console.log('connected');
                });

                this.worker = new Server();
                this.worker.postMessage('hello');

                this.worker.onmessage = function (e) {
                    console.log(e.data);
                };

*/
                this.websocketStatus = 2;


                //this.socket.on("connection", this.socketconnect);
                //this.socket.on("disconnect", this.socketdisconnect);
                //this.socket.on("connect_error", this.socketonerror);

            },
            sendSocketMessage(){
                //this.socket.send('test', this.message);
                this.socket.send('test', this.message);
            },

            socketonopen(){
                console.log('open')
            },
            socketconnect(){
                console.log('connect');
                console.log(this.socket.id);
            },
            socketonmessage(){
                console.log('message');
            },
            socketclose(){
                console.log('close');
            },
            socketonerror(e){
                console.log('error', e);
            },
            socketdisconnect(){
                console.log('disconnect');
            },

            closeSocketIO(){
                this.websocketStatus = 0;
                this.worker.terminate();
            }

        },
        created() {
            window.addEventListener("beforeunload",()=>{
                localStorage.setItem('urlTextServer', this.urlTextServer);
            });

            let t = localStorage.getItem('urlTextServer');
            if(t===null) {
                this.urlTextServer = '';
            }
            else{
                this.urlTextServer = t;
            }
        },
        beforeCreate() {
            if(this.socket){
                this.socket.close();
            }
        }
    }
</script>

<style scoped>

</style>
