import React, { SVGAttributes } from 'react';

function HeroIconX(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M16.24 14.83a1 1 0 01-1.41 1.41L12 13.41l-2.83 2.83a1 1 0 01-1.41-1.41L10.59 12 7.76 9.17a1 1 0 011.41-1.41L12 10.59l2.83-2.83a1 1 0 011.41 1.41L13.41 12l2.83 2.83z"></path>
    </svg>
  );
}

export default HeroIconX;
