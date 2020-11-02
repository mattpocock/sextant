import React, { SVGAttributes } from 'react';

function HeroIconXCircle(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M4.93 19.07A10 10 0 1119.07 4.93 10 10 0 014.93 19.07zm1.41-1.41A8 8 0 1017.66 6.34 8 8 0 006.34 17.66zM13.41 12l1.42 1.41a1 1 0 11-1.42 1.42L12 13.4l-1.41 1.42a1 1 0 11-1.42-1.42L10.6 12l-1.42-1.41a1 1 0 111.42-1.42L12 10.6l1.41-1.42a1 1 0 111.42 1.42L13.4 12z"></path>
    </svg>
  );
}

export default HeroIconXCircle;
