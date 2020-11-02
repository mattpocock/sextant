import React, { SVGAttributes } from 'react';

function HeroIconMap(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M14 5.62l-4 2v10.76l4-2V5.62zm2 0v10.76l4 2V7.62l-4-2zm-8 2l-4-2v10.76l4 2V7.62zm7 10.5L9.45 20.9a1 1 0 01-.9 0l-6-3A1 1 0 012 17V4a1 1 0 011.45-.9L9 5.89l5.55-2.77a1 1 0 01.9 0l6 3A1 1 0 0122 7v13a1 1 0 01-1.45.89L15 18.12z"></path>
    </svg>
  );
}

export default HeroIconMap;
