import { GameVm } from '@/types/GameVm.js'
import axios from 'axios'
import { envViteGameApi } from '@/utils/env/envViteGameApi.js'

export async function getGameApi(request: Request): Promise<GameVm | undefined>{
    const response = await axios<GameVm>({
        method: 'POST',
        url: `${envViteGameApi()}/game/getGame`,
        data: request
    })

    return response.data

}

type Request = {
    roomId: string
}
