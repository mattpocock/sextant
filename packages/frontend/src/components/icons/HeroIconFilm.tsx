import React, { SVGAttributes } from 'react';

function HeroIconFilm(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5c0-1.1.9-2 2-2zm14 12v-2h-2v2h2zm0 2h-2v2h2v-2zM5 15h2v-2H5v2zm0 2v2h2v-2H5zm14-8h-2v2h2V9zm0-2V5h-2v2h2zM5 9v2h2V9H5zm0-2h2V5H5v2zm4 4h6V5H9v6zm0 2v6h6v-6H9z"></path>
    </svg>
  );
}

export default HeroIconFilm;
