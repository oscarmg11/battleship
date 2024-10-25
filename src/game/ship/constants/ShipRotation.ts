export const ShipRotations = {
    VERTICAL: 'VERTICAL',
    HORIZONTAL: 'HORIZONTAL',
}

export type ShipRotation = typeof ShipRotations[keyof typeof ShipRotations]
