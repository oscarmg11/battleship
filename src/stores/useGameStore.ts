import { ref } from 'vue'
import { defineStore } from 'pinia'
import { GameVm } from '@/types/GameVm.js'
import { getGameFromSessionStorage } from '@/utils/sessionStorage/game/getGameFromSessionStorage.ts'
import { setGameInSessionStorage } from '@/utils/sessionStorage/game/setGameInSessionStorage.ts'

export const useGameStore = defineStore('fame', () => {
    const game = ref<undefined | GameVm>(getGameFromSessionStorage())

    function setGame(newGame: GameVm) {
        setGameInSessionStorage(newGame)
        game.value = newGame
    }

    return { game, setGame }
})
