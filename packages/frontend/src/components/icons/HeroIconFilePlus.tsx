import React, { SVGAttributes } from 'react';

function HeroIconFilePlus(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M6 2h9a1 1 0 01.7.3l4 4a1 1 0 01.3.7v13a2 2 0 01-2 2H6a2 2 0 01-2-2V4c0-1.1.9-2 2-2zm9 2.41V7h2.59L15 4.41zM18 9h-3a2 2 0 01-2-2V4H6v16h12V9zm-5 4h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2H9a1 1 0 010-2h2v-2a1 1 0 012 0v2z"></path>
    </svg>
  );
}

export default HeroIconFilePlus;
