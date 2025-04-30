import { department_type } from "@prisma/client";

export const getDepartmentTypeLabels = (): { value: department_type; label: string }[] => {
  return Object.values(department_type).map((value) => ({
    value,
    label: value
      .replace(/___/g, ' & ')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase()),
  }));
};
