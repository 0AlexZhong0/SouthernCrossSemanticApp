import * as React from "react";

const initDob = {
  day: "",
  month: "",
  year: ""
};

type DateOfBirth = typeof initDob;

type PersonalInfoContextType = {
  sex: string;
  dob: DateOfBirth;
  setSex: (gender: string) => void;
  setDob: (dateOfBirth: DateOfBirth) => void;
};

const initContext: PersonalInfoContextType = {
  sex: "",
  dob: initDob,
  setSex: () => {
    throw new Error("Must override");
  },
  setDob: () => {
    throw new Error("Must override");
  }
};

export const PersonalInfoContext = React.createContext(initContext);

const usePersonalInfo = (): PersonalInfoContextType => {
  const [sex, setSex] = React.useState("");
  const [dob, setDob] = React.useState<DateOfBirth>(initDob);

  return { sex, dob, setSex, setDob };
};

const PersonalInfoStateProvider = (props: { children: React.ReactNode }) => (
  <PersonalInfoContext.Provider value={usePersonalInfo()}>
    {props.children}
  </PersonalInfoContext.Provider>
);

export default PersonalInfoStateProvider;
