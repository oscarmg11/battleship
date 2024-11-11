<script setup>
import Button from '@/components/Button.vue'
import { translate } from '@/utils/text/translate'
import Text from '@/components/Text.vue'
import { ref } from 'vue'
import Loader from '@/components/Loader.vue'
import { createGameApi } from '@/api/game/createGameApi'
import { useNotificationsStore } from '@/stores/useNotificationsStore'
import { connectHostToGame } from '@/webSocket/game/connectHostToGame'

const emit = defineEmits(['onGameCreated'])

const creatingGame = ref(false)

const store = useNotificationsStore()

const createGame = async () => {
    creatingGame.value = true
    try {
        const game = await createGameApi()
        await connectHostToGame(game.gameId)
        emit('onGameCreated')
    }catch (e) {
        creatingGame.value = false
        store.showNotification({
            title: translate('Error'),
            message: translate('There was an error, try it later.')
        })
    }
}

</script>

<template>
    <section class='container'>
        <article class='actionsContainer'>
            <Text variant='title'>BATTLESHIP</Text>
            <Button class='button' @click='createGame' :disabled='creatingGame'>{{ translate('Create battle') }}</Button>
            <Button class='button' v-if='!creatingGame'>{{ translate('Join battle') }}</Button>
            <div v-if='creatingGame' class='loading'>
                <Loader :size='20' :text="translate('Loading')" />
            </div>
        </article>
    </section>
</template>

<style scoped>
.container {
    display: flex;
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
}

.loading {
    margin-top: 10px;
}
</style>
