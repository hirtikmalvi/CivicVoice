"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComplaintCategoryLabels = void 0;
const client_1 = require("@prisma/client");
const getComplaintCategoryLabels = () => {
    return Object.values(client_1.complaint_category).map(value => ({
        value,
        label: value
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase()),
    }));
};
exports.getComplaintCategoryLabels = getComplaintCategoryLabels;
//# sourceMappingURL=getEnumValues.js.map