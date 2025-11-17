const CleanupFunctionExample = () => {
  React.useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Interval running');
    }, 1000);

    return () => {
      clearInterval(intervalId);
      console.log('Cleanup function called');
    };
  }, []);

  return <div>Cleanup Function Example</div>;
};

export default CleanupFunctionExample;
import React from 'react';