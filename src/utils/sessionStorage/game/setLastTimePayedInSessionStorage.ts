
export function setLastTimePayedInSessionStorage(lastTimePlayed: Date): void {
    window.sessionStorage.setItem('lastTimePlayed', lastTimePlayed.toISOString())
}
