import { useState } from "react";
import "./App.css";
import AppRouter from "./routes/AppRouter";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div style={{border:'0px solid black',height:'100%',width:'100%'}}>
      <AppRouter/>
    </div>
  );
}

export default App;
