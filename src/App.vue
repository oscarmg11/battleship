<script setup lang="ts">
import { onMounted } from 'vue'
import Menu from '@/components/app/Menu.vue'
import Notifications from '@/components/Notifications.vue'
import '@/utils/websocket/WebSocket.ts'

onMounted(() => {

})

</script>

<template>
    <Menu />
    <Notifications />
</template>
