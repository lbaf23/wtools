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

                <div class="row" style="margin-top: 20px">
                    <div class="col" style="margin-right: 20px" >
                        <q-chip size="sm" icon="bookmark">
                            参数
                        </q-chip>
                        <div class="col-3">
                            <q-scroll-area style="height: 400px;" :thumb-style="thumbStyle" :content-style="contentStyle" :content-active-style="contentActiveStyle" ref="scrollArea">
                                    <q-item >
                                        <q-item-section>
                                            <q-btn-dropdown v-if="btnDropdown" :label="argType" size="sm">
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
                                            <q-input style="margin-top: 5px" outlined v-model="arg" />
                                        </q-item-section>

                                    </q-item>

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
                        <div class="col" style="margin-top: 20px; margin-left: 20px">
                            <q-btn class="glossy" color="white" :disable="websocketStatus!==2"
                                            text-color="black" label="SEND" @click="sendWebsocketMessage">
                            </q-btn>
                        </div>
                    </div>
                    <br/>
                    <q-card>
                        <q-scroll-area style="height: 340px;" :thumb-style="thumbStyle" ref="scrollArea">
                            <q-card-section id="box">
                                <div v-for="(item, i) in messageList" :key="i">
                                    <q-chat-message :text="[item.data]" :sent="item.sent" :name="item.name"/><!-- :stamp="'event:'+item.event" />-->
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
    export default {
        name: "Websocket",
        data(){
            return {
                wsLabel: 'ws',
                messageEvent: '',
                eventList: ['message', 'json'], // 接收的事件列表
                sendEvent: '',
                sendType: 'EMIT',

                domain: 'localhost',
                port: '5000',
                nameSpace: '',
                websock: null,
                message: '',
                websocketStatus: 0, // 0 关闭 1 正在连接 2 连接成功 3 连接失败
                lb: '连接',
                connectButtonColor: ['white', 'grey', 'red', 'white'],
                messageList: [], // 收发消息列表

                arg: '', // 传递参数
                argType: 'STRING',

                thumbStyle: {
                    right: '4px',
                    borderRadius: '5px',
                    backgroundColor: '#027be3',
                    width: '5px',
                    //opacity: 0.75
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
        methods: {
            clickBtn(){
                if(this.lb==='连接'){
                    this.lb = '断开';
                    this.initWebSocket()
                }
                else{
                    this.lb = '连接';
                    this.closeWebsocket()
                }
            },
            initWebSocket(){ //初始化weosocket
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
                    let wsuri = this.wsLabel + "://" + this.domain + ":"+this.port + "/" + this.nameSpace;
                    console.log(wsuri);
                    this.websock = new WebSocket(wsuri);
                    this.websock.onmessage = this.websocketonmessage;
                    this.websock.onopen = this.websocketonopen;
                    this.websock.onerror = this.websocketonerror;
                    this.websock.onclose = this.websocketclose;
                }
            },
            websocketonopen(e){
                console.log('connected', e);
                this.websocketStatus = 2;
                this.$q.notify({
                    type: 'positive',
                    message: '已连接'
                })
            },
            websocketonerror(e){//连接建立失败重连
                console.log('websocket连接出错', e);
                this.websocketStatus = 3;
                this.$q.notify({
                    type: 'negative',
                    message: '连接出错  ' + e.type
                });
            },
            websocketonmessage(response){ //数据接收
                this.messageList.push( {'data': response.data, 'sent': false, 'name': 'server'});
                console.log('websocket收到消息', response.data);
                this.scrollToBottom();
            },
            sendWebsocketMessage(){//数据发送
                this.websock.send(this.arg);
                let a = this.arg;
                if(this.argType === 'JSON')
                    a = JSON.stringify(a);
                this.messageList.push( {'data': a, 'sent': true, 'name': 'client'});
                this.scrollToBottom();
            },
            websocketclose(e){  //关闭
                console.log('websocket连接关闭');
                console.log(e);
                this.websocketStatus = 3;
                this.$q.notify({
                    type: 'warning',
                    message: '连接关闭 : ' + e.code
                });
                this.lb = '连接';
            },
            closeWebsocket(){
                this.websock.close()
            },
            clearMessages(){
                this.messageList = [];
            },
            scrollToBottom(){
                setTimeout(()=>{
                    this.$refs.scrollArea.setScrollPosition(document.getElementById('box').scrollHeight)
                }, 20)

                //document.getElementById('bot').scrollIntoView()
            },

            onItemClick(t){
                if(t==='STRING'){
                    this.argType = t;
                }
                else{
                    this.argType = t;
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
            localStorage.setItem('domainW', this.domain);
            localStorage.setItem('portW', this.port);
            localStorage.setItem('nameSpaceW', this.nameSpace);

            if(this.websock){
                this.websock.close();
            }
        }
    }
</script>

<style scoped>

</style>
