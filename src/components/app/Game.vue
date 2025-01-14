<script setup lang='ts'>
import GameMenu from '@/components/app/GameMenu.vue'
import GameHome from '@/components/app/GameHome.vue'
import { onMounted, ref } from 'vue'
import { WebSocketEventListener } from '@/utils/event/WebSocketEventListener'
import { useGameMessagesStore } from '@/stores/useGameMessagesStore'
import { translate } from '@/utils/text/translate'
import { useGameStore } from '@/stores/useGameStore'
import { SessionVm } from '@/types/SessionVm.js'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { createPlayerIdInLocalStorage } from '@/utils/localStorage/createPlayerIdInLocalStorage'

const gameInitialized = ref(false)

const gameStore = useGameStore()
const playerStore = usePlayerStore()
const gameMessagesStore = useGameMessagesStore()

onMounted(() => {
    const playerId = createPlayerIdInLocalStorage()
    playerStore.setPlayerId(playerId)

    WebSocketEventListener.addEventListener('onRivalConnected', async () => {
        gameStore.enable()
        await gameMessagesStore.showGameMessage({
            message: translate('Rival connected')
        })
        gameStore.setupGame()
    })

    WebSocketEventListener.addEventListener('onRivalDisconnected', () => {
        gameStore.disable()
        gameMessagesStore.showGameMessage({
            message: translate('Rival disconnected')
        })
        gameMessagesStore.showGameMessage({
            message: translate('Waiting for rival'),
            loader: true,
            lastUntilNewMessage: true
        })
    })

    WebSocketEventListener.addEventListener('onSessionInfo', (session: SessionVm) => {
        playerStore.setSession(session)
    })
})

const handleGameCreated = (data?: { isGameSettingUp: boolean }) => {
    gameInitialized.value = true
    if(data?.isGameSettingUp) {
        gameStore.enable()
        gameStore.setupGame()
    }
}

const handleJoinedToGame = async () => {
    gameStore.enable()
    gameInitialized.value = true
    await gameMessagesStore.showGameMessage({
        message: translate('Connected')
    })
    gameStore.setupGame()
}

</script>

<template>
    <GameMenu v-if='gameInitialized' />
    <GameHome v-if='!gameInitialized' @on-game-created='handleGameCreated' @on-joined-to-game='handleJoinedToGame' />
</template>
