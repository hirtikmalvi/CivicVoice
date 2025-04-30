
import { department_type, complaint } from "@prisma/client";
import bigInt, { BigInteger } from "big-integer";

type ComplaintWithBigInteger = Omit<complaint, "complaint_id" | "citizen_id" | "authority_id"> & {
  complaint_id: BigInteger;
  citizen_id: BigInteger;
  authority_id: BigInteger;
};

export const convertDepartmentMapToBigInteger = (
  departmentMap: Record<department_type, complaint[]>
): Record<department_type, ComplaintWithBigInteger[]> => {
  const converted: Record<department_type, ComplaintWithBigInteger[]> = {} as any;

  for (const department in departmentMap) {
    const complaints = departmentMap[department as department_type].map((complaint) => {
      return {
        ...complaint,
        complaint_id: bigInt(complaint.complaint_id.toString()),
        citizen_id: bigInt(complaint.citizen_id.toString()),
        authority_id: bigInt(complaint.authority_id.toString()),
      };
    });

    converted[department as department_type] = complaints;
  }

  return converted;
};
