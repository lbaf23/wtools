<template>
    <div>
        <div class="row">
            <div class="col-1">
                <q-circular-progress
                        :indeterminate="websocketStatus===1"
                        size="30px"
                        color="blue"
                        class="q-ma-md"
                />
            </div>
            <div class="col">
                <q-input v-model="urlTextServer" type="url" prefix="ws://" style="font-size: medium; font-family: 'Times New Roman',serif"/>
            </div>
            <div class="col-1"></div>
            <div class="col">
                <q-btn :color="connectButtonColor[websocketStatus]" :disable="conAbleClick[websocketStatus]" text-color="black" label="connect" style="margin-top: 20px" @click="connectWebsocket()" />
                <q-btn color="red" :disable="disconAbleClick[websocketStatus]" text-color="black" label="disconnect" style="margin-top: 20px; margin-left: 20px" @click="closeSocketIO()" />
            </div>
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
    import { Server } from 'socket.io'
    import {createServer } from 'http';

    export default {
        name: "SocketIO",
        data() {
            return {
                urlTextServer: '',
                socket: null,
                httpServer: null,
                message: '',
                websocketStatus: 0, // 0 关闭 1 正在连接 2 连接成功 3 连接失败
                connectButtonColor: ['white', 'grey', 'green', 'white'],
                conAbleClick: [false, true, true, false],
                disconAbleClick: [true, true, false, true]
            }
        },
        methods: {
            connectWebsocket() {
                this.websocketStatus = 1;

                this.httpServer = createServer();
                this.socket = new Server(this.httpServer, {

                });
                this.httpServer.listen(5000);

                this.websocketStatus = 2;

                this.socket.onopen = this.socketonopen;
                this.socket.onmessage = this.socketonmessage;
                this.socket.onconnect = this.socketconnect;
                this.socket.onerror = this.socketonerror;
                this.socket.onclose = this.socketclose;
                this.socket.ondisconnect = this.socketdisconnect;

                this.socket.on('message', (msg) => {
                    console.log('message:', msg);
                })
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
            socketonerror(){
                console.log('error');
            },
            socketdisconnect(){
                console.log('disconnect');
            },

            closeSocketIO(){
                this.socket.close();
                console.log(this.socket.id);
                this.websocketStatus = 0;
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
