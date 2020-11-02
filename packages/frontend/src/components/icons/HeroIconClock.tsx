import React, { SVGAttributes } from 'react';

function HeroIconClock(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M12 22a10 10 0 110-20 10 10 0 010 20zm0-2a8 8 0 100-16 8 8 0 000 16zm1-8.41l2.54 2.53a1 1 0 01-1.42 1.42L11.3 12.7a1 1 0 01-.3-.7V8a1 1 0 012 0v3.59z"></path>
    </svg>
  );
}

export default HeroIconClock;
