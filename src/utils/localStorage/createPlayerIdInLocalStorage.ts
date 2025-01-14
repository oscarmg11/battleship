import { getPlayerIdInLocalStorage } from '@/utils/localStorage/getPlayerIdInLocalStorage.js'
import { newId } from '@/utils/newId.js'

export function createPlayerIdInLocalStorage(): string {
    let playerId = getPlayerIdInLocalStorage()
    if(playerId) return playerId

    playerId = newId()
    window.localStorage.setItem('playerId', playerId)
    return playerId
}
