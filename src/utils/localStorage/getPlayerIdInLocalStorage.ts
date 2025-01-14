
export function getPlayerIdInLocalStorage(): string | undefined {
    return window.localStorage.getItem('playerId') || undefined
}
