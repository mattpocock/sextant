import React, { SVGAttributes } from 'react';

function HeroIconPrint(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M18 18v2a2 2 0 01-2 2H8a2 2 0 01-2-2v-2H4a2 2 0 01-2-2v-6c0-1.1.9-2 2-2h2V4c0-1.1.9-2 2-2h8a2 2 0 012 2v4h2a2 2 0 012 2v6a2 2 0 01-2 2h-2zm0-2h2v-6H4v6h2v-2c0-1.1.9-2 2-2h8a2 2 0 012 2v2zm-2-8V4H8v4h8zm-8 6v6h8v-6H8z"></path>
    </svg>
  );
}

export default HeroIconPrint;
