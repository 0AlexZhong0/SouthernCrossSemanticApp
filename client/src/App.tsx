import * as React from 'react'
import MedicalForm from 'Components/MedicalForm/MedicalForm'
// import ChatFeed from "Components/ChatBot/ChatFeed"

// run the localhost with chrome with this command to bypass cors
// chrome --disable-web-security --user-data-dir="/c/Users/ALEX/.google-chrome-root"
const App = (): JSX.Element => {
  return <MedicalForm />
  // return <ChatFeed />
}

export default App
