import { GameVm } from '@/types/GameVm.js'

export function getGameFromSessionStorage(): GameVm | undefined {
    const game = window.sessionStorage.getItem('game')
    return game ? JSON.parse(game) : undefined
}
