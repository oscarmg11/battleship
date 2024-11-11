import { GameVm } from '@/types/GameVm.js'

export function setGameInSessionStorage(game: GameVm): void {
    window.sessionStorage.setItem('game', JSON.stringify(game))
}
