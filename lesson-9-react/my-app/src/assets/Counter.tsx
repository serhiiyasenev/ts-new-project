import { use, useEffect, useState } from 'react';

const Counter = () => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    console.log(`Count has been updated to: ${count}`);
  }, [count]);

  useEffect(() => {
    console.log('Counter component mounted');
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
};

export default Counter;