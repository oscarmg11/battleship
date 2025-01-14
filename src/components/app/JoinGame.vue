<script setup lang='ts'>

import Input from '@/components/Input.vue'
import { ref } from 'vue'
import { translate } from '@/utils/text/translate.js'
import Button from '@/components/Button.vue'
import { useNotificationsStore } from '@/stores/useNotificationsStore.js'
import { getGameApi } from '@/api/game/getGameApi.js'
import { useGameStore } from '@/stores/useGameStore.js'
import { connectRivalToGame } from '@/webSocket/game/connectRivalToGame.js'
import { usePlayerStore } from '@/stores/usePlayerStore.js'
import { setLastTimePayedInSessionStorage } from '@/utils/sessionStorage/game/setLastTimePayedInSessionStorage'
import { setIsHostPlayerInSessionStorage } from '@/utils/sessionStorage/player/setIsHostPlayerInSessionStorage'

const emits = defineEmits<{ (e: 'onSuccess'): void, (e: 'onCancel'): void  }>()

const roomId = ref('')
const joining = ref(false)

const notificationsStore = useNotificationsStore()
const gameStore = useGameStore()
const playerStore = usePlayerStore()

const handleInputChange = (value: string) => {
    if(value.length > 6) return
    roomId.value = value
}

const joinGame = async () => {
    try {
        joining.value = true
        const game = await getGameApi({ roomId: roomId.value })
        joining.value = false
        if(!game) {
            notificationsStore.showNotification({
                title: translate('Invalid room'),
                message: translate('The code you entered is not a valid room')
            })
            return
        }
        await connectRivalToGame({
            gameId: game.gameId,
            rivalPlayerId: playerStore.player.playerId
        })
        gameStore.setGame(game)
        playerStore.changePlayerToRival()
        setLastTimePayedInSessionStorage(new Date())
        setIsHostPlayerInSessionStorage(false)
        emits('onSuccess')
    }catch (e) {
        joining.value = false
        notificationsStore.showNotification({
            title: translate('Error'),
            message: translate('There was an error, try it later.')
        })
    }
}

const cancelJoinGame = () => emits('onCancel')

</script>

<template>

    <div class='inputContainer'>
        <Input :value='roomId' @change='handleInputChange' name='roomId' :label='translate("Battle: ")' :disabled='joining' />
        <div class='buttonsContainer'>
            <Button variant='secondary' class='button' @click='cancelJoinGame' :disabled='joining'>{{ translate('Go back') }}</Button>
            <Button class='button' @click='joinGame' :disabled='joining'>{{ translate('Join') }}</Button>
        </div>
    </div>
</template>

<style scoped>
    .inputContainer {
        display: flex;
        flex-direction: column;
        gap: 16px;
        max-width: 20vw;
        min-width: 200px;
    }

    .buttonsContainer {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
        width: 20vw;
        min-width: 200px;
    }

    .button {
        width: 100%;
    }
</style>
