"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressRoutes = void 0;
const base_route_1 = require("./base_route");
const resolver_1 = require("../di/resolver");
class AddressRoutes extends base_route_1.BaseRoute {
    constructor() {
        super();
    }
    initializeRoutes() {
        this.router
            .get('/me', (req, res) => {
            resolver_1.addressController.getAddress(req, res);
        })
            .post('/', (req, res) => {
            resolver_1.addressController.addAddress(req, res);
        })
            .get('/:addressId', (req, res) => {
            resolver_1.addressController.getSingleAddress(req, res);
        })
            .patch('/:addressId', (req, res) => {
            resolver_1.addressController.editAddress(req, res);
        })
            .patch('/:addressId/default', (req, res) => {
            resolver_1.addressController.setDefaultAddress(req, res);
        })
            .delete('/:addressId', (req, res) => {
            resolver_1.addressController.deleteAddress(req, res);
        });
    }
}
exports.AddressRoutes = AddressRoutes;
