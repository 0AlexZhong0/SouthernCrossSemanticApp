import * as React from "react";
import SimpleButton from "Components/SimpleButton";
import DemoCheckBox from "Components/DemoCheckBox";

const App = (): JSX.Element => {
  return (
    <React.Fragment>
      <SimpleButton onClickLogMsg={() => console.log("hello world")} />
      <DemoCheckBox />
    </React.Fragment>
  );
};

export default App;
