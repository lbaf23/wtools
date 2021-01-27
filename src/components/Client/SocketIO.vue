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
            <div class="col-3">
                <q-input :disable="websocketStatus===2 || websocketStatus===1" v-model="domain" label="ip address"/>
            </div>
            <div class="col-1">
                <q-input :disable="websocketStatus===2 || websocketStatus===1" v-model="port" label="port" prefix=":" />
            </div>
            <div class="col-3">
                <q-input :disable="websocketStatus===2 || websocketStatus===1" v-model="nameSpace" label="namespace" prefix="/" />
            </div>
            <div style="margin-top: 20px">
                <q-btn :color="connectButtonColor[websocketStatus]" :disable="conAbleClick[websocketStatus]" text-color="black" label="连接" style="margin-left: 20px" @click="connectWebsocket()" />
                <q-btn color="red" :disable="disconAbleClick[websocketStatus]" text-color="black" label="断开" style="margin-left: 20px" @click="closeSocketIO()" />
            </div>
        </div>
        <div class="row" style="margin-top: 20px">
            <!--
            <div class="col-1">
                <q-circular-progress :indeterminate="sendMessageStatus===1" size="30px" color="blue" class="q-ma-md" />
            </div>
            -->
            <div class="col-3">
                <q-list bordered separator>
                    <q-item v-for="(item,i) in eventList" :key="i">
                        <q-item-section>{{item}}</q-item-section>
                    </q-item>

                    <q-item>
                        <q-input v-model="messageEvent" label="add event" />
                    </q-item>
                </q-list>


            </div>
            <div>
                <q-list>
                    <q-item v-for="(item, i) in eventList" :key="i">
                        <q-item-section><q-btn round color="primary" icon="minus" size="sm" @click="removeEventItem(i)" /></q-item-section>
                    </q-item>


                    <q-item style="margin-top: 10px">
                        <q-item-section><q-btn round color="green" icon="add" size="sm" @click="addEventItem" /></q-item-section>
                    </q-item>
                </q-list>

            </div>
            <div class="col" >
                <div>
                    <div class="row">
                        <div class="col-4">
                            <q-input v-if="sendType==='EMIT'" v-model="sendEvent" label="send event" />
                        </div>
                        <div class="col" style="margin-top: 20px; margin-left: 10px">
                            <q-btn-dropdown split class="glossy" color="white"
                                    text-color="black" :label="sendType" @click="clickSocketMessage">
                                <q-list>
                                    <q-item clickable v-close-popup @click="onMessageItemClick('EMIT')">
                                        <q-item-section>
                                            <q-item-label>EMIT</q-item-label>
                                        </q-item-section>
                                    </q-item>

                                    <q-item clickable v-close-popup @click="onMessageItemClick('SEND')">
                                        <q-item-section>
                                            <q-item-label>SEND</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>

                            <q-btn-dropdown color="primary" :label="typeLabel" style="margin-left: 20px">
                                <q-list>
                                    <q-item clickable v-close-popup @click="onItemClick('STRING')">
                                        <q-item-section>
                                            <q-item-label>STRING</q-item-label>
                                        </q-item-section>
                                    </q-item>

                                    <q-item clickable v-close-popup @click="onItemClick('JSON')">
                                        <q-item-section>
                                            <q-item-label>JSON</q-item-label>
                                        </q-item-section>
                                    </q-item>

                                    <q-item clickable v-close-popup @click="onItemClick('STRING')">
                                        <q-item-section>
                                            <q-item-label>Articles</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                        </div>
                    </div>
                </div>

                <q-input v-if="typeLabel==='STRING'" v-model="message"  label="message"/>
            </div>

        </div>
        <br/>
        <div>
            <q-card>
                <q-card-section style="overflow-x: hidden; max-height: 400px" id="box">
                        <div v-for="(item, i) in messageList" :key="i">
                            <q-chat-message :text="[item.data]" :sent="item.sent" :name="item.name" :stamp="'event:'+item.event" />
                        </div>
                        <br/>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script>
    import {io} from 'socket.io-client';

    export default {
        name: "SocketIO",
        data() {
            return {
                typeLabel: 'STRING',
                messageEvent: '',
                eventList: ['message', 'json'],
                sendEvent: '',
                sendType: 'EMIT',

                domain: '',
                port: '',
                nameSpace: '',
                socket: null,
                message: '',
                websocketStatus: 0, // 0 关闭 1 正在连接 2 连接成功 3 连接失败
                connectButtonColor: ['white', 'grey', 'green', 'white'],
                conAbleClick: [false, true, true, false],
                disconAbleClick: [true, false, false, true],
                messageList: [
                ],

                schema: {
                    type: 'object',
                    title: 'vue-json-editor demo',
                    properties: {
                        name: {
                            type: 'string',
                        },
                        email: {
                            type: 'string',
                        },
                    },
                }
            }
        },
        components:{
        },
        methods: {
            connectWebsocket() {
                if(this.domain === ''){
                    this.$q.notify({
                        type: 'negative',
                        message: '输入ip地址'
                    })
                }
                else {
                    this.websocketStatus = 1;
                    this.socket = io('ws://' + this.domain + ':' + this.port + '/' + this.nameSpace);

                    this.socket.on("connect", this.socketconnect);
                    this.socket.on("disconnect", this.socketdisconnect);
                    this.socket.on("connect_error", this.socketonerror);

                    for(let i=0; i<this.eventList.length; i++){
                        let e = this.eventList[i];
                        this.socket.on(e, (msg) => {
                            this.socketonmessage(msg, e);
                        })
                    }
                }
            },
            addEventItem(){
                if(this.eventList.indexOf(this.messageEvent) === -1) {
                    this.eventList.push(this.messageEvent);
                    if(this.socket!==null) {
                        let e = this.messageEvent;
                        this.socket.on(this.messageEvent, (msg) => {
                            this.socketonmessage(msg, e);
                        })
                    }
                }
                this.messageEvent = '';
            },
            removeEventItem(i){
                let e = this.eventList[i];
                this.socket.on(e, ()=>{});
                this.eventList.splice(i, 1);
            },
            onMessageItemClick(t){
                this.sendType = t;
            },
            clickSocketMessage(){
                if(this.sendType === 'EMIT'){
                    this.emitSocketMessage()
                }
                else{
                    this.sendSocketMessage()
                }
            },
            emitSocketMessage(){
                this.socket.emit(this.sendEvent, JSON.parse(this.message));
                this.messageList.push( {'data': this.message, 'sent': true, 'name': 'client', 'event': this.sendEvent});
                this.scrollToBottom();
            },
            sendSocketMessage(){
                this.socket.send(this.message);
                this.messageList.push( {'data': this.message, 'sent': true, 'name': 'client', 'event': 'message'});
                this.scrollToBottom();
            },

            socketonopen(){
                console.log('open')
            },
            socketconnect(){
                console.log('connect', this.socket);
                this.websocketStatus = 2;
                this.$q.notify({
                    type: 'positive',
                    message: '已连接'
                })
            },
            socketonmessage(msg, e){
                console.log('message', JSON.stringify(msg));
                this.messageList.push( {'data': JSON.stringify(msg), 'sent': false, 'name': 'server', 'event': e});
                this.scrollToBottom();
            },
            scrollToBottom(){
                setTimeout(()=>{
                    let box = document.getElementById('box');
                    box.scrollTop = box.scrollHeight
                }, 10)
            },
            socketclose(){
                console.log('close');
            },
            socketonerror(e){
                console.log('error', e);
                this.$q.notify({
                    type: 'negative',
                    message: '连接出错  ' + e
                })
            },
            socketdisconnect(reason){
                console.log('disconnect');
                this.$q.notify({
                    type: 'warning',
                    message: '已断开 : ' + reason
                })
            },

            closeSocketIO(){
                this.socket.close();
                this.websocketStatus = 0;
            },


            onItemClick(l){
                this.typeLabel = l;
            }
        },
        created() {
            window.addEventListener("beforeunload",()=>{
                localStorage.setItem('domain', this.domain);
                localStorage.setItem('port', this.port);
                localStorage.setItem('nameSpace', this.nameSpace);
            });

            let d = localStorage.getItem('domain');
            let p = localStorage.getItem('port');
            let n = localStorage.getItem('nameSpace');
            this.domain = d===null ? '':d;
            this.port = p===null ? '':p;
            this.nameSpace = n===null ? '':n;


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
