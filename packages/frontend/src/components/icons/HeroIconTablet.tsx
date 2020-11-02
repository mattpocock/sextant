import React, { SVGAttributes } from 'react';

function HeroIconTablet(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4c0-1.1.9-2 2-2zm0 2v16h12V4H6zm6 14a1 1 0 110-2 1 1 0 010 2z"></path>
    </svg>
  );
}

export default HeroIconTablet;
