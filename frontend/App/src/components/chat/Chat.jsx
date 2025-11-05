import React, { useState} from 'react'
import { ChatWindow } from './ChatWindow';

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);

  //Toogle Chat-window
  const toogleChat = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div>
      {/* CHAT BUBBLE*/}
      {!isOpen && (
        <button
          onClick={toogleChat}
          className='fixed bottom-5 right-5 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transiton duration-200 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-opacity-50 cursor-pointer'
          aria-label="Open Chat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Chat window */}
      {
        isOpen &&  (
          <div className="fixed bottom-5 right-5 md:bottom-8 md:right-8 w-[calc(100%-2.5rem)] max-w-md h-[70vh] max-h-[300px] bg-white rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out">
            <ChatWindow closeChat={toogleChat}/>
          </div>
        )
      } 
    </div>
  )
}

export default Chat
