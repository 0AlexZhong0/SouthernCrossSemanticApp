import React from "react"
// @ts-ignore
import ChatBot from "react-simple-chatbot"

import "./ChatFeed.css"
import MedicalForm from "../MedicalForm/MedicalForm"

const ChatFeed = () => {
  const steps = [
    {
      id: "0",
      message: "Hello, how can I help you",
      trigger: "1"
    },
    {
      id: "1",
      user: true,
      trigger: "2"
    },
    {
      id: "2",
      message: "Welcome to te medical declaration form",
      trigger: "3"
    },
    {
      id: "3",
      component: <MedicalForm />,
      trigger: "submit form"
    },
    {
      id: "submit form",
      options: [
        { value: "yes", label: "Submit", trigger: "end-message" },
        { value: "quit", label: "Quit", trigger: "end-message" }
      ]
    },
    {
      id: "end-message",
      message: "Thank you, have a good day!",
      end: true
    }
  ]
  return (
    <ChatBot
      steps={steps}
      width="80%"
      className="centerChatDialog"
      headerTitle="SouthernCross ChatBot"
      enableSmoothScroll={true}
    />
  )
}

export default ChatFeed
