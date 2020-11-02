import React, { SVGAttributes } from 'react';

function HeroIconMicrophone(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M13 18.94V21h3a1 1 0 010 2H8a1 1 0 010-2h3v-2.06A8 8 0 014 11a1 1 0 012 0 6 6 0 1012 0 1 1 0 012 0 8 8 0 01-7 7.94zM12 1a4 4 0 014 4v6a4 4 0 11-8 0V5a4 4 0 014-4zm0 2a2 2 0 00-2 2v6a2 2 0 104 0V5a2 2 0 00-2-2z"></path>
    </svg>
  );
}

export default HeroIconMicrophone;
