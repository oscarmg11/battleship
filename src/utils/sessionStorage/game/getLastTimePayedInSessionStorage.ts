
export function getLastTimePayedInSessionStorage(): Date | undefined {
    const lastTimePlayed = window.sessionStorage.getItem('lastTimePlayed')
    return lastTimePlayed ? new Date(lastTimePlayed) : undefined
}
