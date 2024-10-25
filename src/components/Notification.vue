<script setup lang='ts'>
import { onMounted, ref } from 'vue'
import { Notification } from '@/types/Notification.ts'
import Text from '@/components/Text.vue'
import { useNotificationsStore } from '@/stores/useNotificationsStore.ts'

const store = useNotificationsStore()

const props = defineProps<{ notification: Notification }>()

const notificationHasFinished = ref(false)
const notificationHasToGo = ref(false)

onMounted(() => {
    setTimeout(() => {
        notificationHasFinished.value = true
        setTimeout(() => {
            notificationHasToGo.value = true
            setTimeout(() => {
                store.removeNotification(props.notification)
            }, 500)
        }, 3000)
    }, 1100)
})

</script>

<template>
    <div class='notificationPlaceholder' v-if='!notificationHasFinished'></div>
    <div class='notification' :class='{ notificationFixed: notificationHasFinished, notificationGone: notificationHasToGo }'>
        <div class='line'></div>
        <Text class='title'>{{ props.notification.title }}</Text>
        <Text>{{ props.notification.message }}</Text>
    </div>
</template>

<style scoped>
    .notificationPlaceholder {
        width: 30vw;
        height: 100px;
    }

    .notification {
        position: absolute;
        width: 30vw;
        bottom: 0;
        right: 0;
        transform: translateX(20vw);
        animation: notificationShownUp ease-out 300ms forwards;
        padding: 10px 20px;
        border: 1px solid white;
        overflow: hidden;
        border-radius: 4px;
        display: flex;
        flex-direction: column;
        min-height: 80px;
        z-index: 11;
        box-sizing: border-box;
    }

    .notificationFixed {
        position: relative;
        bottom: 0;
        right: 0;
    }

    .notificationGone {
        transform: translateX(0);
        animation: notificationGone linear 300ms forwards;
    }

    .line {
        height: 100%;
        width: 5px;
        background-color: white;
        position: absolute;
        top: 0;
        left: 0;
    }

    .title {
        margin-bottom: 6px;
    }

    @media (max-width: 840px) {
        .notification {
            width: 80vw;
        }
    }

    @keyframes notificationShownUp {
        to {
            transform: translateX(0);
        }
    }

    @keyframes notificationGone {
        to {
            opacity: 0;
        }
    }
</style>
