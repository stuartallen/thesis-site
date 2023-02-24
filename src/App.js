import './App.css';

//  My scripts

//  My components
import Screen from './components/Screen';

function App() {
  return (
    <div className="App">
      <Screen scene={"normalMix"}/>
      <Screen scene={"lineIntegral"}/>
    </div>
  );
}

export default App;
