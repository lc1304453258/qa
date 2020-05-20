module.exports = {
    /**
     * 克隆BOM
     */
    cloneBom: function (bom) {
        if (bom == null) {
            return null;
        }

        let bomClone = {
            "id": bom.id,
            "brand": bom.brand,
            "description": bom.description,
            "no": bom.no,
            "type": bom.type,
            "quantity": bom.quantity,
            "repairCount": bom.repairCount,
            "versionNo": bom.versionNo,
            "versionDescription": bom.versionDescription,
            "versionEffectDate": bom.versionEffectDate,
            "versionEndDate": bom.versionEndDate,
            "replaceCode": bom.replaceCode,
            "replaceDescription": bom.replaceDescription,
            "bomComponentId": bom.bomComponentId,
            "bomParent": this.cloneBomParent(bom.bomParent)
        }

        if (bom.bomComponents != null && bom.bomComponents.length > 0) {
            bomClone.bomComponents = [];

            for (let index = 0; index < bom.bomComponents.length; index++) {
                let bomComponentClone = this.cloneBomComponent(bom.bomComponents[index]);
                bomClone.bomComponents.push(bomComponentClone);
            }
        }

        return bomClone;
    },

    /**
     * 克隆BOM主件
     * @param {*} bomParent 
     */
    cloneBomParent: function (bomParent) {
        if (bomParent == null) {
            return null;
        }

        let bomParentClone = {
            "id": bomParent.id,
            "imageNames": bomParent.imageNames,
            "parentInventoryDto": this.cloneInventory(bomParent.parentInventoryDto),
        }

        return bomParentClone;
    },

    /**
     * 克隆Inventory
     * @param {*} inventory 
     */
    cloneInventory: function (inventory) {
        if (inventory == null) {
            return null;
        }

        let inventoryClone = {
            "id": inventory.id,
            "name": inventory.name,
            "no": inventory.no,
            "type": inventory.type,
            "drawingNo": inventory.drawingNo,
            "computationUnit": inventory.computationUnit,
            "savePositionName": inventory.savePositionName,
            "vendorName": inventory.vendorName,
            "vendorId": inventory.vendorId,
            "positionId": inventory.positionId,
            "inventoryClassId": inventory.inventoryClassId,
            "imageNames": inventory.imageNames,
            "className": inventory.className,
            "rfidManagement": inventory.rfidManagement
        }

        return inventoryClone;
    },

    /**
     * 克隆BOM子件
     * @param {} bomComponent 
     */
    cloneBomComponent: function (bomComponent) {
        if (bomComponent == null) {
            return null;
        }

        let bomComponentClone = {
            "id": bomComponent.id,
            "baseQty": bomComponent.baseQty,
            "actualQuantity": bomComponent.actualQuantity,
            "sortIndex": bomComponent.sortIndex,
            "activeBom": this.cloneBom(bomComponent.activeBom),
            "levelNo": bomComponent.levelNo,
            "imageNames": bomComponent.imageNames,
            "inventory": this.cloneInventory(bomComponent.inventory)
        }

        return bomComponentClone;
    },



    /**
     * 获取RFID管理的BOM树
     * @param {*} bom 
     */
    filterRfidManagement1: function (bom) {
        var _self = this;
        let rfidManagementCount = 0;
        // 如果BOM子件的数量大于0
        if (bom.bomComponents != null && bom.bomComponents.length > 0) {
            for (let index = 0; index < bom.bomComponents.length; index++) {
                let bomComponent = bom.bomComponents[index];
                if (bomComponent.inventory != null) {
                    // 是RFID管理的物料
                    if (bomComponent.inventory.rfidManagement == true) {
                        bomComponent.actualQuantity = 0;
                        rfidManagementCount++;
                    } else {
                        // 不是人工检查的物料
                    }
                    if (bomComponent.activeBom != undefined) {
                        rfidManagementCount += _self.filterRfidManagement1(bomComponent.activeBom);
                    }
                } else {
                    bom.bomComponents.splice(index, 1);
                    index--;
                }
            }
        }

        bom.rfidManagementCount = rfidManagementCount;
        return rfidManagementCount;
    },


    /**
     * 获取RFID管理的BOM树
     * @param {*} bom 
     */
    filterRfidManagement2: function (bom) {
        var _self = this;

        if(bom == null){
            return;
        }
        // 如果BOM子件的数量大于0
        if (bom.bomComponents != null && bom.bomComponents.length > 0) {
            for (let index = 0; index < bom.bomComponents.length; index++) {
                let bomComponent = bom.bomComponents[index];

                if (bomComponent.activeBom != null && bomComponent.activeBom.rfidManagementCount == 0) {
                    bomComponent.activeBom = null;
                } else {
                    _self.filterRfidManagement2(bomComponent.activeBom);
                }

                // 移除掉非RFID管理的物料
                if (bomComponent.activeBom == null &&
                    (bomComponent.inventory.rfidManagement == null || bomComponent.inventory.rfidManagement == false)) {
                    bom.bomComponents.splice(index, 1);
                    index--;
                }
            }
        }
        return bom;
    },


    /**
     * 获取人工管理的BOM树
     * @param {*} bom 
     */
    filterManualManagement1: function (bom) {
        var _self = this;
        let manualManagementCount = 0;
        // 如果BOM子件的数量大于0
        if (bom.bomComponents != null && bom.bomComponents.length > 0) {
            for (let index = 0; index < bom.bomComponents.length; index++) {
                let bomComponent = bom.bomComponents[index];
                if (bomComponent.inventory != null) {

                    if (bomComponent.inventory.rfidManagement == null
                        || bomComponent.inventory.rfidManagement == false) {
                        // 是人工检查的物料
                        bomComponent.actualQuantity = 0;
                        manualManagementCount++;
                    } else {
                        // 不是人工检查的物料
                    }
                    if (bomComponent.activeBom != undefined) {
                        manualManagementCount += _self.filterManualManagement1(bomComponent.activeBom);
                    }
                } else {
                    bom.bomComponents.splice(index, 1);
                    index--;
                }
            }
        }

        bom.manualManagementCount = manualManagementCount;
        return manualManagementCount;
    },

    /**
     * 获取人工管理的BOM树
     * @param {*} bom 
     */
    filterManualManagement2: function (bom) {
        var _self = this;
        if(bom == null){
            return;
        }
        // 如果BOM子件的数量大于0
        if (bom.bomComponents != null && bom.bomComponents.length > 0) {
            for (let index = 0; index < bom.bomComponents.length; index++) {
                let bomComponent = bom.bomComponents[index];

                if (bomComponent.activeBom != null && bomComponent.activeBom.manualManagementCount == 0) {
                    bomComponent.activeBom = null;
                } else {
                    _self.filterManualManagement2(bomComponent.activeBom);
                }

                // 移除掉人工管理的物料
                if (bomComponent.activeBom == null && bomComponent.inventory.rfidManagement == true) {
                    bom.bomComponents.splice(index, 1);
                    index--;
                }
            }
        }
        return bom;
    }

}