import { WebSocketEvent, WebSocketEventListener } from '@/utils/event/WebSocketEventListener.js'

class WebSocketImplementation {
    webSocketConnection: WebSocket
    constructor() {
        const webSocketConnection = new WebSocket(import.meta.env.VITE_WEBSOCKET_URI)
        webSocketConnection.onopen = (event) => {
            console.log('WebSocket connected');
        };

        webSocketConnection.onmessage = (event: MessageEvent<string>) => {
            const eventMessage = JSON.parse(event.data) as WebSocketEventMessage;
            WebSocketEventListener.updateEventListener(eventMessage.event as any, eventMessage.data)
        };

        webSocketConnection.onclose = () => {
            console.log('WebSocket connection closed');
        };

        webSocketConnection.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        this.webSocketConnection = webSocketConnection
    }

    sendEvent(event: EventSent, data?: any){
        this.webSocketConnection.send(JSON.stringify({
            event,
            data
        }))
    }

}

export const webSocket = new WebSocketImplementation()

type EventSent = 'connectHostToGame' | 'connectRivalToGame'

type WebSocketEventMessage = {
    event: WebSocketEvent;
    data: any
}
