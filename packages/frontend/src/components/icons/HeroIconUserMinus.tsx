import React, { SVGAttributes } from 'react';

function HeroIconUserMinus(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M9 12A5 5 0 119 2a5 5 0 010 10zm0-2a3 3 0 100-6 3 3 0 000 6zm8 11a1 1 0 01-2 0v-2a3 3 0 00-3-3H7a3 3 0 00-3 3v2a1 1 0 01-2 0v-2a5 5 0 015-5h5a5 5 0 015 5v2zm5-10a1 1 0 01-1 1h-6a1 1 0 010-2h6a1 1 0 011 1z"></path>
    </svg>
  );
}

export default HeroIconUserMinus;
