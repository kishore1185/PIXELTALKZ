import React from 'react'

import { ChatInterface } from "./components/chat-interface.jsx"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import  ChatRooms  from "./components/ChatRooms.jsx"



function App() {
  return (
    <Router>
        <Routes>
          {/* Homepage should always be light */}
          <Route path="/" element={<ChatRooms />} />

          {/* Chat pages: zinc background that follows theme */}
          <Route
            path=":roomId"
            element={
              <div className="min-h-screen w-full bg-zinc-100 dark:bg-zinc-900">
                <ChatInterface isChatRoom={true} />
              </div>
            }
          />
        </Routes>
    </Router>
  )
}

export default App

