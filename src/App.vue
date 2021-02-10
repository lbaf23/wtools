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
            <div class="q-pa-md" style="overflow-y: auto">
                <q-card>
                  <q-tabs v-model="tab" dense
                          class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator >
                    <q-tab name="Websocket" label="Websocket" />
                    <q-tab name="SocketIO" label="SocketIO" />
                    <q-tab name="KafkaPage" label="KafkaPage" />
                  </q-tabs>

                  <q-separator />

                  <q-tab-panels v-model="tab" animated>
                    <q-tab-panel name="Websocket">
                      <Websocket/>
                    </q-tab-panel>

                    <q-tab-panel name="SocketIO">
                      <SocketIO/>
                    </q-tab-panel>

                    <q-tab-panel name="KafkaPage">
                      <KafkaPage/>
                    </q-tab-panel>

                  </q-tab-panels>
                </q-card>

            </div>

      </q-page-container>

    </q-layout>
</template>

<script>
import SocketIO from "./components/Client/SocketIO";
import Websocket from "./components/Client/Websocket";
import KafkaPage from "./components/Client/KafkaPage";

export default {
  name: 'LayoutDefault',

  components: {
    Websocket,
    SocketIO,
    KafkaPage
  },
  data () {
    return {
      tab: 'SocketIO',
      wheight: document.documentElement.clientHeight
    }
  },
  methods: {

  },


}
</script>

<style>

</style>
