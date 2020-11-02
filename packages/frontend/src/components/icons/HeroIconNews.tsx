import React, { SVGAttributes } from 'react';

function HeroIconNews(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M18 21H7a4 4 0 01-4-4V5c0-1.1.9-2 2-2h10a2 2 0 012 2h2a2 2 0 012 2v11a3 3 0 01-3 3zm-3-3V5H5v12c0 1.1.9 2 2 2h8.17a3 3 0 01-.17-1zm-7-3h4a1 1 0 010 2H8a1 1 0 010-2zm0-4h4a1 1 0 010 2H8a1 1 0 010-2zm0-4h4a1 1 0 010 2H8a1 1 0 110-2zm9 11a1 1 0 002 0V7h-2v11z"></path>
    </svg>
  );
}

export default HeroIconNews;
