import React, { SVGAttributes } from 'react';

function HeroIconArrowDown(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M11 18.59V3a1 1 0 012 0v15.59l5.3-5.3a1 1 0 011.4 1.42l-7 7a1 1 0 01-1.4 0l-7-7a1 1 0 011.4-1.42l5.3 5.3z"></path>
    </svg>
  );
}

export default HeroIconArrowDown;
