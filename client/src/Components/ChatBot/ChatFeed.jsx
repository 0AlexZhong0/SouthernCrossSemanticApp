import React from "react"
// @ts-ignore
import ChatBot from "react-simple-chatbot"

import "./ChatFeed.css"
import MedicalForm from "../MedicalForm/MedicalForm"

const ChatFeed = () => {
  const steps = [
    {
      id: "0",
      message: "Welcome to medical declaration form!",
      trigger: "1"
    },
    {
      id: "1",
      component: (        
        <MedicalForm />        
      ),
      end: true
    }
  ]
  return (
      <ChatBot steps={steps} width="80%" className="centerChatDialog"/>
  )
}

export default ChatFeed
