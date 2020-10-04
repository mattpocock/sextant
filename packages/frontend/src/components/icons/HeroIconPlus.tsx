import React, { SVGAttributes } from 'react';

function HeroIconPlus(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M17 11a1 1 0 010 2h-4v4a1 1 0 01-2 0v-4H7a1 1 0 010-2h4V7a1 1 0 012 0v4h4z"></path>
    </svg>
  );
}

export default HeroIconPlus;
