
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { assets } from '../../assets/assets';

const Main = () => {
  const [prompt, setPrompt] = useState('');
  const { recentSearches, setRecentSearches, activeChat, loading, setLoading, showResult, setShowResult } = useContext(ChatContext);
  const [chatHistory, setChatHistory] = useState([]);
  const [error, setError] = useState('');
  

  const msgEndRef = useRef(null);         //Used to auto-scroll to the last message.

  useEffect(() => {
    if(msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [chatHistory, loading])
  

  useEffect(() => {
  if (activeChat) {
    setShowResult(true);
    setChatHistory([
      { sender: 'You', message: activeChat.question },
      { sender: 'Gemini', message: activeChat.answer }
    ]);
  }
}, [activeChat]);


  
  const handleSend = async () => {
  if (!prompt.trim()) return;

  const userMessage = prompt;
  setShowResult(true);
  setChatHistory(prev => [...prev, { sender: 'You', message: userMessage }]);
  setLoading(true);
  setError('');
  setPrompt('');

  try {
    const res = await fetch('https://gemini-clone-1azg.vercel.app/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await res.json();
    let botResponse = data.text || 'No response received.';

    // ✅ Format response with bold and line breaks
    let responseParts = botResponse.split("**");
    let formatted = "";
    for (let i = 0; i < responseParts.length; i++) {
      if (i === 0 || i % 2 !== 1) {
        formatted += responseParts[i];
      } else {
        formatted += `<b>${responseParts[i]}</b>`;
      }
    }
   // formatted = formatted.split("*").join("<br/>");

    setChatHistory(prev => [...prev, { sender: 'Gemini', message: '' }]);

   let displayText = "";
const words = formatted.split(""); // split by letter for smoother typing

words.forEach((letter, index) => {
  setTimeout(() => {
    displayText += letter;
    setChatHistory(prev => {
      const updated = [...prev];
      // Replace the last bot message progressively
      updated[updated.length - 1] = { sender: 'Gemini', message: displayText };
      return updated;
    });
  }, 20 * index); // 20ms per letter
});


  setRecentSearches(prev => [...prev, {
  question: userMessage,
  answer: formatted
}]);

  } catch (err) {
    setError('Something went wrong while fetching the response.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

const SkeletonLoader = () => (
  <div className="animate-pulse flex flex-col gap-2 bg-gray-100 p-4 rounded-xl">
    <div className="h-4 w-full bg-gray-300 rounded" />
    <div className="h-4 w-full bg-gray-300 rounded" />
    <div className="h-4 w-full bg-gray-300 rounded" />
  </div>
);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="relative bg-white h-full flex flex-col transition-all duration-300">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 pt-4">
        <p className='text-xl'>ADHD Tutor ChatApp</p>
        <img src={assets.user_icon1} alt="User" className="w-8 h-8 rounded-full cursor-pointer" />
      </div>

      {/* Center Section */}
      <div className="flex-grow px-4 md:px-8 overflow-y-auto pt-4 hide-scrollbar">
        {!showResult ? (
          <div className="flex flex-col items-center justify-center text-center h-full">
            <h1 className="mt-24 sm:mt-0 text-4xl md:text-5xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">Hello,</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-red-500">Students.</span>
            </h1>
            <p className="text-2xl md:text-3xl font-medium text-gray-700 mt-2">
              How can I help you today?
            </p>

            {/* Suggestion Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-8 ">
              <Card text="Suggest beautiful places to see on an upcoming road trip" icon={assets.compass_icon} />
              <Card text="Briefly summarize this concept: urban planning" icon={assets.bulb_icon} />
              <Card text="Brainstorm team bonding activities for our work retreat" icon={assets.message_icon} />
              <Card text="Improve the readability of the following code" icon={assets.code_icon} />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {chatHistory.map((chat, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-xl">
                <p className="text-sm font-semibold text-gray-500">{chat.sender}:</p>
                <p className="text-gray-800 whitespace-pre-line mt-1" dangerouslySetInnerHTML={{ __html: chat.message }}/>
              </div>
            ))}
            <div ref={msgEndRef}/>
            {/* {loading && (
              <div className="text-blue-500 font-medium">Gemini is thinking...</div>
             )} */}

            {loading && <SkeletonLoader />}

            {error && (
              <div className="text-red-500">{error}</div>
            )}
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="bg-gray-200 mt-2 sm:px-4  py-2 mx-3 rounded-full flex items-center justify-between w-85% mb-4 ">
        <input
          type="text"
          disabled={loading}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a prompt here"
          className="flex-grow bg-transparent outline-none px-2 text-gray-900 mx-5"
        />
        <div className="flex gap-1 sm:flex mr-5 sm:mr-0 sm:gap-3">
          <img src={assets.gallery_icon} alt="Gallery" className="w-6 h-6 cursor-pointer" />
          <img src={assets.mic_icon} alt="Mic" className="w-6 h-6 cursor-pointer" />
          {prompt? <img
            src={assets.send_icon}
            alt="Send"
            className="w-6 h-6 cursor-pointer"
            onClick={handleSend}
          />: null}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-gray-500 pb-3">
        Gemini may display inaccurate info, including about people, so double-check its responses.
      </p>
    </div>
  );
};

const Card = ({ text, icon }) => (
  <div className="flex justify-between items-center p-5 bg-gray-100 hover:bg-gray-200 transition rounded-3xl cursor-pointer">
    <p className="text-gray-800 font-medium max-w-xs">{text}</p>
    <img src={icon} alt="icon" className="w-6 h-6" />
  </div>
);

export default Main;
