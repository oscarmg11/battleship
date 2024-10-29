
<script setup lang='js'>
import { useNotificationsStore } from '@/stores/useNotificationsStore.ts'
import Notification from '@/components/Notification.vue'

const store = useNotificationsStore()

</script>

<template>
    <div class='notificationsContainer' v-if='!!store.notifications.length'>
        <Notification v-for="notification in store.notifications" :key="notification.message"  :notification='notification' />
    </div>
</template>

<style scoped>
    .notificationsContainer {
        display: flex;
        flex-direction: column;
        gap: 10px;
        position: absolute;
        bottom: 5vh;
        right: 5vw;
        z-index: 10;
        max-height: 50vh;
        width: 30vw;
    }


</style>
