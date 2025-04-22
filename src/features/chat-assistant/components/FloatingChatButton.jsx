import { RiChat1Line } from '@remixicon/react';
import { useNavigate } from 'react-router-dom';

const FloatingChatButton = () => {
  const navigate = useNavigate();

  return (
    location.pathname === '/chat' ? null : (
      <button
        onClick={() => navigate('/chat')}
        className="fixed bottom-6 right-6 p-4 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors cursor-pointer z-[9999]"
        style={{ 
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          position: 'fixed',
          bottom: '1.5rem',
          right: '1.5rem',
        }}
      >
        <RiChat1Line size={24} />
      </button>
    )
  );
};

export default FloatingChatButton; 