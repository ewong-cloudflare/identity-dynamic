import { useEffect } from 'react';

const useSessionCheck = (onSessionExpired) => {
  useEffect(() => {
    const checkSession = () => {
      const authCookie = document.cookie.split('; ').find(row => row.startsWith('CF_Authorization='));
      if (!authCookie) {
        if (typeof onSessionExpired === 'function') {
          onSessionExpired(); 
        }
        return;
      }

      fetch(window.location.origin, { method: 'HEAD' })
        .then((response) => {
          if (!response.ok) {
            console.error('Session check failed: CORS error detected');
            if (typeof onSessionExpired === 'function') {
              onSessionExpired();
            }
          }
        })
        .catch((error) => {
          console.error('Session check failed:', error.message);
          if (typeof onSessionExpired === 'function') {
            onSessionExpired();
          }
        });
    };

    const intervalId = setInterval(checkSession, 10000); // Check every 10s 

    return () => clearInterval(intervalId);
  }, [onSessionExpired]);
};

export default useSessionCheck;
