/* src/components/PullToRefresh.jsx */
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

const PullToRefresh = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // How far the user needs to pull to trigger the refresh
  const THRESHOLD = 60;
  const MAX_PULL = 100;

  const handleTouchStart = (e) => {
    // Only allow pull-to-refresh if the user is at the very top of the page
    if (window.scrollY <= 0) {
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e) => {
    if (startY === 0 || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;

    // If pulling downwards
    if (distance > 0 && window.scrollY <= 0) {
      // Add "resistance" by multiplying by 0.5
      setPullDistance(Math.min(distance * 0.5, MAX_PULL));
    }
  };

  const handleTouchEnd = async () => {
    if (startY === 0) return;

    if (pullDistance >= THRESHOLD && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(THRESHOLD); // Lock it open while loading
      
      // Trigger whatever function was passed in (e.g., your SMS Sync)
      await onRefresh();
      
      setIsRefreshing(false);
    }
    
    // Snap back to the top
    setPullDistance(0);
    setStartY(0);
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="min-h-full w-full"
    >
      {/* The Loading Spinner Container */}
      <div 
        className="flex justify-center items-center overflow-hidden transition-all duration-200 ease-out bg-[#0a0a0a]"
        style={{ height: `${isRefreshing ? THRESHOLD : pullDistance}px` }}
      >
        <RefreshCw 
          className={`text-indigo-500 w-6 h-6 transition-transform ${isRefreshing ? 'animate-spin' : ''}`} 
          style={{ 
            transform: `rotate(${pullDistance * 2}deg)`,
            opacity: pullDistance / THRESHOLD 
          }}
        />
      </div>

      {/* Your actual app content goes here */}
      <div 
        className="transition-transform duration-200 ease-out"
        style={{ transform: `translateY(0px)` }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;