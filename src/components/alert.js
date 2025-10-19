import React from 'react';

const Alert = ({ type, children }) => {
  const alertClass = () => {
    switch (type) {
      case 'success':
        return 'bg-alert-green text-alert-green2 border-alert-green p-4 rounded';
      case 'danger':
        return 'bg-alertred text-white border-red p-4 rounded';
      case 'warning':
        return 'bg-yellow text-warning border-warning p-4 rounded';
      default:
        return 'bg-gray text-gray-dark border-gray-light p-4 rounded';
    }
  };

  return (
    <div className={alertClass()}>
      {children}
    </div>
  );
};

export default Alert;
