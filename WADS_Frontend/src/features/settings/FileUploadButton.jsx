import { useRef } from "react";
import PropTypes from "prop-types";

const FileUploadButton = ({
  type = "clear",
  accept = "image/*",
  onChange,
  maxSize = "2MB",
  children,
  ...otherProps
}) => {
  const fileInputRef = useRef(null);

  // Style based on type (copied from your Button component)
  const buttonStyle =
    type === "blue"
      ? "p-2 bg-[#0A3E74] h-10 rounded-md text-white mx-auto hover:cursor-pointer"
      : type === "blue-s"
      ? "p-2 bg-[#0A3E74] h-10 rounded-md text-white hover:cursor-pointer"
      : type === "clear"
      ? "p-2 bg-[FFFFFF] h-10 rounded-md text-black hover:cursor-pointer border border-gray-300"
      : "flex items-center justify-center gap-2 p-2 px-4 bg-[#E3EFF9] rounded-md text-gray-700 shadow-sm hover:cursor-pointer";

  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e) => {
    if (onChange && e.target.files && e.target.files.length > 0) {
      onChange(e);
    }
  };

  return (
    <div className="inline-block">
      <button 
        type="button"
        className={buttonStyle}
        onClick={triggerFileSelect}
        {...otherProps}
      >
        {children}
      </button>
      
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      
      {maxSize && (
        <div className="text-xs text-gray-500 mt-1">
          {accept.includes('image') ? 'Image' : 'File'} ({accept.replace('image/', '').replace('*', 'all')}).
          Max size {maxSize}
        </div>
      )}
    </div>
  );
};

FileUploadButton.propTypes = {
  type: PropTypes.string,
  accept: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  maxSize: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default FileUploadButton;