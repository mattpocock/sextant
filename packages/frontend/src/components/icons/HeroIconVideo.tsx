import React, { SVGAttributes } from 'react';

function HeroIconVideo(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M16 8.38l4.55-2.27A1 1 0 0122 7v10a1 1 0 01-1.45.9L16 15.61V17a2 2 0 01-2 2H4a2 2 0 01-2-2V7c0-1.1.9-2 2-2h10a2 2 0 012 2v1.38zm0 2.24v2.76l4 2V8.62l-4 2zM14 17V7H4v10h10z"></path>
    </svg>
  );
}

export default HeroIconVideo;
