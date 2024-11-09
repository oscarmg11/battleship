
class WebSocketImplementation {
    webSocketConnection: WebSocket
    constructor() {
        const webSocketConnection = new WebSocket(import.meta.env.VITE_WEBSOCKET_URI)
        webSocketConnection.onopen = () => {
            console.log('WebSocket connected');
        };

        webSocketConnection.onmessage = (event) => {
            const message = event.data;
            console.log('Received message:', message);
        };

        webSocketConnection.onclose = () => {
            console.log('WebSocket connection closed');
        };

        webSocketConnection.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        this.webSocketConnection = webSocketConnection
    }

    sendMessage(data: any){
        this.webSocketConnection.send(JSON.stringify(data))
    }

}

export const webSocket = new WebSocketImplementation()
