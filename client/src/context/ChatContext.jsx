import React, { createContext, useState } from 'react';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  return (
    <ChatContext.Provider value={{ recentSearches, setRecentSearches, activeChat, setActiveChat, loading, setLoading, showResult, setShowResult }}>
      {children}
    </ChatContext.Provider>
  );
};
