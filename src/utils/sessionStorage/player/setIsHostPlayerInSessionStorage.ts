
export function setIsHostPlayerInSessionStorage(isHostPlayer: boolean): void {
    window.sessionStorage.setItem('isHostPlayer', JSON.stringify(isHostPlayer))
}
