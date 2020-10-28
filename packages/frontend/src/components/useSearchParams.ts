import { useLocation } from "react-router-dom";

export const useSearchParams = <P extends {}>(): P | null => {
  const { search } = useLocation();
  try {
    let obj: any = {};
    const queryParams = new URLSearchParams(search);
    Array.from(queryParams.keys()).forEach((key) => {
      obj[key] = queryParams.get(key);
    });
    return obj;
  } catch (e) {
    console.log("Something went wrong in useSearchParams", e);
    return null;
  }
};
