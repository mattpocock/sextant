import React, { SVGAttributes } from 'react';

function HeroIconLockClosed(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M7 10V7a5 5 0 1110 0v3h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8c0-1.1.9-2 2-2h2zm2 0h6V7a3 3 0 00-6 0v3zm-4 2v8h14v-8H5zm7 2a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1z"></path>
    </svg>
  );
}

export default HeroIconLockClosed;
