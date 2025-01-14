
export function clearLastTimePayedInSessionStorage(): void {
    window.sessionStorage.removeItem('lastTimePlayed')
}
