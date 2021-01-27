<template>
    <div>
        <q-page-sticky :offset="fabPos">
            <q-fab color="accent" glossy icon="keyboard_arrow_up" padding="sm" label="选择" direction="up" :disable="draggingFab" v-touch-pan.prevent.mouse="moveFab">
                <q-fab-action color="amber" text-color="black" @click="onClick" icon="mail" square external-label label="Email"  :disable="draggingFab"/>
                <q-fab-action color="amber" text-color="black" @click="onClick" icon="alarm" square external-label label="Email"  :disable="draggingFab"/>
            </q-fab>
        </q-page-sticky>
    </div>
</template>

<script>
    export default {
        name: "DirectButton",
        data() {
            return {
                draggingFab: false,
                fabPos: [ 18, 18 ],
            }
        },
        methods: {
            moveFab (ev) {
                this.draggingFab = ev.isFirst !== true && ev.isFinal !== true;

                this.fabPos = [
                    this.fabPos[0] - ev.delta.x,
                    this.fabPos[1] - ev.delta.y
                ]
            }
        }
    }
</script>

<style scoped>

</style>
