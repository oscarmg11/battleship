import { clearGameInSessionStorage } from '@/utils/sessionStorage/game/clearGameInSessionStorage.js'
import { clearLastTimePayedInSessionStorage } from '@/utils/sessionStorage/game/clearLastTimePayedInSessionStorage.js'
import { clearIsHostPlayerInSessionStorage } from '@/utils/sessionStorage/player/clearIsHostPlayerInSessionStorage.js'

export function clearSessionStorageData() {
    clearGameInSessionStorage()
    clearLastTimePayedInSessionStorage()
    clearIsHostPlayerInSessionStorage()
}
