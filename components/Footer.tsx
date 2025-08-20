
import React from 'react';

interface FooterProps {
  serverName: string;
}

const Footer: React.FC<FooterProps> = ({ serverName }) => {
  return (
    <footer className="bg-gray-800">
      <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} {serverName}. All Rights Reserved.</p>
        <p className="text-sm mt-1">Not affiliated with Mojang Studios.</p>
      </div>
    </footer>
  );
};

export default Footer;