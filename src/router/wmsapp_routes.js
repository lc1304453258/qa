module.exports = {
	routes: [
		{ path: '/', redirect: '/login' },
		{ path: '/login', component: resolve => require.ensure([], () => resolve(require('../menu/Login.vue')), 'wms-app-login') },
		{ path: '/desktop/dashboard', component: resolve => require.ensure([], () => resolve(require('../menu/AppMenu.vue')), 'wms-app-0') },
		{ path: '/desktop/autoLogin/:code?', component: resolve => require.ensure([], () => resolve(require('../wmsapp/AutoLogin.vue')), 'wms-app-1') },
		{ path: '/desktop/purchaseArrival', component: resolve => require.ensure([], () => resolve(require('../wmsapp/PurchaseArrival.vue')), 'wms-app-2') },
		{ path: '/desktop/inspectionRequest', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InspectionRequest.vue')), 'wms-app-3') },
		{ path: '/desktop/inspect', component: resolve => require.ensure([], () => resolve(require('../wmsapp/Inspect.vue')), 'wms-app-4') },
		//{ path: '/desktop/inspectResult', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InspectResult.vue')), 'wms-app')},
		{ path: '/desktop/inspectReject', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InspectReject.vue')), 'wms-app-5') },
		{ path: '/desktop/inspectStockIn', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InspectStockIn.vue')), 'wms-app-6') },
		{ path: '/desktop/stockInScan', component: resolve => require.ensure([], () => resolve(require('../wmsapp/StockInScan.vue')), 'wms-app-7') },
		{ path: '/desktop/redStockInScan', component: resolve => require.ensure([], () => resolve(require('../wmsapp/RedStockInScan.vue')), 'wms-app-8') },
		{ path: '/desktop/stockOutScan', component: resolve => require.ensure([], () => resolve(require('../wmsapp/StockOutScan.vue')), 'wms-app-9') },
		{ path: '/desktop/redStockOutScan', component: resolve => require.ensure([], () => resolve(require('../wmsapp/redStockOutScan.vue')), 'wms-app-10') },
		{ path: '/desktop/printInventory', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryPrint.vue')), 'wms-app-11') },
		{ path: '/desktop/printPosition', component: resolve => require.ensure([], () => resolve(require('../wmsapp/PrintPosition.vue')), 'wms-app-12') },
		{ path: '/desktop/arrivalStockIn', component: resolve => require.ensure([], () => resolve(require('../wmsapp/ArrivalStockIn.vue')), 'wms-app-13') },
		{ path: '/desktop/materialStockOut', component: resolve => require.ensure([], () => resolve(require('../wmsapp/StockOut.vue')), 'wms-app-14') },
		{ path: '/desktop/materialPicking', component: resolve => require.ensure([], () => resolve(require('../wmsapp/MaterialPicking.vue')), 'wms-app-15') },
		{ path: '/desktop/adjustPosition', component: resolve => require.ensure([], () => resolve(require('../wmsapp/AdjustPosition.vue')), 'wms-app-16') },
		{ path: '/desktop/checkVouch', component: resolve => require.ensure([], () => resolve(require('../wmsapp/CheckVouchPage.vue')), 'wms-app-17') },
		{ path: '/desktop/currentStockQuery', component: resolve => require.ensure([], () => resolve(require('../wmsapp/CurrentStockQuery.vue')), 'wms-app-18') },
		{ path: '/desktop/purchaseOrderPrint', component: resolve => require.ensure([], () => resolve(require('../wmsapp/PurchaseOrderPrint.vue')), 'wms-app-19') },
		{ path: '/desktop/purchaseOrderReturn', component: resolve => require.ensure([], () => resolve(require('../wmsapp/PurchaseOrderReturn.vue')), 'wms-app-20') },
		{ path: '/desktop/siptStockInScan', component: resolve => require.ensure([], () => resolve(require('../wmsapp/SitpStockInScan.vue')), 'wms-app-21') },
		{ path: '/desktop/sitpStockOutScan', component: resolve => require.ensure([], () => resolve(require('../wmsapp/SitpStockOutScan.vue')), 'wms-app-22') },


		/**入库Rfid扫描 */
		{ path: '/desktop/stockInRfidScan', component: resolve => require.ensure([], () => resolve(require('../wmsapp/StockInRfidScan.vue')), 'wms-app-24') },

		/**采购入库 */
		{ path: '/desktop/PurchaseStockIn', component: resolve => require.ensure([], () => resolve(require('../wmsapp/PurchaseStockIn.vue')), 'wms-app-25') },

		/**出库Rfid扫描 */
		{ path: '/desktop/stockOutRfidScan', component: resolve => require.ensure([], () => resolve(require('../wmsapp/StockOutRfidScan.vue')), 'wms-app-26') },

		/**物料Rfid盘点 */
		{ path: '/desktop/inventoryMaterial', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryMaterial.vue')), 'wms-app-27') },

		/**物料报修 */
		{ path: '/desktop/inventoryInstanceRepair', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryInstanceRepair.vue')), 'wms-app-28') },

		/**物料报修新增 */
		{ path: '/desktop/InventoryInstanceRepairCreate', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryInstanceRepairCreate.vue')), 'wms-app-29') },

		/**物料报修编辑 */
		{ path: '/desktop/InventoryInstanceRepairUpdate', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryInstanceRepairUpdate.vue')), 'wms-app-30') },

		/**物料维修 */
		{ path: '/desktop/inventoryRepairResult', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryRepairResult.vue')), 'wms-app-31') },

		/**物料维修新增 */
		{ path: '/desktop/InventoryRepairResultCreate', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryRepairResultCreate.vue')), 'wms-app-32') },

		/**物料维修编辑 */
		{ path: '/desktop/InventoryRepairResultUpdate', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryRepairResultUpdate.vue')), 'wms-app-33') },

		/**物料保养 */
		{ path: '/desktop/inventoryInstanceMaintainLine', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryInstanceMaintainLine.vue')), 'wms-app-34') },

		/**物料保养新增 */
		{ path: '/desktop/inventoryInstanceMaintainLineCreate', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryInstanceMaintainLineCreate.vue')), 'wms-app-35') },

		/**物料保养编辑 */
		{ path: '/desktop/inventoryInstanceMaintainLineUpdate', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryInstanceMaintainLineUpdate.vue')), 'wms-app-36') },

		/**成套工具箱绑定 */
		{ path: '/desktop/inventoryInstanceBind', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryInstanceBind.vue')), 'wms-app-37') },

		/**扫描入库 */
		{ path: '/desktop/inventoryInstanceScanRack', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryInstanceScanRack.vue')), 'wms-app-38') },

		/**子件扫描入库 */
		{ path: '/desktop/inventoryInstanceScanRackByComponent', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryInstanceScanRackByComponent.vue')), 'wms-app-55') },


		/**扫描出库 */
		{ path: '/desktop/inventoryInstanceStockOut', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryInstanceStockOut.vue')), 'wms-app-39') },

		/**子件扫描出库 */
		{ path: '/desktop/inventoryInstanceStockOutByComponent', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryInstanceStockOutByComponent.vue')), 'wms-app-51') },


		/**生成项目事件检查单 */
		{ path: '/desktop/projectItemInventoryInstanceConfirm', component: resolve => require.ensure([], () => resolve(require('../wmsapp/ProjectItemInventoryInstanceConfirm.vue')), 'wms-app-40') },

		/**根据项目事件检查单进行检查 */
		{ path: '/desktop/projectItemInventoryInstanceCheck', component: resolve => require.ensure([], () => resolve(require('../wmsapp/ProjectItemInventoryInstanceCheck.vue')), 'wms-app-41') },

		/**收货确认 */
		{ path: '/desktop/pickConfirm', component: resolve => require.ensure([], () => resolve(require('../wmsapp/PickConfirm.vue')), 'wms-app-42') },

		/**物料调拨*/
		{ path: '/desktop/projectItemAdjust', component: resolve => require.ensure([], () => resolve(require('../wmsapp/projectItemAdjust.vue')), 'wms-app-43') },

		/**收货确认 */
		{ path: '/desktop/pickConfirmUpdate', component: resolve => require.ensure([], () => resolve(require('../wmsapp/PickConfirmUpdate.vue')), 'wms-app-44') },

		/**存货新增*/
		{ path: '/desktop/inventoryPrintCreat', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryPrintCreat.vue')), 'wms-app-45') },

		/**存货编辑 */
		{ path: '/desktop/inventoryPrintUpdate', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryPrintUpdate.vue')), 'wms-app-46') },

		/**存货编辑 */
		{ path: '/desktop/setting', component: resolve => require.ensure([], () => resolve(require('../system/Setting.vue')), 'wms-app-202003201651') },

		/**货位新增*/
		{ path: '/desktop/positionCreat', component: resolve => require.ensure([], () => resolve(require('../wmsapp/PositionCreat.vue')), 'wms-app-47') },

		/**仓库编辑 */
		{ path: '/desktop/warehouseCreat', component: resolve => require.ensure([], () => resolve(require('../wmsapp/WarehouseCreat.vue')), 'wms-app-48') },

		/**西门子物料盘点*/
		{ path: '/desktop/siemensCheckVouch', component: resolve => require.ensure([], () => resolve(require('../wmsapp/SiemensCheckVouch.vue')), 'wms-app-49') },

		{ path: '/desktop/instanceBindBom', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InstanceBindBom.vue')), 'wms-app-50') },
		{ path: '*', component: resolve => require.ensure([], () => resolve(require('../menu/NotFound.vue')), 'wms-app-404') },

		{ path: '/test/test', component: resolve => require.ensure([], () => resolve(require('../test/test.vue')), 'wms-app-405') },
		/**搜索物料*/
		{ path: '/desktop/searchMateriel', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InventoryInstanceSearch.vue')), 'wms-app-51') },
		/**条码分解*/
		{ path: '/desktop/instanceSeparate', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InstanceSeparate.vue')), 'wms-app-53') },
		/**发货绑定*/
		{ path: '/desktop/invoiceBind', component: resolve => require.ensure([], () => resolve(require('../wmsapp/InvoiceBind.vue')), 'wms-app-52') },

		/**项目检查单明细*/
		{ path: '/desktop/projectItemInventoryInstanceCheckInfo', component: resolve => require.ensure([], () => resolve(require('../wmsapp/ProjectItemInventoryInstanceCheckInfo.vue')), 'wms-app-54') },

		/**扫码出库*/
		{ path: '/desktop/scanBarCode', component: resolve => require.ensure([], () => resolve(require('../wmsapp/ScanBarCode.vue')), 'wms-app-55') }
	]
}
