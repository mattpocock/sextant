import React, { SVGAttributes } from 'react';

function HeroIconBookmark(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M12 18.62l-6.55 3.27A1 1 0 014 21V4c0-1.1.9-2 2-2h12a2 2 0 012 2v17a1 1 0 01-1.45.9L12 18.61zM18 4H6v15.38l5.55-2.77a1 1 0 01.9 0L18 19.38V4z"></path>
    </svg>
  );
}

export default HeroIconBookmark;
