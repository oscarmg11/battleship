import { webSocket } from '@/webSocket/WebSocket.js'

export async function connectRivalToGame(params: Params): Promise<void> {
    webSocket.sendEvent('connectRivalToGame', params)
}

type Params = {
    gameId: string;
    rivalPlayerId: string
}
