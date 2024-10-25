
export class ShipEditionValidator {
    private static currentEditingShipId: number | undefined = undefined

    static startEditing(shipId: number) {
        this.currentEditingShipId = shipId
    }

    static endEditing() {
        this.currentEditingShipId = undefined
    }

    static canEditShip(shipId: number) {
        if(!this.currentEditingShipId) return true
        return shipId === this.currentEditingShipId
    }
}
