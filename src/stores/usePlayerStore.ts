import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { PlayerVm } from '@/types/PlayerVm.ts'
import type { SessionVm } from '@/types/SessionVm.ts'
import { setIsHostPlayerInSessionStorage } from '@/utils/sessionStorage/player/setIsHostPlayerInSessionStorage.js'

export const usePlayerStore: Store = defineStore('player', () => {
    const player = ref<PlayerVm>({
        isHost: true,
        playerId: ''
    })

    const session = ref<SessionVm | undefined>(undefined)

    function changePlayerToRival() {
        player.value.isHost = false
        setIsHostPlayerInSessionStorage(false)
    }

    function changePlayerToHost() {
        player.value.isHost = true
        setIsHostPlayerInSessionStorage(true)
    }

    function setSession(newSession: SessionVm) {
        session.value = newSession
    }

    function setPlayerId(playerId: string) {
        player.value.playerId = playerId
    }

    return { player, session, changePlayerToRival, changePlayerToHost, setSession, setPlayerId }
})

type Store = () => ({
    player: PlayerVm,
    session: SessionVm | undefined,
    changePlayerToRival: () => void,
    changePlayerToHost: () => void,
    setSession: (session: SessionVm) => void,
    setPlayerId: (playerId: string) => void,
})
