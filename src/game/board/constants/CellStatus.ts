export const CellStatuses = {
    EMPTY: 0,
    BUSY: 1,
    HIT: 2,
    MISSED: 3,
}

export type CellStatus = typeof CellStatuses[keyof typeof CellStatuses]
