import { ref } from 'vue'
import { defineStore } from 'pinia'
import { GameMessageVm } from '@/types/GameMessageVm.js'

export const useGameMessagesStore = defineStore('gameMessages', () => {
    const gameMessages = ref<Array<GameMessageVm>>([])

    function showGameMessage(newGameMessage: GameMessageVm) {
        gameMessages.value.push(newGameMessage)
    }

    function removeOldestMessage() {
        gameMessages.value.shift()
    }

    return { gameMessages, showGameMessage, removeOldestMessage }
})
