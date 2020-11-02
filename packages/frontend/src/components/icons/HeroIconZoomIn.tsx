import React, { SVGAttributes } from 'react';

function HeroIconZoomIn(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M16.32 14.9l5.39 5.4a1 1 0 01-1.42 1.4l-5.38-5.38a8 8 0 111.41-1.41zM10 16a6 6 0 100-12 6 6 0 000 12zm1-7h2a1 1 0 010 2h-2v2a1 1 0 01-2 0v-2H7a1 1 0 010-2h2V7a1 1 0 112 0v2z"></path>
    </svg>
  );
}

export default HeroIconZoomIn;
