"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateBookingHoldRequestSchema = exports.CreateBookingHoldBasicSchema = void 0;
const zod_1 = require("zod");
exports.CreateBookingHoldBasicSchema = zod_1.z.object({
    serviceId: zod_1.z.string().min(1),
    paymentMethod: zod_1.z.literal('stripe'),
    slots: zod_1.z.array(zod_1.z.object({
        date: zod_1.z.string().min(1),
        start: zod_1.z.string().min(1),
        end: zod_1.z.string().min(1),
        pricePerSlot: zod_1.z.number(),
        advancePerSlot: zod_1.z.number(),
        variant: zod_1.z
            .object({
            name: zod_1.z.string().optional(),
            price: zod_1.z.number().optional(),
        })
            .optional(),
    })),
});
exports.CreateBookingHoldRequestSchema = zod_1.z
    .object({
    serviceId: zod_1.z.string().min(1),
    paymentMethod: zod_1.z.literal('stripe'),
    slots: zod_1.z
        .array(zod_1.z.object({
        date: zod_1.z.string().min(1),
        start: zod_1.z.string().min(1),
        end: zod_1.z.string().min(1),
        pricePerSlot: zod_1.z.number().min(0),
        advancePerSlot: zod_1.z.number().min(0),
        variant: zod_1.z
            .object({
            name: zod_1.z.string().optional(),
            price: zod_1.z.number().min(0).optional(),
        })
            .optional(),
    }))
        .min(1),
})
    .superRefine((data, ctx) => {
    data.slots.forEach((slot, index) => {
        if (slot.advancePerSlot > slot.pricePerSlot) {
            ctx.addIssue({
                code: zod_1.z.ZodIssueCode.custom,
                path: ['slots', index, 'advancePerSlot'],
                message: 'Advance cannot be greater than price',
            });
        }
    });
});
