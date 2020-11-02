import { useLocation } from 'react-router-dom';

export const useSearchParams = <P extends {}>(): P | null => {
  const { search } = useLocation();
  return getSearchParams(search);
};

export const getSearchParams = <P extends {}>(search: string): P | null => {
  try {
    let obj: any = {};
    const queryParams = new URLSearchParams(search);
    Array.from(queryParams.keys()).forEach((key) => {
      obj[key] = queryParams.get(key);
    });
    return obj;
  } catch (e) {
    console.log('Something went wrong in getSearchParams', e);
    return null;
  }
};
