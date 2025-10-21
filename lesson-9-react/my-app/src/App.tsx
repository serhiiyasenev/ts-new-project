import './App.css'
import UserCard from './assets/UserCard'
import Counter from './assets/Counter';
import LiftingStateUp from './assets/LiftingStateUpd';
import CleanupFunctionExample from './assets/Effects';

function App() {
  return (
    <><div className="App">
      <UserCard name="John Doe" age={30} city="New York" />
    </div>
      <div>
        <Counter />
      </div>
      <div>
        <LiftingStateUp />
      </div>
      <div>
        <CleanupFunctionExample />
      </div>  
    </>
  )
}

export default App
