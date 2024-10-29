import { ref } from 'vue'
import { defineStore } from 'pinia'
import { Notification } from '@/types/Notification.ts'

export const useNotificationsStore = defineStore('counter', () => {
    const notifications = ref<Array<Notification>>([])

    function showNotification(notification: Notification) {
        if(notifications.value.some(currentNotification => currentNotification.message === notification.message)) return
        notifications.value.push(notification)
    }

    function removeNotification(notification: Notification) {
        notifications.value = notifications.value.filter(currentNotification => currentNotification.message !== notification.message)
    }

    return { notifications, showNotification, removeNotification }
})
