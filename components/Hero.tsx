
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CopyIcon from './icons/CopyIcon';

interface HeroProps {
  onGoToStore: () => void;
  serverName: string;
  serverIP: string;
  serverDescription: string;
}

interface ServerStatus {
  online: boolean;
  players: {
    now: number;
    max: number;
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};


const Hero: React.FC<HeroProps> = ({ onGoToStore, serverName, serverIP, serverDescription }) => {
  const [ipCopied, setIpCopied] = useState(false);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  useEffect(() => {
    if (!serverIP) {
      setServerStatus({ online: false, players: { now: 0, max: 0 } });
      setIsLoadingStatus(false);
      return;
    }
    const fetchServerStatus = async () => {
      setIsLoadingStatus(true);
      try {
        const response = await fetch(`https://api.mcstatus.io/v2/status/java/${serverIP}`);
        if (!response.ok) {
          throw new Error('Failed to fetch server status');
        }
        const data = await response.json();
        if (data.online) {
          setServerStatus({
            online: true,
            players: {
              now: data.players.online,
              max: data.players.max,
            },
          });
        } else {
          setServerStatus({ online: false, players: { now: 0, max: 0 } });
        }
      } catch (error) {
        console.error("Error fetching server status:", error);
        setServerStatus({ online: false, players: { now: 0, max: 0 } });
      } finally {
        setIsLoadingStatus(false);
      }
    };

    fetchServerStatus();
  }, [serverIP]);

  const handleCopyIp = () => {
    navigator.clipboard.writeText(serverIP).then(() => {
      setIpCopied(true);
      setTimeout(() => setIpCopied(false), 2000);
    });
  };

  const renderServerStatus = () => {
    if (isLoadingStatus) {
      return (
        <>
          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-400 text-xs">Pinging...</span>
        </>
      );
    }

    if (serverStatus?.online) {
      return (
        <>
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-white font-bold">{serverStatus.players.now}</span>
          <span className="text-gray-400 text-xs">Online</span>
        </>
      );
    }

    return (
      <>
        <span className="relative flex h-3 w-3">
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
        </span>
        <span className="text-gray-400 text-xs">Offline</span>
      </>
    );
  };

  return (
    <motion.div
      className="text-center py-20 sm:py-32"
      {...{
        variants: containerVariants,
        initial: "hidden",
        animate: "visible",
      }}
    >
      <motion.h1 {...{ variants: itemVariants }} className="text-4xl sm:text-5xl md:text-7xl font-pixel font-bold text-brand tracking-widest">
        {serverName}
      </motion.h1>
      <motion.p {...{ variants: itemVariants }} className="mt-4 text-base md:text-xl text-gray-300 max-w-2xl mx-auto">
        {serverDescription}
      </motion.p>
      <motion.p {...{ variants: itemVariants }} className="mt-2 text-md text-gray-400">
        Minecraft Version: 1.21.7+
      </motion.p>
      <motion.div {...{ variants: itemVariants }} className="mt-8 flex flex-col items-center justify-center gap-2">
        <div className="flex items-stretch bg-gray-800 rounded-md p-1 gap-1">
          <div className="bg-gray-900 rounded-l-md flex items-center px-4">
            <p>
              <span className="text-gray-400 mr-2">IP:</span>
              <span className="font-mono text-white">{serverIP}</span>
            </p>
          </div>
          <button
            onClick={handleCopyIp}
            className="bg-brand text-black p-2 hover:bg-brand-dark transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
            aria-label="Copy IP Address"
            disabled={!serverIP}
          >
            <CopyIcon />
          </button>
          <div className="bg-gray-900 rounded-r-md flex items-center px-4 gap-2 justify-center min-w-[7rem]">
            {renderServerStatus()}
          </div>
        </div>
        <div className="h-5">
            {ipCopied && <span className="text-brand text-sm animate-pulse">Copied to clipboard!</span>}
        </div>
      </motion.div>
      <motion.div {...{ variants: itemVariants }} className="mt-10">
        <button
          onClick={onGoToStore}
          className="bg-brand text-black font-bold font-pixel text-lg py-4 px-8 rounded-md hover:bg-brand-dark transform hover:scale-105 transition-all"
        >
          Visit The Store
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Hero;