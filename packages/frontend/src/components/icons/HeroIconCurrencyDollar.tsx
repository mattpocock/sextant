import React, { SVGAttributes } from 'react';

function HeroIconCurrencyDollar(props: SVGAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      {...props}
      className={`fill-current ${props.className}`}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <path d="M12 22a10 10 0 110-20 10 10 0 010 20zm0-2a8 8 0 100-16 8 8 0 000 16zm1-11v2h1a3 3 0 010 6h-1v1a1 1 0 01-2 0v-1H8a1 1 0 010-2h3v-2h-1a3 3 0 010-6h1V6a1 1 0 012 0v1h3a1 1 0 010 2h-3zm-2 0h-1a1 1 0 100 2h1V9zm2 6h1a1 1 0 000-2h-1v2z"></path>
    </svg>
  );
}

export default HeroIconCurrencyDollar;
