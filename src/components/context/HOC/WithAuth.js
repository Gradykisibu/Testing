import React, { useEffect } from 'react';
// import { useAuthContext } from '../AuthContext/AuthContext';

const WithLoggin = (WrappedComponent) => {
  // const { user } = useAuthContext();
    
  return function EnhancedComponent(props) {
    useEffect(() => {
      console.log(`Component ${WrappedComponent.name} is mounted.`);
      return () => {
        console.log(`Component ${WrappedComponent.name} is unmounted.`);
      };
    }, []);

    return <WrappedComponent {...props} />;
  };
};

export default WithLoggin;
