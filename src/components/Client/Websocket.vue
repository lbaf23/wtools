<template>
    <div>
        <div class="row">

            <div class="col-1">
                <q-input :disable="websocketStatus===2 || websocketStatus===1" v-model="wsLabel" label="" />
            </div>
            <div class="col-3">
                <q-input :disable="websocketStatus===2 || websocketStatus===1" v-model="domain" label="ip address" prefix="://"/>
            </div>
            <div class="col-1">
                <q-input :disable="websocketStatus===2 || websocketStatus===1" v-model="port" label="port" prefix=":" />
            </div>
            <div class="col-3">
                <q-input :disable="websocketStatus===2 || websocketStatus===1" v-model="route" label="route" prefix="/" />
            </div>
            <div style="margin-top: 20px">
                <q-btn :color="connectButtonColor[websocketStatus]" :disable="conAbleClick[websocketStatus]" text-color="black" label="连接" style="margin-left: 20px" @click="initWebSocket()" />
                <q-btn color="red" :disable="disconAbleClick[websocketStatus]" text-color="black" label="断开" style="margin-left: 20px" @click="closeWebsocket()" />
            </div>
            <q-spinner-hourglass v-if="websocketStatus===1" color="purple" size="md"/>
        </div>

        <div class="row">
            <div class="col-1"></div>
            <div class="col-4">
                <q-input v-model="sendMessage"/>
            </div>
            <div class="col-1"></div>
            <div class="col">
                <q-btn color="white" :disable="websocketStatus!==2" text-color="black" label="send" style="margin-top: 20px" @click="sendWebsocketMessage()" />
            </div>
        </div>
        <br/>
        <div>
            <q-card>
                <q-scroll-area style="height: 300px;"
                               :thumb-style="thumbStyle"
                               ref="scrollArea">
                    <q-card-section id="box">
                        <div v-for="(item, i) in messageList" :key="i">
                            <q-chat-message :text="[item.data]" :sent="item.sent" :name="item.name" :stamp="'event:'+item.event" />
                        </div>
                    </q-card-section>
                </q-scroll-area>
            </q-card>
            <div style="margin-left: 500px; margin-top: 10px">
                <q-btn push round color="red" icon="delete" @click="clearMessages"  />
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Websocket",
        data(){
            return {
                wsLabel: 'ws',
                domain: '',
                port: '',
                route: '',
                messageList: [],
                websock: null,
                sendMessage: '',
                websocketStatus: 0, // 0 关闭 1 正在连接 2 连接成功 3 连接失败
                connectButtonColor: ['white', 'grey', 'green', 'white'],
                conAbleClick: [false, true, true, false],
                disconAbleClick: [true, false, false, true],
                thumbStyle: {
                    right: '4px',
                    borderRadius: '5px',
                    backgroundColor: '#027be3',
                    width: '5px',
                    opacity: 0.75
                },
                contentActiveStyle: {
                    backgroundColor: '#eee',
                    color: 'black'
                },
                contentStyle: {
                    backgroundColor: 'rgba(0,0,0,0.02)',
                    color: '#555'
                },
            }
        },
        methods: {
            initWebSocket(){ //初始化weosocket
                if(this.domain === ''){
                    this.$q.notify({
                        type: 'negative',
                        message: '输入ip地址'
                    })
                }
                else {
                    if(this.wsLabel==='')
                        this.wsLabel = 'ws';
                    this.websocketStatus = 1;
                    let wsuri = this.wsLabel + "://" + this.domain + ":"+this.port + "/" + this.route;
                    this.websock = new WebSocket(wsuri);
                    this.websock.onmessage = this.websocketonmessage;
                    this.websock.onopen = this.websocketonopen;
                    this.websock.onerror = this.websocketonerror;
                    this.websock.onclose = this.websocketclose;
                }
            },
            websocketonopen(){
                console.log('connected', this.socket);
                this.websocketStatus = 2;
                this.$q.notify({
                    type: 'positive',
                    message: '已连接'
                })
            },
            websocketonerror(e){//连接建立失败重连
                //this.initWebSocket();
                console.log('websocket连接出错', e);
                this.websocketStatus = 3;
                this.$q.notify({
                    type: 'negative',
                    message: '连接出错  ' + e.type
                })
            },
            websocketonmessage(response){ //数据接收
                this.messageList.push( {'data': response.data, 'sent': false, 'name': 'server'});
                console.log('websocket收到消息', response.data);
                this.scrollToBottom();
            },
            sendWebsocketMessage(){//数据发送
                this.websock.send(this.sendMessage);
                this.messageList.push( {'data': this.sendMessage, 'sent': true, 'name': 'client'});
                this.scrollToBottom();
            },
            websocketclose(e){  //关闭
                console.log('websocket连接关闭');
                console.log(e);
                this.websocketStatus = 3;
                this.$q.notify({
                    type: 'warning',
                    message: '连接关闭 : ' + e.code
                })
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
        },
        created() {
            window.addEventListener("beforeunload",()=>{
                localStorage.setItem('domainW', this.domain);
                localStorage.setItem('portW', this.port);
                localStorage.setItem('route', this.route);
            });
            let d = localStorage.getItem('domainW');
            let p = localStorage.getItem('portW');
            let n = localStorage.getItem('route');
            this.domain = d===null ? '':d;
            this.port = p===null ? '':p;
            this.route = n===null ? '':n;
        },
        destroyed() {
            localStorage.setItem('domainW', this.domain);
            localStorage.setItem('portW', this.port);
            localStorage.setItem('route', this.route);

            if(this.websock){
                this.websock.close();
            }
        }
    }
</script>

<style scoped>

</style>
