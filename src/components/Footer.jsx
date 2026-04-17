import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-black text-white text-center py-3 mt-5">
      © {new Date().getFullYear()} TaskHive. All rights reserved.
    </footer>
  );
};

export default Footer;
