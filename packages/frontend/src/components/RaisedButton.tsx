import React from 'react';

export const RaisedButton: React.FC<{ onClick: () => void }> = ({
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      className="text-xs uppercase px-3 py-2 bg-white hover:bg-gray-100 text-gray-800 font-semibold border border-gray-400 rounded shadow"
    >
      {children}
    </button>
  );
};
