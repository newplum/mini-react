import React from "./core/react.js";

function Count({ num }) {
  return <div>Count {num}</div>;
}

const App = (
  <div>
    <h1>Hello World</h1>
    <Count num={10}></Count>
    <Count num={20}></Count>
  </div>
);

export default App;
