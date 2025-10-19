import React from 'react';

const Button = ({ children, variant = 'primary', className = '', onClick, secondaryColor, ...props }) => {
  const baseStyles =
    'font-bold py-1 px-2.5 rounded focus:outline-none focus:shadow-outline transition-all duration-200 ease-in-out';

  const dynamicStyle = {
    backgroundColor: secondaryColor,
    color: 'white',
    transform: 'scale(1)', // allows it to shrink when clicked
  };

  return (
    <button
      className={`${baseStyles} ${className}`} 
      style={dynamicStyle} // Apply color styling from the theme
      onClick={onClick}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.95)')} // Shrink on press
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')} // Reset on release
      onMouseEnter={(e) => {
        const currentColor = secondaryColor;
        e.currentTarget.style.backgroundColor = lightenColor(currentColor, 20); // highlight when hobered
      }}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = secondaryColor)}
      {...props}
    >
      {children}
    </button>
  );
};

// Utility function to lighten a color
// https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
const lightenColor = (color, percent) => {
  const num = parseInt(color.slice(1), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;

  return `#${(
    0x1000000 +
    (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
    (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
    (B < 255 ? (B < 1 ? 0 : B) : 255)
  )
    .toString(16)
    .slice(1)}`;
};

export default Button;
