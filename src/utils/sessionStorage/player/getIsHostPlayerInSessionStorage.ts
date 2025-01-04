

export function getIsHostPlayerInSessionStorage(): boolean {
    const isHostPlayer = window.sessionStorage.getItem('isHostPlayer')
    return isHostPlayer ? JSON.parse(isHostPlayer): false
}
