<script setup lang='ts'>
import Button from '@/components/Button.vue'
import { game } from '@/game/Game.ts'
import { translate } from '@/utils/text/translate.ts'
import { ref } from 'vue'
import { useNotificationsStore } from '@/stores/useNotificationsStore.ts'
import GameRules from '@/components/app/GameRules.vue'
import Loader from '@/components/Loader.vue'
import Text from '@/components/Text.vue'

const store = useNotificationsStore()

const settingUpGame = ref(false)
const gameReady = ref(false)
const enemyReady = ref(false)

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

</script>

<template>
    <nav class="nav">
        <div class='waitingForEnemy' v-if='gameReady && !enemyReady'>
            <Loader :size='20' />
            <Text>{{ translate('Waiting for opponent') }}</Text>
        </div>
        <Button @click='setupShips' v-if='!gameReady' class='button'>{{ settingUpGame ? translate('Ready') : translate('Setup ships')   }}</Button>
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

.button{
    position: absolute;
    right: 5vw;
}

.waitingForEnemy {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}
</style>
