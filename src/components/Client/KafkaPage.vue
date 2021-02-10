<template>
    <div>
        <q-splitter id="clientPart" v-model="splitterModel">
            <template v-slot:before>

                <div class="row">
                    <div class="col-3">
                        <q-input :disable="kafkaStatus===2 || kafkaStatus===1" v-model="domain" label="ip address"/>
                    </div>
                    <div class="col-2">
                        <q-input :disable="kafkaStatus===2 || kafkaStatus===1" v-model="port" label="port" prefix=":" />
                    </div>
                    <div class="col-3">
                        <q-input :disable="kafkaStatus===2 || kafkaStatus===1" v-model="topic" label="topic" prefix="/" />
                    </div>
                    <div style="margin-top: 20px">
                        <q-btn :color="connectButtonColor[kafkaStatus]" text-color="black" :label="lb" style="margin-left: 20px" @click="clickBtn()" />
                    </div>
                    <q-spinner-hourglass v-if="kafkaStatus===1" color="purple" size="md" />
                </div>
                <br/>
            </template>
            <template v-slot:after>
                after
            </template>
        </q-splitter>
    </div>
</template>

<script>
    import axios from 'axios'
    export default {
        name: "KafkaPage",
        data() {
            return {
                kafka: null,

                splitterModel: 60,
                kafkaStatus: 0,  // 0 关闭 1 正在连接 2 连接成功 3 连接失败
                connectButtonColor: ['white', 'grey', 'red', 'white'],
                domain: 'localhost',
                port: '9092',
                topic: '',
                lb: '连接',

                producer: null,
                consumer: null,
                run: null
            }
        },
        methods: {
            clickBtn(){
                if(this.lb==='连接'){
                    this.lb = '断开';
                    this.connectKafka()
                }
                else{
                    this.lb = '连接';
                    this.closeKafka()
                }
            },
            connectKafka(){
                console.log(global.baseUrl);


                axios.get(global.baseUrl+'/socketio', {

                }).then((res)=>{
                    console.log(res);
                })

                // eslint-disable-next-line no-unused-vars
                // const { Kafka } = require('kafkajs');
                /*
                this.producer = this.kafka.producer();
                this.consumer = this.kafka.consumer({groupId: 'gid'});
                this.run = async () => {
                    await this.producer.connect();
                    await this.consumer.subscribe({ topic: 'test-topic', fromBeginning: true });
                    await this.consumer.run({
                        eachMessage: async ({ topic, partition, message }) => {
                            console.log({
                                topic,
                                partition,
                                offset: message.offset,
                                value: message.value.toString(),
                            })
                        },
                    })
                };
                //this.run.catch(console.error);*/
            },
            closeKafka(){
            }
        }
    }
</script>

<style scoped>

</style>
