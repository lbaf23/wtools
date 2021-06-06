<template>
    <q-layout view="hHh LpR fFf">

      <q-header reveal elevated height="110">
        <q-toolbar style="background-color: whitesmoke">
          <q-btn dense flat round icon="menu" @click="left = !left" />

          <q-toolbar-title style="max-width: 80px">
            <q-avatar square>
              <img src="./assets/logo.png">
            </q-avatar>
          </q-toolbar-title>
          <q-toolbar-title style="max-width: 80px;margin-left: 80%">
            <a href="https://github.com/lbaf23/wtools" target="_blank"><i class="fab fa-github" style="font-size: 40px;color: #1D1D1D" ></i></a>
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

      </q-page-container>

    </q-layout>
</template>

<script>
import SocketIO from "./components/socket/SocketIO";
import Websocket from "./components/socket/Websocket";


export default {
  name: 'LayoutDefault',

  components: {
    Websocket,
    SocketIO
  },
  data () {
    return {
      tab: 'SocketIO',
      left: false,
    }
  },
  methods: {
  },
  created() {
  }


}
</script>

<style>

</style>
