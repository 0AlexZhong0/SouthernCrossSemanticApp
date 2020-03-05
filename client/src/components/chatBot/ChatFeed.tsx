import React from "react";
// @ts-ignore
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";

import MedicalFormContainer from "components/medicalForm";

const theme = {
  background: "#f5f8fb",
  fontFamily: "Arial, Helvetica, sans-serif",
  headerBgColor: "#008bce",
  headerFontSize: "1.2rem",
  botBubbleColor: "#008bce",
  userFontColor: "#4a4a4a"
};

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
      component: <MedicalFormContainer />,
      end: true
    }
  ];
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <ThemeProvider theme={theme}>
        <ChatBot
          steps={steps}
          width="50vw"
          height="100%"
          headerTitle="SouthernCross ChatBot"
          SenableSmoothScroll={true}
        />
      </ThemeProvider>
    </div>
  );
};

export default ChatFeed;
