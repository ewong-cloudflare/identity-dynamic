import {useEffect} from 'react';

const useSessionCheck = (onSessionExpired) => {
  useEffect(() => {
    const checkSession = () => {
      const authCookie = document.cookie.split('; ').find(row => row.startsWith('CF_Authorization='));
      if (!authCookie && typeof onSessionExpired === 'function') {
        onSessionExpired(); 
      }
    };

    const intervalId = setInterval(checkSession, 60000); // Check every 60s

    return () => clearInterval(intervalId);
  }, [onSessionExpired]);
};

export default useSessionCheck;
