import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext.jsx';


const Sidebar = () => {
  const { recentSearches, setActiveChat, setLoading, setShowResult } = useContext(ChatContext);

  const [extended, setExtended] = useState(false)

  const newChat = () =>{
  setLoading(false)
  setShowResult(false)
}

  return (
<div
      className={`h-screen p-5 pt-8 font-sans bg-gray-100 relative hidden sm:block transition-all duration-300 ${
        extended ? 'w-60' : 'w-20'
      }`}
    >      
      <img
        onClick={() => setExtended(prev => !prev)}
        src={assets.menu_icon}
        alt="Menu"
        className="cursor-pointer w-6"
      />

      <div
        className={`mt-10 flex flex-row gap-2 items-center h-10 p-2 rounded-full bg-gray-200 cursor-pointer transition-all duration-300 ${
          extended ? 'w-35' : 'w-12'
        }`}
      >
        <img src={assets.plus_icon} alt="New Chat" className="pl-2 w-6 h-6" />
        {extended && <p className="text-gray-500" onClick={() => newChat()}>New Chat</p>}
      </div>

      {extended && (
        <div className="mt-8 animate-fadeIn">
          <p className="text-gray-700 font-medium">Recent</p>
          {recentSearches.map((item, index) =>(
            <div key={index} onClick={() => setActiveChat(item)} className="flex w-48 gap-2 items-center hover:bg-gray-200 rounded-full px-4 py-2.5 cursor-pointer">
            <img src={assets.message_icon} alt="Chat" className="w-7 h-6" />
            <p>{item.question.slice(0,18)} ...</p>
          </div>
          ))}
          
        </div>
      )}

      <div className="absolute bottom-0 left-0 font-sans m-5">
        <div className={`flex gap-2 items-center hover:bg-gray-300 rounded-full px-4 py-2.5 cursor-pointer ${extended ? 'w-50': 'w-13'}`}>
          <img src={assets.question_icon} alt="Help" className="w-5 h-5" />
          {extended && <p className="text-md">Help</p>}
        </div>
        <div className={`flex gap-2 items-center hover:bg-gray-300 rounded-full px-4 py-2.5 cursor-pointer ${extended ? 'w-50': 'w-13'}`}>
          <img src={assets.history_icon} alt="Activity" className="w-5 h-5" />
          {extended && <p className="text-md">Activity</p>}
        </div>
        <div className={`flex gap-2 items-center hover:bg-gray-300 rounded-full px-4 py-2.5 cursor-pointer ${extended ? 'w-50': 'w-13'}`}>
          <img src={assets.setting_icon} alt="Settings" className="w-5 h-5" />
          {extended && <p className="text-md">Settings</p>}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
