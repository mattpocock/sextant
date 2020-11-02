import React, { SVGAttributes } from 'react';

function HeroIconMinus(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M17 11a1 1 0 010 2H7a1 1 0 010-2h10z"></path>
    </svg>
  );
}

export default HeroIconMinus;
