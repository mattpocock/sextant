import React from 'react';

export const Heading: React.FC = ({ children }) => {
  return (
    <h2 className="text-xl font-bold font-mono text-gray-800">{children}</h2>
  );
};
