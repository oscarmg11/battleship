import { GameVm } from '@/types/GameVm.js'
import axios from 'axios'

export async function createGameApi(): Promise<GameVm>{
    const response = await axios<GameVm>({
        method: 'POST',
        url: `${import.meta.env.VITE_GAME_API}/game/createGame`
    })

    return response.data

}
