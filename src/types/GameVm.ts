import type { GameStatus } from '@/constants/GameStatus.ts'

export type GameVm = {
    gameId: string;
    hostPlayerId: string;
    rivalPlayerId?: string;
    gameStatus: GameStatus;
    roomId: string;
}
