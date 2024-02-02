// Avatar.js
import React from 'react';

const Avatar = ({ src, alt, size }) => (
  <img
    src={src}
    alt={alt}
    style={{
      borderRadius: '50%',
      width: size,
      height: size,
      marginRight: '8px', // Adjust spacing as needed
    }}
  />
);

export default Avatar;
