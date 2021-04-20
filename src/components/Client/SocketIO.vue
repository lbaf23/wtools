<template>
    <div>
        <q-splitter id="clientPart" v-model="splitterModel">
            <template v-slot:before>

                <div class="row">
                    <div class="col-1">
                        <q-input :disable="websocketStatus===2 || websocketStatus===1" v-model="wsLabel" label="" />
                    </div>
                    <div class="col-3">
                        <q-input :disable="websocketStatus===2 || websocketStatus===1" v-model="domain" label="ip address" prefix="://"/>
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
                    <q-spinner-hourglass v-if="websocketStatus===1" color="purple" size="md" />
                </div>
                <br/>
                <div v-if="websocketStatus===2" class="row">
                    <q-chip color="green" text-color="white" icon="link">
                        id:&nbsp;&nbsp;{{socket.id}}
                    </q-chip>
                </div>


                <div class="row" style="margin-top: 20px">
                    <div class="col-4">
                        <q-chip size="sm" icon="bookmark">
                            事件
                        </q-chip>
                        <q-scroll-area style="height: 400px;" :thumb-style="thumbStyle" :content-style="contentStyle" :content-active-style="contentActiveStyle" ref="scrollArea" >
                            <q-list bordered separator>

                                <q-item v-for="(item,i) in eventList" :key="i">
                                    <q-item-section>
                                        {{item}}
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="removeEventItem(i)" />
                                    </q-item-section>
                                </q-item>

                                <q-item>
                                    <q-item-section>
                                        <q-input v-model="messageEvent" label="event" />
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-btn class="gt-xs" size="12px" dense round icon="add" @click="addEventItem" />
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-scroll-area>
                    </div>

                    <div class="col" style="margin-left: 20px; margin-right: 20px" >
                        <div class="col-3">
                            <q-chip size="sm" icon="bookmark">
                                参数
                            </q-chip>
                            <q-scroll-area style="height: 400px;" :thumb-style="thumbStyle" :content-style="contentStyle" :content-active-style="contentActiveStyle" ref="scrollArea">
                                <q-list bordered separator >
                                    <q-item v-for="(item,i) in argsList" :key="i">
                                        <q-item-section>
                                            <q-btn-dropdown v-if="btnDropdown" :label="argsType[i]" size="sm">
                                                <q-list>
                                                    <q-item clickable v-close-popup @click="onItemClick('STRING', i)">
                                                        <q-item-section>
                                                            <q-item-label>STRING</q-item-label>
                                                        </q-item-section>
                                                    </q-item>
                                                    <q-item clickable v-close-popup @click="onItemClick('JSON', i)">
                                                        <q-item-section>
                                                            <q-item-label>JSON</q-item-label>
                                                        </q-item-section>
                                                    </q-item>
                                                </q-list>
                                            </q-btn-dropdown>
                                            <q-input style="margin-top: 5px" outlined v-model="argsList[i]" />
                                        </q-item-section>
                                        <q-item-section side>
                                            <q-btn class="gt-xs" size="12px" flat dense round icon="delete" @click="removeArgsItem(i)" />
                                        </q-item-section>

                                    </q-item>
                                </q-list>
                                <q-btn class="gt-xs" size="12px" dense round icon="add" @click="addArgsItem" style="margin: 10px; float: right" />
                            </q-scroll-area>

                        </div>
                        <br/>
                    </div>
                </div>
            </template>

            <template v-slot:after>
                <q-chip size="sm" icon="bookmark">
                    消息
                </q-chip>
                <div class="q-pa-md">
                    <div class="row">
                        <div class="col">
                            <q-input v-if="sendType==='EMIT'" v-model="sendEvent" label="event" />
                        </div>
                        <div class="col" style="margin-top: 20px; margin-left: 20px">
                            <q-btn-dropdown split class="glossy" color="white" :disable-main-btn="websocketStatus!==2"
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
                        </div>
                    </div>
                    <br/>
                    <q-card>
                        <q-scroll-area style="height: 340px;" :thumb-style="thumbStyle" ref="scrollArea">
                            <q-card-section id="box">
                                <div v-for="(item, i) in messageList" :key="i">
                                    <q-chat-message :text="[item.data]" :sent="item.sent" :name="item.name" :stamp="'event:'+item.event" />
                                </div>
                            </q-card-section>
                        </q-scroll-area>
                    </q-card>
                    <div style="margin-top: 10px">
                        <q-btn push round color="red" icon="delete" @click="clearMessages"  />
                    </div>
                </div>

            </template>
        </q-splitter>
    </div>
</template>

<script>
    import {io} from 'socket.io-client';

    export default {
        name: "SocketIO",
        data() {
            return {
                wsLabel: 'ws',
                messageEvent: '',
                eventList: ['message', 'json'], // 接收的事件列表
                sendEvent: '',
                sendType: 'EMIT',

                domain: 'localhost',
                port: '5000',
                nameSpace: '',
                socket: null,
                message: '',
                websocketStatus: 0, // 0 关闭 1 正在连接 2 连接成功 3 连接失败
                lb: '连接',
                connectButtonColor: ['white', 'grey', 'red', 'white'],
                messageList: [], // 收发消息列表

                argsList: [''], // 传递参数列表
                argsType: ['STRING'],

                thumbStyle: {
                    right: '4px',
                    borderRadius: '5px',
                    backgroundColor: '#027be3',
                    width: '5px',
                },
                contentActiveStyle: {
                    backgroundColor: '#eee',
                    color: 'black'
                },
                contentStyle: {
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    color: '#555'
                },
                splitterModel: 60,
                btnDropdown: true
            }
        },
        components:{
        },
        methods: {
            clickBtn(){
                if(this.lb==='连接'){
                    this.lb = '断开';
                    this.connectSocketIO()
                }
                else{
                    this.lb = '连接';
                    this.closeSocketIO()
                }
            },
            connectSocketIO() {
                if(this.domain === ''){
                    this.$q.notify({
                        type: 'negative',
                        message: '输入ip地址'
                    });
                    this.lb = '连接';
                }
                else {
                    if(this.wsLabel==='')
                        this.wsLabel = 'ws';
                    this.websocketStatus = 1;
                    this.socket = io(this.wsLabel+'://' + this.domain + ':' + this.port + '/' + this.nameSpace);

                    this.socket.on("connect", this.socketconnect);
                    this.socket.on("disconnect", this.socketdisconnect);
                    this.socket.on("connect_error", this.socketonerror);

                    for(let i=0; i<this.eventList.length; i++){
                        let e = this.eventList[i];
                        this.socket.on(e, (...msg) => {
                            this.socketonmessage(e, msg);
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
                // eslint-disable-next-line no-unused-vars
                let e = this.eventList[i];
                this.eventList.splice(i, 1);
            },
            // 参数列表
            addArgsItem(){
                this.argsList.push('');
                this.argsType.push('STRING');
            },
            removeArgsItem(i){
                this.argsList.splice(i, 1);
                this.argsType.splice(i, 1);
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
                let l = this.argsList;
                if(this.argsList.length === 1){
                    l = this.argsList[0];
                    this.socket.emit(this.sendEvent, this.argsList[0]);
                }
                else{
                    this.socket.emit(this.sendEvent, ...this.argsList);
                }
                this.messageList.push({'data': l, 'sent': true, 'name': 'client', 'event': this.sendEvent});
                this.scrollToBottom();
            },
            sendSocketMessage(){
                let l = this.argsList;
                if(this.argsList.length === 1){
                    l = this.argsList[0];
                    this.socket.send(this.argsList[0]);
                }
                else {
                    this.socket.send(...this.argsList);
                }
                this.messageList.push( {'data': l, 'sent': true, 'name': 'client', 'event': 'message'});
                this.scrollToBottom();
            },
            clearMessages(){
                this.messageList = [];
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
            socketonmessage(e, msg){
                let l = msg.length;
                let m;
                if(l === 1) {
                    console.log(msg[0]);
                    if(typeof msg[0] === 'object'){
                        m = JSON.stringify(msg);
                        let len = m.length;
                        m = m.substring(1, len-1)
                    }
                    else{
                        m = msg[0];
                    }
                }
                else if(l > 1){
                    if(typeof msg[0] === 'object'){
                        m = JSON.stringify(msg);
                        let len = m.length;
                        m = m.substring(1, len-1)
                    }
                    else{
                        m = msg;
                    }
                }
                console.log(m);
                this.messageList.push( {'data': m, 'sent': false, 'name': 'server', 'event': e});
                this.scrollToBottom();
            },
            scrollToBottom(){
                setTimeout(()=>{
                    this.$refs.scrollArea.setScrollPosition(document.getElementById('box').scrollHeight)
                }, 20)
            },
            socketonerror(e){
                console.log('error', e);
                this.$q.notify({
                    type: 'negative',
                    message: '连接出错  ' + e
                });
            },
            socketdisconnect(reason){
                console.log('disconnect');
                this.$q.notify({
                    type: 'warning',
                    message: '已断开 : ' + reason
                });
                this.lb = '连接';
                this.websocketStatus = 0;
                if(this.socket)
                    this.socket.close();
            },

            closeSocketIO(){
                this.socket.close();
                this.websocketStatus = 0;
            },
            messageData(d){
                if(typeof d === 'object'){
                    return d;
                }
                else{
                    return [d];
                }
            },
            // 参数类型
            onItemClick(t, i){
                if(t==='STRING'){
                    this.argsType[i] = t;
                }
                else{
                    this.argsType[i] = t;
                }
                this.freshBtnDropdown()
            },
            freshBtnDropdown(){
                this.btnDropdown = false;
                this.$nextTick(()=>{
                    this.btnDropdown = true;
                })
            }
        },
        created() {



        },
        destroyed() {
            localStorage.setItem('domain', this.domain);
            localStorage.setItem('port', this.port);
            localStorage.setItem('nameSpace', this.nameSpace);
            if(this.socket){
                this.socket.close();
            }
        }
    }
</script>

<style scoped>

</style>
