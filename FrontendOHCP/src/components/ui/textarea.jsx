// src/components/ui/textarea.jsx
import React from "react";

const Textarea = React.forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={`block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
    {...props}
  />
));

Textarea.displayName = "Textarea";

export { Textarea };
