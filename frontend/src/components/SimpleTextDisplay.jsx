// src/components/SimpleTextDisplay.jsx
import React from 'react'

function SimpleTextDisplay({ text }) {
  return (
    <div style={{ 
      border: '1px solid #ccc', 
      padding: '20px', 
      margin: '20px 0' 
    }}>
      <h3>Text to Annotate:</h3>
      <p>{text}</p>
    </div>
  )
}

export default SimpleTextDisplay