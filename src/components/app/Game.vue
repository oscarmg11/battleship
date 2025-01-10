<script setup>
import GameMenu from '@/components/app/GameMenu.vue'
import GameHome from '@/components/app/GameHome.vue'
import { onMounted, ref } from 'vue'
import { WebSocketEventListener } from '@/utils/event/WebSocketEventListener'
import { useGameMessagesStore } from '@/stores/useGameMessagesStore'
import { translate } from '@/utils/text/translate'

const gameInitialized = ref(false)

const gameMessagesStore = useGameMessagesStore()

onMounted(() => {
    WebSocketEventListener.addEventListener('onRivalConnected', () => {
        gameMessagesStore.showGameMessage({
            message: translate('Rival connected')
        })
    })

    WebSocketEventListener.addEventListener('onRivalDisconnected', () => {
        gameMessagesStore.showGameMessage({
            message: translate('Rival disconnected')
        })
        gameMessagesStore.showGameMessage({
            message: translate('Waiting for rival'),
            loader: true,
            lastUntilNewMessage: true
        })
    })
})

const handleGameCreated = () => {
    gameInitialized.value = true
}

</script>

<template>
    <GameMenu v-if='gameInitialized' />
    <GameHome v-if='!gameInitialized' @onGameCreated='handleGameCreated' />
</template>
