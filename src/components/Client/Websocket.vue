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
                <q-input v-model="urlTextWeb" type="url" prefix="ws://" style="font-size: medium; font-family: 'Times New Roman',serif"/>
            </div>
            <div class="col-1"></div>
            <div class="col">
                <q-btn :color="connectButtonColor[websocketStatus]" :disable="conAbleClick[websocketStatus]" text-color="black" label="connect" style="margin-top: 20px" @click="initWebSocket()" />
                <q-btn color="red" :disable="disconAbleClick[websocketStatus]" text-color="black" label="disconnect" style="margin-top: 20px; margin-left: 20px" @click="websocketclose()" />
            </div>
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
    </div>
</template>

<script>
    export default {
        name: "Websocket",
        data(){
            return {
                urlTextWeb: '',
                websock: null,
                sendMessage: '',
                websocketStatus: 0, // 0 关闭 1 正在连接 2 连接成功 3 连接失败
                connectButtonColor: ['white', 'grey', 'green', 'white'],
                conAbleClick: [false, true, true, false],
                disconAbleClick: [true, true, false, true]
            }
        },
        methods: {
            initWebSocket(){ //初始化weosocket
                this.websocketStatus = 1;
                const wsuri = "ws://" + this.urlTextWeb;
                this.websock = new WebSocket(wsuri);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen(){ //连接建立之后执行send方法发送数据
                this.websocketStatus = 2;
                console.log("websocket连接成功")
                //let actions = {"test":"12345"};
                //this.sendWebsocketMessage(JSON.stringify(actions));
            },
            websocketonerror(){//连接建立失败重连
                //this.initWebSocket();
                console.log('websocket连接失败');
                this.websocketStatus = 3;
            },
            websocketonmessage(e){ //数据接收
                let response = JSON.parse(e.data);
                console.log('websocket收到消息', response)
            },
            sendWebsocketMessage(){//数据发送
                this.websock.send(this.sendMessage);
            },
            websocketclose(e){  //关闭
                console.log('websocket连接关闭');
                console.log(e);
                this.websocketStatus = 3;
                this.websock.close()
            },
        },
        created() {
            window.addEventListener("beforeunload",()=>{
                localStorage.setItem('urlTextWeb', this.urlTextWeb);
            });
            let t = localStorage.getItem('urlTextWeb');
            if(t===null) {
                this.urlTextWeb = '';
            }
            else{
                this.urlTextWeb = t;
            }
        },
        destroyed() {
            if(this.websock){
                this.websock.close();
            }
        }
    }
</script>

<style scoped>

</style>
