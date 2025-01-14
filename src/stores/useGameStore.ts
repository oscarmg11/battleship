import { ref } from 'vue'
import { defineStore } from 'pinia'
import { GameVm } from '@/types/GameVm.js'
import { getGameFromSessionStorage } from '@/utils/sessionStorage/game/getGameFromSessionStorage.ts'
import { setGameInSessionStorage } from '@/utils/sessionStorage/game/setGameInSessionStorage.ts'
import { game as gameObject } from '@/game/Game.ts'

export const useGameStore: Store = defineStore('game', () => {
    const game = ref<undefined | GameVm>(getGameFromSessionStorage())
    const disabled = ref(true)
    const settingUp = ref(false)

    function setGame(newGame: GameVm) {
        setGameInSessionStorage(newGame)
        game.value = newGame
    }

    function enable(){
        disabled.value = false
        gameObject.enable()
    }

    function disable(){
        disabled.value = true
        gameObject.disable()
    }

    function setupGame(){
        if(settingUp.value) return

        settingUp.value = true
        gameObject.setupGame()
    }

    function finishSetupGame(){
        settingUp.value = false
        gameObject.finishSetupGame()
    }

    return { game, disabled, settingUp, setGame, enable, disable, setupGame, finishSetupGame }
})

type Store = () => ({
    game: GameVm | undefined,
    disabled: boolean,
    settingUp: boolean,
    setGame: (game: GameVm) => void,
    enable: () => void,
    disable: () => void,
    setupGame: () => void,
    finishSetupGame: () => void,
})
