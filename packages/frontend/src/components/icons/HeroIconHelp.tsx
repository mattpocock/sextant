import React, { SVGAttributes } from 'react';

function HeroIconHelp(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M12 22a10 10 0 110-20 10 10 0 010 20zm0-2a8 8 0 100-16 8 8 0 000 16zM10.59 8.59a1 1 0 11-1.42-1.42 4 4 0 115.66 5.66l-2.12 2.12a1 1 0 11-1.42-1.42l2.12-2.12A2 2 0 0010.6 8.6zM12 18a1 1 0 110-2 1 1 0 010 2z"></path>
    </svg>
  );
}

export default HeroIconHelp;
