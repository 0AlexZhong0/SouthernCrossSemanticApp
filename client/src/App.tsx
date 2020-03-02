import * as React from "react";
import MedicalForm from "components/medicalForm/MedicalForm";
// import ChatFeed from "Components/ChatBot/ChatFeed"
import PersonalInfoStateProvider from "contexts/PersonalInfoState";

const App: React.FC = (): JSX.Element => {
  return (
    <PersonalInfoStateProvider>
      <MedicalForm />
    </PersonalInfoStateProvider>
  );

  // return <ChatFeed />
};

export default App;
