import React, { SVGAttributes } from 'react';

function HeroIconBuilding(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M19 10v6a2 2 0 012 2v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2c0-1.1.9-2 2-2v-6a2 2 0 01-2-2V7a1 1 0 01.55-.9l8-4a1 1 0 01.9 0l8 4A1 1 0 0121 7v1a2 2 0 01-2 2zm-6 0h-2v6h2v-6zm4 0h-2v6h2v-6zm-8 0H7v6h2v-6zM5 7.62V8h14v-.38l-7-3.5-7 3.5zM5 18v2h14v-2H5z"></path>
    </svg>
  );
}

export default HeroIconBuilding;
