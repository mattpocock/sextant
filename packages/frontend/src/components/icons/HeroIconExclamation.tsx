import React, { SVGAttributes } from 'react';

function HeroIconExclamation(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M12 2a10 10 0 110 20 10 10 0 010-20zm0 2a8 8 0 100 16 8 8 0 000-16zm0 9a1 1 0 01-1-1V8a1 1 0 012 0v4a1 1 0 01-1 1zm0 4a1 1 0 110-2 1 1 0 010 2z"></path>
    </svg>
  );
}

export default HeroIconExclamation;
