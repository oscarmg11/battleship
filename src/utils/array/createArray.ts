export function createArray<T>(length: number, value: T): Array<T> {
    return Array.from({ length }, () => value)
}
