import { ref } from 'vue'
import { defineStore } from 'pinia'
import { PlayerVm } from '@/types/PlayerVm.ts'

export const usePlayerStore: Store = defineStore('player', () => {
    const player = ref<PlayerVm>({
        isHost: true
    })

    function changePlayerToRival() {
        player.value.isHost = false
    }

    return { player, changePlayerToRival }
})

type Store = () => ({
    player: PlayerVm,
    changePlayerToRival: () => void,
})
