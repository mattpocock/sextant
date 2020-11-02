import React, { SVGAttributes } from 'react';

function HeroIconArchive(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M20 9v10a2 2 0 01-2 2H6a2 2 0 01-2-2V9a2 2 0 01-2-2V5c0-1.1.9-2 2-2h16a2 2 0 012 2v2a2 2 0 01-2 2zm0-2V5H4v2h16zM6 9v10h12V9H6zm4 2h4a1 1 0 010 2h-4a1 1 0 010-2z"></path>
    </svg>
  );
}

export default HeroIconArchive;
