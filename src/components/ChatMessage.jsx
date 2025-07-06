import React from 'react'

const ChatMessage = ({ message, isOwn }) => {
  const formatMessage = (text) => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ))
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} fade-in`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
        isOwn 
          ? 'text-white rounded-br-sm' 
          : 'text-white rounded-bl-sm'
      }`}
      style={{
        backgroundColor: isOwn ? '#1a4c2e' : '#374151'
      }}
      >
        {!isOwn && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🔥</span>
            <span className="text-xs font-medium text-green-200">Maito Guy</span>
          </div>
        )}
        
        <div className="whitespace-pre-wrap break-words">
          {formatMessage(message.message)}
        </div>
        
        <div className={`text-xs mt-2 ${
          isOwn ? 'text-green-200' : 'text-gray-400'
        }`}>
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  )
}

export default ChatMessage