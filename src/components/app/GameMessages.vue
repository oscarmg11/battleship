<script setup lang='ts'>
import { useGameMessagesStore } from '@/stores/useGameMessagesStore'
import { ref, watch } from 'vue'
import GameMessage from '@/components/app/GameMessage.vue'

const gameMessagesStore = useGameMessagesStore()
const gameMessages = gameMessagesStore.gameMessages

const hideGameMessage = ref(false)

watch(gameMessagesStore.gameMessages, () => {
    hideGameMessage.value = false
})

const handleGameMessageFinished = () => {
    hideGameMessage.value = true
    setTimeout(() => gameMessagesStore.removeOldestMessage(), 200)
}

</script>

<template>
    <section class='gameMessagesContainer'>
        <GameMessage v-if='!!gameMessages[0] && !hideGameMessage' :game-message='gameMessages[0]' :has-next-message='!!gameMessages[1]' @onFinish='handleGameMessageFinished' />
    </section>
</template>

<style scoped>
.gameMessagesContainer {
    display: flex;
    flex-direction: column;
    height: 30px;
    position: relative;
    overflow: hidden;
    z-index: 100000;
}
</style>
