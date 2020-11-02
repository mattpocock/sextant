import React, { SVGAttributes } from 'react';

function HeroIconCheckCircle(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M12 22a10 10 0 110-20 10 10 0 010 20zm0-2a8 8 0 100-16 8 8 0 000 16zm-2.3-8.7l1.3 1.29 3.3-3.3a1 1 0 011.4 1.42l-4 4a1 1 0 01-1.4 0l-2-2a1 1 0 011.4-1.42z"></path>
    </svg>
  );
}

export default HeroIconCheckCircle;
