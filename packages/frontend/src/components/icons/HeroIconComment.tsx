import React, { SVGAttributes } from 'react';

function HeroIconComment(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M2 15V5c0-1.1.9-2 2-2h16a2 2 0 012 2v15a1 1 0 01-1.7.7L16.58 17H4a2 2 0 01-2-2zM20 5H4v10h13a1 1 0 01.7.3l2.3 2.29V5z"></path>
    </svg>
  );
}

export default HeroIconComment;
