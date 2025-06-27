// src/components/ui/upload.jsx
import React from "react";

const Upload = React.forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    type="file"
    className={`block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${className}`}
    {...props}
  />
));

Upload.displayName = "Upload";

export { Upload };
