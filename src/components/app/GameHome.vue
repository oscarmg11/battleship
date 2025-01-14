<script setup lang='ts'>
import Button from '@/components/Button.vue'
import { translate } from '@/utils/text/translate'
import Text from '@/components/Text.vue'
import { onMounted, ref, defineEmits} from 'vue'
import Loader from '@/components/Loader.vue'
import { createGameApi } from '@/api/game/createGameApi'
import { useNotificationsStore } from '@/stores/useNotificationsStore'
import { connectHostToGame } from '@/webSocket/game/connectHostToGame'
import { useGameStore } from '@/stores/useGameStore'
import JoinGame from '@/components/app/JoinGame.vue'
import { setLastTimePayedInSessionStorage } from '@/utils/sessionStorage/game/setLastTimePayedInSessionStorage'
import { getLastTimePayedInSessionStorage } from '@/utils/sessionStorage/game/getLastTimePayedInSessionStorage'
import { isAfter, subMinutes } from 'date-fns'
import { getGameFromSessionStorage } from '@/utils/sessionStorage/game/getGameFromSessionStorage'
import { setIsHostPlayerInSessionStorage } from '@/utils/sessionStorage/player/setIsHostPlayerInSessionStorage'
import { getIsHostPlayerInSessionStorage } from '@/utils/sessionStorage/player/getIsHostPlayerInSessionStorage'
import { connectRivalToGame } from '@/webSocket/game/connectRivalToGame'
import { wait } from '@/utils/promises/wait'
import { usePlayerStore } from '@/stores/usePlayerStore'
import { useGameMessagesStore } from '@/stores/useGameMessagesStore'
import { getGameApi } from '@/api/game/getGameApi'
import { GameVm } from '@/types/GameVm'
import { setGameInSessionStorage } from '@/utils/sessionStorage/game/setGameInSessionStorage'
import { clearSessionStorageData } from '@/utils/sessionStorage/clearSessionStorageData'
import { isGameSettingUp } from '@/utils/game/gameStatus/isGameSettingUp'

const emits = defineEmits<{ (e: 'onGameCreated', { isGameSettingUp }?: { isGameSettingUp: boolean }): void, (e: 'onJoinedToGame'): void }>()

const lastTimePlayed = getLastTimePayedInSessionStorage()
const leastDateAbleToReconnect = subMinutes(new Date(), 30)

const creatingGame = ref(false)
const isJoiningGame = ref(false)

const notificationsStore = useNotificationsStore()
const gameMessagesStore = useGameMessagesStore()
const gameStore = useGameStore()
const playerStore = usePlayerStore()

const canReconnectToGame = ref(!!lastTimePlayed && isAfter(lastTimePlayed, leastDateAbleToReconnect))

onMounted(() => {
    if(!canReconnectToGame) return
    tryToReconnectToGame()
})

const tryToReconnectToGame = async () => {
    const gameToReconnect = getGameFromSessionStorage()
    if(!gameToReconnect) return

    try{
        const updatedGame = await getGameApi({ roomId: gameToReconnect.roomId })
        if(!updatedGame) throw new Error(translate('Game not found'))

        await reconnectToGame(updatedGame)
    }catch (e) {
        notificationsStore.showNotification({
            title: translate('Reconnection failed'),
            message: translate('There was an error reconnecting to game, problem: ') + e.message
        })
        await wait(1000)
        canReconnectToGame.value = false
        clearSessionStorageData()
    }
}

const reconnectToGame = async (gameToReconnect: GameVm) => {
    await wait(1000)
    const isHostPlayer = getIsHostPlayerInSessionStorage()
    if(isHostPlayer){
        await connectHostToGame(gameToReconnect.gameId)
    } else {
        await connectRivalToGame({
            gameId: gameToReconnect.gameId,
            rivalPlayerId: playerStore.player.playerId
        })
        playerStore.changePlayerToRival()
    }
    gameMessagesStore.showGameMessage({
        message: translate('Reconnected'),
    })
    gameStore.setGame(gameToReconnect)
    setGameInSessionStorage(gameToReconnect)
    setLastTimePayedInSessionStorage(new Date())
    emits("onGameCreated", { isGameSettingUp: isGameSettingUp(gameToReconnect.gameStatus) })
}

const createGame = async () => {
    creatingGame.value = true
    try {
        const game = await createGameApi({
            playerId: playerStore.player.playerId,
        })
        await connectHostToGame(game.gameId)
        gameStore.setGame(game)
        emits('onGameCreated')
        setLastTimePayedInSessionStorage(new Date())
        setIsHostPlayerInSessionStorage(true)
        gameMessagesStore.showGameMessage({
            message: translate('Waiting for rival'),
            loader: true,
            lastUntilNewMessage: true
        })
    }catch (e) {
        creatingGame.value = false
        notificationsStore.showNotification({
            title: translate('Error'),
            message: translate('There was an error, try it later.')
        })
    }
}

const showJoinGameForm = () => {
    isJoiningGame.value = true
}

const cancelJoinGame = () => {
    isJoiningGame.value = false
}

</script>

<template>
    <section class='container'>
        <Text variant='title'>BATTLESHIP</Text>
        <article v-if='canReconnectToGame'>
            <Loader :size='20' :text="translate('Reconnecting to battle')" />
        </article>
        <article class='actionsContainer' v-if='!isJoiningGame && !canReconnectToGame'>
            <Button class='button' @click='createGame' :disabled='creatingGame'>{{ translate('Create battle') }}</Button>
            <Button class='button' v-if='!creatingGame' @click='showJoinGameForm'>{{ translate('Join battle') }}</Button>
            <div v-if='creatingGame' class='loading'>
                <Loader :size='20' :text="translate('Loading')" />
            </div>
        </article>
        <JoinGame v-if='isJoiningGame && !canReconnectToGame' @onSuccess='() => emits("onJoinedToGame")' @onCancel='cancelJoinGame' />
    </section>
</template>

<style scoped>
.container {
    display: flex;
    flex-direction: column;
    position: absolute;
    background-color: black;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
}

.actionsContainer {
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
}

.button {
    width: 20vw;
    min-width: 200px;
}

.loading {
    margin-top: 10px;
}
</style>
