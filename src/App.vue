<template>
    <q-layout view="hHh LpR fFf">

      <q-header reveal elevated height="110">
        <q-toolbar>
          <q-btn dense flat round icon="menu" @click="left = !left" />

          <q-toolbar-title style="max-width: 80px">
            <q-avatar>
              <img src="./assets/logo.png">
            </q-avatar>
          </q-toolbar-title>
        </q-toolbar>


      </q-header>

      <q-page-container>
        <q-splitter id="clientPart" v-model="splitterModel">
          <template v-slot:before>
            <div class="q-pa-md" style="overflow-y: auto">
              <div class="text-h4 q-mb-md">Client</div>

              <div class="q-gutter-y-md">
                <q-card>
                  <q-tabs v-model="tab" dense
                          class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator >
                    <q-tab name="Websocket" label="Websocket" />
                    <q-tab name="SocketIO" label="SocketIO" />
                  </q-tabs>

                  <q-separator />

                  <q-tab-panels v-model="tab" animated>
                    <q-tab-panel name="Websocket">
                      <Websocket/>
                    </q-tab-panel>

                    <q-tab-panel name="SocketIO">
                      <SocketIO/>
                    </q-tab-panel>

                  </q-tab-panels>
                </q-card>
              </div>
            </div>
            <br/>
          </template>

          <template v-slot:after>
            <div class="q-pa-md">
              <div class="text-h4 q-mb-md">Server</div>

              <div class="q-gutter-y-md">
                <q-card>
                  <q-tabs v-model="serverTab" dense
                          class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator >
                    <q-tab name="WebsocketServer" label="Websocket" />
                    <q-tab name="SocketIOServer" label="SocketIO" />
                  </q-tabs>

                  <q-separator />

                  <q-tab-panels v-model="serverTab" animated>
                    <q-tab-panel name="WebsocketServer">
                      <div class="text-h6">Websocket</div>
                      <WebsocketServer/>
                    </q-tab-panel>

                    <q-tab-panel name="SocketIOServer">
                      <div class="text-h6">SocketIO</div>
                      <SocketIOServer/>
                    </q-tab-panel>

                  </q-tab-panels>
                </q-card>
              </div>
            </div>
            <br/>
          </template>

        </q-splitter>

      </q-page-container>

    </q-layout>
</template>

<script>
import SocketIO from "./components/Client/SocketIO";
import Websocket from "./components/Client/Websocket";
import SocketIOServer from "./components/Server/SocketIO";
import WebsocketServer from "./components/Server/Websocket";

export default {
  name: 'LayoutDefault',

  components: {
    Websocket,
    SocketIO,
    WebsocketServer,
    SocketIOServer
  },
  data () {
    return {
      splitterModel: 60,
      tab: 'SocketIO',
      serverTab: 'WebsocketServer',
      wheight: document.documentElement.clientHeight
    }
  },
  methods: {

  },


}
</script>

<style>

</style>
