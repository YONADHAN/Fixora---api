"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShedulerRegistry = void 0;
const tsyringe_1 = require("tsyringe");
const expire_booking_holds_usecase_1 = require("../../application/usecase/booking_hold/expire_booking_holds_usecase");
class ShedulerRegistry {
    static registerSheduler() {
        tsyringe_1.container.register('IExpireBookingHoldsUseCase', {
            useClass: expire_booking_holds_usecase_1.ExpireBookingHoldsUseCase,
        });
    }
}
exports.ShedulerRegistry = ShedulerRegistry;
