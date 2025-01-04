import { GameVm } from '@/types/GameVm.js'
import axios from 'axios'
import { envViteGameApi } from '@/utils/env/envViteGameApi.js'

export async function createGameApi(): Promise<GameVm>{
    const response = await axios<GameVm>({
        method: 'POST',
        url: `${envViteGameApi()}/game/createGame`
    })

    return response.data

}
