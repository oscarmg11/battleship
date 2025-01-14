import { GameStatus, GameStatuses } from '@/constants/GameStatus.ts'

export function isGameSettingUp(gameStatus: GameStatus): boolean {
    return gameStatus === GameStatuses.SETTING_UP_GAME
}
