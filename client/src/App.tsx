import * as React from "react";
import MedicalForm from "Components/MedicalForm/MedicalForm";
// import ChatFeed from "Components/ChatBot/ChatFeed"
import PersonalInfoStateProvider from "contexts/PersonalInfoState";

const App = (): JSX.Element => {
  return (
    <PersonalInfoStateProvider>
      <MedicalForm />
    </PersonalInfoStateProvider>
  );
  // return <ChatFeed />
};

export default App;
