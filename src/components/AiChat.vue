const handleSend = async () => {
  if (!userInput.value.trim()) return

  // Add user message
  messages.value.push({
    role: 'user',
    content: userInput.value
  })

  // Check for specific phrases in quotes
  const input = userInput.value.trim()
  if (input.includes('"nikola"')) {
    messages.value.push({
      role: 'assistant',
      content: 'zivanovic'
    })
    scrollToBottom()
    return
  }
  
  if (input.includes('"zdravo"')) {
    messages.value.push({
      role: 'assistant',
      content: 'kako si?'
    })
    scrollToBottom()
    return
  }

  // Clear input
  userInput.value = ''

  // Check if this is the third message
  // ... existing code ...
} 