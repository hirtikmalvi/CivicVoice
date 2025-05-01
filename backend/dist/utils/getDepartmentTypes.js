"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDepartmentTypeLabels = void 0;
const client_1 = require("@prisma/client");
const getDepartmentTypeLabels = () => {
    return Object.values(client_1.department_type).map((value) => ({
        value,
        label: value
            .replace(/___/g, ' & ')
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase()),
    }));
};
exports.getDepartmentTypeLabels = getDepartmentTypeLabels;
//# sourceMappingURL=getDepartmentTypes.js.map