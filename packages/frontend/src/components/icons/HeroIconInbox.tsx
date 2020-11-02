import React, { SVGAttributes } from 'react';

function HeroIconInbox(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5c0-1.1.9-2 2-2zm0 10v6h14v-6h-2.38l-1.45 2.9a2 2 0 01-1.79 1.1h-2.76a2 2 0 01-1.8-1.1L7.39 13H5zm14-2V5H5v6h2.38a2 2 0 011.8 1.1l1.44 2.9h2.76l1.45-2.9a2 2 0 011.79-1.1H19z"></path>
    </svg>
  );
}

export default HeroIconInbox;
