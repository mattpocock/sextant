import React, { SVGAttributes } from 'react';

function HeroIconArrowUp(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M13 5.41V21a1 1 0 01-2 0V5.41l-5.3 5.3a1 1 0 11-1.4-1.42l7-7a1 1 0 011.4 0l7 7a1 1 0 11-1.4 1.42L13 5.4z"></path>
    </svg>
  );
}

export default HeroIconArrowUp;
