import React from 'react'
import Sidebar from './components/Sidebar/Sidebar'
import Main from './components/Main/Main'
import './App.css';
const App = () => {
  return (
    
      <div className="flex w-full h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-grow h-full">
        <Main />
      </div>
    </div>

  )
}

export default App