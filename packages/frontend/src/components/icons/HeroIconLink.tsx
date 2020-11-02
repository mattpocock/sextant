import React, { SVGAttributes } from 'react';

function HeroIconLink(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M19.48 13.03A4 4 0 0116 19h-4a4 4 0 110-8h1a1 1 0 000-2h-1a6 6 0 100 12h4a6 6 0 005.21-8.98L21.2 12a1 1 0 10-1.72 1.03zM4.52 10.97A4 4 0 018 5h4a4 4 0 110 8h-1a1 1 0 000 2h1a6 6 0 100-12H8a6 6 0 00-5.21 8.98l.01.02a1 1 0 101.72-1.03z"></path>
    </svg>
  );
}

export default HeroIconLink;
