export const ShipShapes = {
    LONG: 'LONG',
    MEDIUM: 'MEDIUM',
    SHORT: 'SHORT',
    SMALL: 'SMALL',
}

export type ShipShape = typeof ShipShapes[keyof typeof ShipShapes]
