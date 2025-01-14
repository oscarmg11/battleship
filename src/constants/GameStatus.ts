export const GameStatuses = Object.freeze({
    WAITING_FOR_PLAYERS: 'WAITING_FOR_PLAYERS',
    SETTING_UP_GAME: 'SETTING_UP_GAME',
})

export type GameStatus = (typeof GameStatuses)[keyof typeof GameStatuses]
