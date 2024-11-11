<script setup>
import GameMenu from '@/components/app/GameMenu.vue'
import { ref } from 'vue'
import GameStart from '@/components/app/GameStart.vue'

const gameInitialized = ref(false)

const handleGameCreated = () => {
    gameInitialized.value = true
}

</script>

<template>
    <GameMenu v-if='gameInitialized' />
    <GameStart v-if='!gameInitialized' @onGameCreated='handleGameCreated' />
</template>
