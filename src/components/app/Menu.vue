<script setup lang='ts'>
import Button from '@/components/Button.vue'
import { game } from '@/game/Game.ts'
import { translate } from '@/utils/text/translate.ts'
import { ref } from 'vue'
import { useNotificationsStore } from '@/stores/useNotificationsStore.ts'
import GameRules from '@/components/app/GameRules.vue'

const store = useNotificationsStore()

const settingUpGame = ref(false)

const setupShips = () => {
    if(settingUpGame.value){
        if(game.isGameReadyToStart()){
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
        <Button @click='setupShips'>{{ settingUpGame ? translate('Ready') : translate('Setup ships')   }}</Button>
    </nav>
    <GameRules v-if='settingUpGame' />
</template>

<style scoped>
.nav {
    display: flex;
    flex-direction: column;
    gap: 6px;
    position: absolute;
    right: 5vw;
    top: 5vh;
}
</style>
