"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertDepartmentMapToBigInteger = void 0;
const big_integer_1 = __importDefault(require("big-integer"));
const convertDepartmentMapToBigInteger = (departmentMap) => {
    const converted = {};
    for (const department in departmentMap) {
        const complaints = departmentMap[department].map((complaint) => {
            return Object.assign(Object.assign({}, complaint), { complaint_id: (0, big_integer_1.default)(complaint.complaint_id.toString()), citizen_id: (0, big_integer_1.default)(complaint.citizen_id.toString()), authority_id: (0, big_integer_1.default)(complaint.authority_id.toString()) });
        });
        converted[department] = complaints;
    }
    return converted;
};
exports.convertDepartmentMapToBigInteger = convertDepartmentMapToBigInteger;
//# sourceMappingURL=convertDepartmentMapToBigInteger.js.map