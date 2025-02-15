import React, { useEffect, useState } from 'react'


import MessageForm from './components/MessageForm'
import MessageList from './components/MessageList'

import { THOUGHTS_URL, LIKES_URL, DELETE_THOUGHT_URL  } from './reusable/urls'


export const App = () => {

  const [messageList, setMessageList] = useState([])
  const [newMessage, setNewMessage] = useState('')
  useEffect(() => {
    fetchMessageList()
  }, [])

  const fetchMessageList = () => {
    fetch(THOUGHTS_URL)
      .then(res => res.json())
      .then(message => setMessageList(message))
      .catch(err => (err))
  }

  const handleNewmessageChange = (event) => {
    setNewMessage(event.target.value)
  }

  const handleFormSubmit = (event) => {
    event.preventDefault()
    
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: newMessage }) 
    }
    fetch(THOUGHTS_URL, options)
    .then(res => res.json())
    .then(postMessage => setMessageList([postMessage, ...messageList]))

    setNewMessage('')
  }

  const handleLikesIncrease = (id) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }
      fetch(LIKES_URL(id), options)
      .then(res => res.json())
      .then(postMessage => {
        const updatedMessageList = messageList.map(message => {
          if (message._id === postMessage._id) {
            message.hearts += 1
          }
          return message; 
        })
        setMessageList(updatedMessageList)
      })
      .catch((err) => (err))
  }

  const handleDeleteMessage = (id) => {
    const options = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    }
      fetch(DELETE_THOUGHT_URL(id), options)
      .then(res => res.json())
      .then(() => fetchMessageList())
      .catch((err) => (err))
  }
  
  return (
    <main>
      <MessageForm 
        newMessage={newMessage}
        onNewmessageChange={handleNewmessageChange}
        onFormSubmit={handleFormSubmit}
      />
      <MessageList 
        messageList={messageList} 
        handleLikesIncrease={handleLikesIncrease}
        handleDeleteMessage={handleDeleteMessage}
      />
    </main>
  )
}
