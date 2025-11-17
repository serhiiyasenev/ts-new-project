import { useState } from 'react';
import Greeting from './Greeting';
import Input from './Input';

const LiftingStateUp = () => {
  const [inputValue, setInputValue] = useState("");

  return (
    <div>
      <h2>Lifting State Up Example</h2>
      <Input value={inputValue} onValueChange={setInputValue} />
      <Greeting name={inputValue} />
    </div>
  );
};

export default LiftingStateUp;
