import { ref } from 'vue'
import { defineStore } from 'pinia'
import { GameMessageVm } from '@/types/GameMessageVm.js'

export const useGameMessagesStore = defineStore('gameMessages', () => {
    const gameMessages = ref<Array<GameMessageVm & { resolve: Function }>>([])

    async function showGameMessage(newGameMessage: GameMessageVm) {
        return new Promise((resolve) => {
            gameMessages.value.push({
                ...newGameMessage,
                resolve
            })
        })
    }

    function removeOldestMessage() {
        const gameMessage = gameMessages.value.shift()
        gameMessage?.resolve()
    }

    return { gameMessages, showGameMessage, removeOldestMessage }
})
