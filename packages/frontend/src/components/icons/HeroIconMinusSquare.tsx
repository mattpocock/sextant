import React, { SVGAttributes } from 'react';

function HeroIconMinusSquare(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5c0-1.1.9-2 2-2zm0 2v14h14V5H5zm11 7a1 1 0 01-1 1H9a1 1 0 010-2h6a1 1 0 011 1z"></path>
    </svg>
  );
}

export default HeroIconMinusSquare;
