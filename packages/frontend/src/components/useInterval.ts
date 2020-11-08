import { useEffect, useRef } from 'react';

/**
 * A declarative way to use an interval
 *
 * Usage:
 *
 * useInterval(() => {
 *   console.log('Hey! ' + name)
 * }, 500, [name])
 */
export const useInterval = (
  func: () => void,
  interval: number,
  deps: any[],
) => {
  const intervalRef = useRef<any>();
  useEffect(() => {
    intervalRef.current = setInterval(func, interval);
    return () => {
      clearInterval(intervalRef.current);
    };
  }, deps);
};
