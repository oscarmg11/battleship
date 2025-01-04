<script setup>
import GameMenu from '@/components/app/GameMenu.vue'
import GameHome from '@/components/app/GameHome.vue'
import { ref } from 'vue'

const gameInitialized = ref(false)

const handleGameCreated = () => {
    gameInitialized.value = true
}

</script>

<template>
    <GameMenu v-if='gameInitialized' />
    <GameHome v-if='!gameInitialized' @onGameCreated='handleGameCreated' />
</template>
