import React, { SVGAttributes } from 'react';

function HeroIconChat(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M6 14H4a2 2 0 01-2-2V4c0-1.1.9-2 2-2h12a2 2 0 012 2v2h2a2 2 0 012 2v13a1 1 0 01-1.7.7L16.58 18H8a2 2 0 01-2-2v-2zm0-2V8c0-1.1.9-2 2-2h8V4H4v8h2zm14-4H8v8h9a1 1 0 01.7.3l2.3 2.29V8z"></path>
    </svg>
  );
}

export default HeroIconChat;
