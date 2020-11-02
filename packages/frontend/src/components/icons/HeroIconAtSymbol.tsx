import React, { SVGAttributes } from 'react';

function HeroIconAtSymbol(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M15.6 15.47A4.99 4.99 0 017 12a5 5 0 0110 0v1.5a1.5 1.5 0 103 0V12a8 8 0 10-4.94 7.4 1 1 0 11.77 1.84A10 10 0 1122 12v1.5a3.5 3.5 0 01-6.4 1.97zM12 15a3 3 0 100-6 3 3 0 000 6z"></path>
    </svg>
  );
}

export default HeroIconAtSymbol;
