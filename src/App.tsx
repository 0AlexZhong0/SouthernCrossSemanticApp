import * as React from 'react'
import SimpleButton from 'Components/SimpleButton'

const App = () => {
  return (
     <SimpleButton onClickLogMsg={() => console.log("hello world")}/>
  );
}

export default App;
