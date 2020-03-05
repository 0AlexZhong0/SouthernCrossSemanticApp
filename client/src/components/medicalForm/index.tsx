import * as React from "react";
import PersonalInfoStateProvider from "contexts/PersonalInfoState";
import MedicalForm from "./MedicalForm";

const MedicalFormContainer = () => (
  <PersonalInfoStateProvider>
    <MedicalForm />
  </PersonalInfoStateProvider>
);

export default MedicalFormContainer;
