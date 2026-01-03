"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingServices = void 0;
const custom_error_1 = require("../../domain/utils/custom.error");
const tsyringe_1 = require("tsyringe");
let BookingServices = class BookingServices {
    constructor() {
        this.validationChecker = (service) => {
            if (!service) {
                throw new custom_error_1.CustomError('Service not found', 404);
            }
            if (!service.isActiveStatusByAdmin || !service.isActiveStatusByVendor) {
                throw new custom_error_1.CustomError('Service is not active', 403);
            }
            if (!service.schedule.slotDurationMinutes) {
                throw new custom_error_1.CustomError('Slot duration not configured', 400);
            }
            if (!service.schedule.dailyWorkingWindows ||
                service.schedule.dailyWorkingWindows.length === 0) {
                throw new custom_error_1.CustomError('Daily working windows not configured', 400);
            }
        };
        this.showAvailableSlotsForCustomers = (service, month, year, bookedSlots) => __awaiter(this, void 0, void 0, function* () {
            this.validationChecker(service);
            let timeline = {};
            timeline = this.buildDateRange(timeline, service, month, year);
            timeline = this.applyRecurrence(timeline, service);
            timeline = this.buildBaseWindows(timeline, service);
            timeline = this.applyCustomOverrides(timeline, service);
            timeline = this.applyBlockOverrides(timeline, service);
            timeline = this.removeBookedSlots(timeline, bookedSlots);
            timeline = yield this.removeHeldSlots(timeline, service);
            return this.sliceIntoSlots(timeline, service.schedule.slotDurationMinutes);
        });
        this.buildDateRange = (timeline, service, month, year) => {
            const monthStart = this.createLocalDate(year, month, 1);
            const monthEnd = this.createLocalDate(year, month + 1, 0);
            let start = monthStart;
            if (service.schedule.visibilityStartDate) {
                const visStart = this.toLocalMidnight(service.schedule.visibilityStartDate);
                if (visStart.getTime() > monthStart.getTime()) {
                    start = visStart;
                }
            }
            let end = monthEnd;
            if (service.schedule.visibilityEndDate) {
                const visEnd = this.toLocalMidnight(service.schedule.visibilityEndDate);
                if (visEnd.getTime() < monthEnd.getTime()) {
                    end = visEnd;
                }
            }
            const current = this.createLocalDate(start.getFullYear(), start.getMonth(), start.getDate());
            while (current <= end) {
                const key = this.toLocalDateKey(current);
                timeline[key] = [];
                current.setDate(current.getDate() + 1);
            }
            return timeline;
        };
        this.applyRecurrence = (timeline, service) => {
            const { recurrenceType, weeklyWorkingDays, monthlyWorkingDates } = service.schedule;
            for (const dateKey of Object.keys(timeline)) {
                const [y, m, d] = dateKey.split('-').map(Number);
                const date = this.createLocalDate(y, m - 1, d);
                if (recurrenceType === 'weekly' &&
                    Array.isArray(weeklyWorkingDays) &&
                    !weeklyWorkingDays.includes(date.getDay())) {
                    delete timeline[dateKey];
                    continue;
                }
                if (recurrenceType === 'monthly' &&
                    Array.isArray(monthlyWorkingDates) &&
                    !monthlyWorkingDates.includes(date.getDate())) {
                    delete timeline[dateKey];
                }
            }
            return timeline;
        };
        this.buildBaseWindows = (timeline, service) => {
            for (const dateKey of Object.keys(timeline)) {
                const [y, m, d] = dateKey.split('-').map(Number);
                const date = this.createLocalDate(y, m - 1, d);
                timeline[dateKey] = service.schedule.dailyWorkingWindows.map((w) => {
                    const [sh, sm] = w.startTime.split(':').map(Number);
                    const [eh, em] = w.endTime.split(':').map(Number);
                    const start = this.createLocalDate(date.getFullYear(), date.getMonth(), date.getDate(), sh, sm);
                    const end = this.createLocalDate(date.getFullYear(), date.getMonth(), date.getDate(), eh, em);
                    return { start, end };
                });
            }
            return timeline;
        };
        this.applyCustomOverrides = (timeline, service) => {
            const overrides = service.schedule.overrideCustom || [];
            const overriddenDates = new Set();
            for (const o of overrides) {
                const overrideStart = this.toLocalMidnight(o.startDateTime);
                const overrideEnd = this.toLocalMidnight(o.endDateTime);
                const current = this.createLocalDate(overrideStart.getFullYear(), overrideStart.getMonth(), overrideStart.getDate());
                while (current <= overrideEnd) {
                    const key = this.toLocalDateKey(current);
                    if (!timeline[key]) {
                        current.setDate(current.getDate() + 1);
                        continue;
                    }
                    if (!overriddenDates.has(key)) {
                        timeline[key] = [];
                        overriddenDates.add(key);
                    }
                    let start;
                    let end;
                    if (o.startTime && o.endTime) {
                        const [sh, sm] = o.startTime.split(':').map(Number);
                        const [eh, em] = o.endTime.split(':').map(Number);
                        start = this.createLocalDate(current.getFullYear(), current.getMonth(), current.getDate(), sh, sm);
                        end = this.createLocalDate(current.getFullYear(), current.getMonth(), current.getDate(), eh, em);
                    }
                    else {
                        const startDT = new Date(o.startDateTime);
                        const endDT = new Date(o.endDateTime);
                        start = this.createLocalDate(current.getFullYear(), current.getMonth(), current.getDate(), startDT.getHours(), startDT.getMinutes());
                        end = this.createLocalDate(current.getFullYear(), current.getMonth(), current.getDate(), endDT.getHours(), endDT.getMinutes());
                    }
                    timeline[key].push({ start, end });
                    current.setDate(current.getDate() + 1);
                }
            }
            return timeline;
        };
        this.applyBlockOverrides = (timeline, service) => {
            const blocks = service.schedule.overrideBlock || [];
            for (const block of blocks) {
                const blockStart = new Date(block.startDateTime);
                const blockEnd = new Date(block.endDateTime);
                const key = this.toLocalDateKey(blockStart);
                if (!timeline[key])
                    continue;
                const localBlockStart = this.createLocalDate(blockStart.getFullYear(), blockStart.getMonth(), blockStart.getDate(), blockStart.getHours(), blockStart.getMinutes());
                const localBlockEnd = this.createLocalDate(blockEnd.getFullYear(), blockEnd.getMonth(), blockEnd.getDate(), blockEnd.getHours(), blockEnd.getMinutes());
                timeline[key] = this.subtractRange(timeline[key], localBlockStart, localBlockEnd);
            }
            return timeline;
        };
        this.removeBookedSlots = (timeline, bookedSlots) => {
            for (const booking of bookedSlots) {
                if (!booking.slotStart || !booking.slotEnd)
                    continue;
                const slotStart = new Date(booking.slotStart);
                const slotEnd = new Date(booking.slotEnd);
                const dateKey = this.toLocalDateKey(slotStart);
                if (!timeline[dateKey])
                    continue;
                const localSlotStart = this.createLocalDate(slotStart.getFullYear(), slotStart.getMonth(), slotStart.getDate(), slotStart.getHours(), slotStart.getMinutes());
                const localSlotEnd = this.createLocalDate(slotEnd.getFullYear(), slotEnd.getMonth(), slotEnd.getDate(), slotEnd.getHours(), slotEnd.getMinutes());
                timeline[dateKey] = this.subtractRange(timeline[dateKey], localSlotStart, localSlotEnd);
            }
            return timeline;
        };
        this.removeHeldSlots = (timeline, service) => __awaiter(this, void 0, void 0, function* () {
            // Redis
            return timeline;
        });
        this.subtractRange = (windows, removeStart, removeEnd) => {
            const result = [];
            for (const w of windows) {
                if (removeEnd <= w.start || removeStart >= w.end) {
                    result.push(w);
                    continue;
                }
                if (removeStart > w.start) {
                    result.push({ start: w.start, end: new Date(removeStart) });
                }
                if (removeEnd < w.end) {
                    result.push({ start: new Date(removeEnd), end: w.end });
                }
            }
            return result;
        };
        this.sliceIntoSlots = (timeline, slotDurationMinutes) => {
            const result = {};
            for (const date in timeline) {
                const slots = [];
                for (const window of timeline[date]) {
                    let cursor = new Date(window.start);
                    while (cursor.getTime() + slotDurationMinutes * 60000 <=
                        window.end.getTime()) {
                        const slotStart = new Date(cursor);
                        const slotEnd = new Date(cursor.getTime() + slotDurationMinutes * 60000);
                        const pad = (n) => n.toString().padStart(2, '0');
                        slots.push({
                            start: `${pad(slotStart.getHours())}:${pad(slotStart.getMinutes())}`,
                            end: `${pad(slotEnd.getHours())}:${pad(slotEnd.getMinutes())}`,
                        });
                        cursor = slotEnd;
                    }
                }
                if (slots.length > 0) {
                    result[date] = slots;
                }
            }
            return result;
        };
    }
    // create date in local time
    createLocalDate(year, month, day, hours = 0, minutes = 0) {
        return new Date(year, month, day, hours, minutes, 0, 0);
    }
    toLocalMidnight(date) {
        return this.createLocalDate(date.getFullYear(), date.getMonth(), date.getDate());
    }
    toLocalDateKey(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }
};
exports.BookingServices = BookingServices;
exports.BookingServices = BookingServices = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], BookingServices);
