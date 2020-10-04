import React, { TextareaHTMLAttributes } from "react";

export const TextInput: React.FC<TextareaHTMLAttributes<HTMLTextAreaElement> & {
  error?: string;
  label?: string;
  hint?: string;
}> = ({ error, hint, label, className, ...props }) => {
  return (
    <div className={classNames(className, "focus-within:bg-gray-100 border")}>
      <div className="px-2 py-1 pb-2">
        {label && (
          <label
            className={classNames("block uppercase text-xs text-gray-600 mb-1")}
          >
            {label}
          </label>
        )}
        <textarea
          rows={1}
          {...props}
          className={classNames(
            "focus:outline-none bg-transparent text-gray-700 block w-full resize-y",
            "placeholder:text-gray-600",
          )}
        />
      </div>
      {error ? (
        <p className="border-t px-2 py-1 text-xs bg-red-200 text-red-900 border-">
          {error}
        </p>
      ) : hint ? (
        <p className="border-t px-2 py-1 text-xs bg-white text-gray-600 border-">
          {hint}
        </p>
      ) : null}
    </div>
  );
};
