"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertBigInts = void 0;
const convertBigInts = (obj) => {
    if (Array.isArray(obj)) {
        return obj.map(exports.convertBigInts);
    }
    else if (typeof obj === "object" && obj !== null) {
        const newObj = {};
        for (const key in obj) {
            const value = obj[key];
            newObj[key] =
                typeof value === "bigint" ? value.toString() : (0, exports.convertBigInts)(value);
        }
        return newObj;
    }
    return obj;
};
exports.convertBigInts = convertBigInts;
//# sourceMappingURL=convertBigInts.js.map