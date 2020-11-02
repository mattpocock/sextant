import React, { SVGAttributes } from 'react';

function HeroIconFlag(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M4 16v5a1 1 0 01-2 0V3a1 1 0 011-1h8.5a1 1 0 01.7.3l.71.7H21a1 1 0 01.9 1.45L19.11 10l2.77 5.55A1 1 0 0121 17h-8.5a1 1 0 01-.7-.3l-.71-.7H4zm7-12H4v10h7.5a1 1 0 01.7.3l.71.7h6.47l-2.27-4.55a1 1 0 010-.9L19.38 5H13v4a1 1 0 01-2 0V4z"></path>
    </svg>
  );
}

export default HeroIconFlag;
