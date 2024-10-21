<script setup lang='ts'>
import Button from '@/components/Button.vue'
import { camera } from '@/game/Camera.ts'
import { game } from '@/game/Game.ts'

const setupShips = () => {
    game.setupGame()
}

</script>

<template>
    <nav class="nav">
        <Button @click='setupShips'>Setup ships</Button>
    </nav>
</template>

<style scoped>
.nav {
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: absolute;
    right: 10vw;
    top: 10vh;
}
</style>
