<script setup>
import Button from '@/components/Button.vue'
import { translate } from '@/utils/text/translate'
import Text from '@/components/Text.vue'
import { onMounted, ref } from 'vue'
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

const emit = defineEmits(['onGameCreated'])

const creatingGame = ref(false)
const isJoiningGame = ref(false)

const notificationsStore = useNotificationsStore()
const gameStore = useGameStore()
const playerStore = usePlayerStore()

const lastTimePlayed = getLastTimePayedInSessionStorage()
const leastDateAbleToReconnect = subMinutes(new Date(), 30)
const canReconnectToGame = !!lastTimePlayed && isAfter(lastTimePlayed, leastDateAbleToReconnect)

onMounted(() => {
    if(!canReconnectToGame) return
    reconnectToGame()
})

const reconnectToGame = async () => {
    const gameToReconnect = getGameFromSessionStorage()
    if(!gameToReconnect) return

    await wait(1000)
    const isHostPlayer = getIsHostPlayerInSessionStorage()
    if(isHostPlayer){
        await connectHostToGame(gameToReconnect.gameId)
    } else {
        await connectRivalToGame(gameToReconnect.gameId)
        playerStore.changePlayerToRival()
    }
    gameStore.setGame(gameToReconnect)
    setLastTimePayedInSessionStorage(new Date())
    emit("onGameCreated")
}

const createGame = async () => {
    creatingGame.value = true
    try {
        const game = await createGameApi()
        await connectHostToGame(game.gameId)
        gameStore.setGame(game)
        emit('onGameCreated')
        setLastTimePayedInSessionStorage(new Date())
        setIsHostPlayerInSessionStorage(true)
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
        <JoinGame v-if='isJoiningGame && !canReconnectToGame' @onSuccess='() => emit("onGameCreated")' @onCancel='cancelJoinGame' />
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
