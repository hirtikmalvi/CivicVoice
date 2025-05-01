import { complaint_category } from '@prisma/client';

export const getComplaintCategoryLabels = (): { value: string; label: string }[] => {
    return Object.values(complaint_category).map(value => ({
        value,
        label: value
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase()),
    }));
};
