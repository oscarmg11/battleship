<script setup lang='ts'>
import { translate } from '@/utils/text/translate'
import { onMounted, ref } from 'vue'
import { WebSocketEventListener } from '@/utils/event/WebSocketEventListener'
import Loader from '@/components/Loader.vue'
import Text from '@/components/Text.vue'
import { usePlayerStore } from '@/stores/usePlayerStore.js'

const rivalConnected = ref(false)
const hideLoader = ref(false)

const playerStore = usePlayerStore()

onMounted(() => {
    WebSocketEventListener.addEventListener('onRivalConnected', () => {
        rivalConnected.value = true
        setTimeout(() => hideLoader.value = true, 3000)
    })
})

</script>

<template>
    <div class='waitingForRivalContainer' v-if='playerStore.player.isHost'>
        <div :class='[{ rivalConnectedText: rivalConnected }, "rivalConnectedTextHidden"]' v-if='!hideLoader'>
            <Text >{{ translate('Rival connected') }}</Text>
        </div>
        <Loader :size='20' :text="translate('Waiting for rival')"  v-if='!rivalConnected && !hideLoader'  />
    </div>
    <div class='waitingForRivalContainer' v-if='!playerStore.player.isHost'>
        <div class='rivalConnectedText'>
            <Text >{{ translate('Joined to battle') }}</Text>
        </div>
    </div>
</template>

<style scoped>
    .waitingForRivalContainer {
        position: relative;
        text-align: center;
        max-height: 30px;
        height: 30px;
        overflow: hidden;
    }

    .rivalConnectedTextHidden {
        margin-top: -30px;
        transition: margin-top 0.2s ease;
    }

    .rivalConnectedText {
        margin-top: 0;
        animation: hide ease 0.2s forwards;
        animation-delay: 2s;
    }

    @keyframes hide {
        from {
            margin-top: 0;
        }
        to {
            margin-top: 30px;
        }
    }

</style>

