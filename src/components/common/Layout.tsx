import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { Bolt, Move } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

export function Layout({ children, currentPage, onPageChange }: LayoutProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastClickTime, setLastClickTime] = useState(0);

  // Initialize position in bottom-right corner
  useEffect(() => {
    const savedPosition = localStorage.getItem('floatingBadgePosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    } else {
      // Default to bottom-right corner
      setPosition({
        x: window.innerWidth - 200,  // 200px from right
        y: window.innerHeight - 60    // 60px from bottom
      });
    }
  }, []);

  // Save position to localStorage whenever it changes
  useEffect(() => {
    if (position.x !== 0 || position.y !== 0) {
      localStorage.setItem('floatingBadgePosition', JSON.stringify(position));
    }
  }, [position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Prevent text selection during drag
    e.preventDefault();
    
    // Check for double click
    const now = Date.now();
    if (now - lastClickTime < 300) { // 300ms threshold for double click
      return; // Let the double click handler handle it
    }
    setLastClickTime(now);
    
    // Start dragging
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleDoubleClick = () => {
    // Only navigate on double click, not during drag
    if (!isDragging) {
      window.open('https://bolt.new', '_blank', 'noopener,noreferrer');
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    
    // Keep the badge within viewport bounds
    const maxX = window.innerWidth - 200; // 200px is the approximate width of the badge
    const maxY = window.innerHeight - 50; // 50px is the height of the badge
    
    setPosition({
      x: Math.min(Math.max(0, newX), maxX),
      y: Math.min(Math.max(0, newY), maxY)
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Add/remove event listeners for drag
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
      document.body.style.userSelect = 'none';
    } else {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, dragOffset]);

  const handleNavigateToDashboard = () => {
    onPageChange('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header onNavigateToDashboard={handleNavigateToDashboard} />
      
      <div className="flex flex-col lg:flex-row">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-64 lg:fixed lg:h-full lg:top-16 lg:left-0 bg-white shadow-sm border-r border-gray-200">
          <Navigation 
            currentPage={currentPage} 
            onPageChange={onPageChange}
            isDesktop={true}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-64 lg:pt-16 pb-20 lg:pb-8">
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
          <Navigation 
            currentPage={currentPage} 
            onPageChange={onPageChange}
            isDesktop={false}
          />
        </div>

        {/* Draggable Floating Badge */}
        <div 
          className="fixed z-50 cursor-grab active:cursor-grabbing select-none"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            touchAction: 'none',
          }}
          onMouseDown={handleMouseDown}
          onDoubleClick={handleDoubleClick}
        >
          <div className="inline-flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-100 shadow-lg rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 border border-gray-200 hover:border-gray-300">
            <Bolt className="w-4 h-4 text-yellow-500" />
            <span>Built with Bolt.new</span>
            <Move className="w-3.5 h-3.5 ml-1 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}