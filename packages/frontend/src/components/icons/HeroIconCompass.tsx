import React, { SVGAttributes } from 'react';

function HeroIconCompass(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M12 22a10 10 0 110-20 10 10 0 010 20zm0-2a8 8 0 100-16 8 8 0 000 16zM9.56 8.93l6.37-2.12a1 1 0 011.26 1.26l-2.12 6.37a1 1 0 01-.63.63l-6.37 2.12a1 1 0 01-1.26-1.26l2.12-6.37a1 1 0 01.63-.63zm-.22 5.73l4-1.33 1.32-4-4 1.34-1.32 4z"></path>
    </svg>
  );
}

export default HeroIconCompass;
