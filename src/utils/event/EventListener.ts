
export class EventListener {
    private static subscribers: Array<Subscriber> = []

    static addEventListener(event: string, fn: (data: any) => void) {
        this.subscribers.push({ event, callback: fn })
        return () => {
            this.subscribers = this.subscribers.filter(subscriber => subscriber.callback !== fn)
        }
    }

    static updateEventListener(event: string, data?: any) {
        for(const subscriber of this.subscribers) {
            if(subscriber.event !== event) continue
            subscriber.callback(data)
        }
    }

}

type Subscriber = {
    event: string;
    callback: <T>(data: T) => void
}


