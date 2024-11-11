<script setup lang="ts">
import Notifications from '@/components/Notifications.vue'
import '@/webSocket/WebSocket.ts'
import Game from '@/components/app/Game.vue'

</script>

<template>
    <Game />
    <Notifications />
</template>
