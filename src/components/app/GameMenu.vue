<script setup lang='ts'>
import Button from '@/components/Button.vue'
import { game } from '@/game/Game.ts'
import { translate } from '@/utils/text/translate.ts'
import { ref } from 'vue'
import { useNotificationsStore } from '@/stores/useNotificationsStore.ts'
import GameRules from '@/components/app/GameRules.vue'
import Text from '@/components/Text.vue'
import { useGameStore } from '@/stores/useGameStore.js'
import CopyIcon from '@/icons/CopyIcon.vue'
import WaitingForRivalLoader from '@/components/app/WaitingForRivalLoader.vue'

const store = useNotificationsStore()
const gameStore = useGameStore()

const settingUpGame = ref(false)
const gameReady = ref(false)


const setupShips = () => {
    if(settingUpGame.value){
        if(game.isGameReadyToStart()){
            gameReady.value = true
            return game.finishSetupGame()
        }
        store.showNotification({
            title: translate('Board is not ready'),
            message: game.getBoardErrorMessage()
        })
        return
    }

    game.setupGame()
    settingUpGame.value = true
}

const copyRoomId = () => {
    if(!gameStore.game) return
    navigator.clipboard.writeText(gameStore.game.roomId)
}

</script>

<template>
    <nav class="nav">
        <div class='gameInfo' v-if='!!gameStore.game'>
            <Text>{{ translate('Battle: ') + gameStore.game?.roomId }}</Text>
            <Button class='iconButton' @click='copyRoomId'>
                <CopyIcon />
            </Button>
        </div>
        <WaitingForRivalLoader />
        <Button @click='setupShips' v-if='!gameReady' class='setupButton'>{{ settingUpGame ? translate('Ready') : translate('Setup ships')   }}</Button>
    </nav>
    <GameRules v-if='settingUpGame && !gameReady'  />
</template>

<style scoped>
.nav {
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: absolute;
    top: 5vh;
    width: 100%;
    align-items: center;
    justify-content: center;
}

.setupButton{
    position: absolute;
    right: 5vw;
}

.gameInfo {
    position: absolute;
    left: 5vw;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 6px;
}

.iconButton {
    background-color: transparent;
    color: white;
    border-radius: 30px;
    height: 30px;
    width: 30px;
    flex-shrink: 0;
    padding: 4px;
    border: 0;
}
</style>

