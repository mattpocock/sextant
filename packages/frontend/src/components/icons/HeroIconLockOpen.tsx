import React, { SVGAttributes } from 'react';

function HeroIconLockOpen(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M9 10h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8c0-1.1.9-2 2-2h2V7a5 5 0 1110 0 1 1 0 01-2 0 3 3 0 00-6 0v3zm-4 2v8h14v-8H5zm7 2a1 1 0 011 1v2a1 1 0 01-2 0v-2a1 1 0 011-1z"></path>
    </svg>
  );
}

export default HeroIconLockOpen;
