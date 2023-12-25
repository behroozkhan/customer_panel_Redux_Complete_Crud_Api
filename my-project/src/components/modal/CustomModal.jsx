import React from "react";
// custom Modal
const CustomModal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target.id === "wrapper") onClose();
    console.log(e.target.id);
  };

  return (
    <div
      onClick={handleClose}
      id="wrapper"
      className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center"
    >
      <div className="w-[450px] duration-500">
        <div className="">{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
