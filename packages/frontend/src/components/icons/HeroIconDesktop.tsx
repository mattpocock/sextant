import React, { SVGAttributes } from 'react';

function HeroIconDesktop(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M13 17h-2v2h2v-2zm2 0v2h2a1 1 0 010 2H7a1 1 0 010-2h2v-2H4a2 2 0 01-2-2V5c0-1.1.9-2 2-2h16a2 2 0 012 2v10a2 2 0 01-2 2h-5zM4 5v10h16V5H4z"></path>
    </svg>
  );
}

export default HeroIconDesktop;
