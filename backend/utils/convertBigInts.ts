
export const convertBigInts = (obj: any): any => {
    if (Array.isArray(obj)) {
      return obj.map(convertBigInts);
    } else if (typeof obj === "object" && obj !== null) {
      const newObj: any = {};
      for (const key in obj) {
        const value = obj[key];
        newObj[key] =
          typeof value === "bigint" ? value.toString() : convertBigInts(value);
      }
      return newObj;
    }
    return obj;
  };
  