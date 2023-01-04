import logo from './logo.svg';
import './App.css';
import './Chat.css';
import './normal.css';
import { useEffect, useRef, useState } from 'react';

function App() {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const firstMessage = {
    user: 'A.I.',
    message: 'How can I help you today?'
  };

  const commandNotFoundMessage = {
    user: 'A.I.',
    message: 'The command entered is not valid.'
  };

  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [chatLog, setChatLog] = useState([firstMessage]);

  useEffect(() => {
    scrollToBottom()
  }, [chatLog]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!input) {
      return;
    }

    let chatLogNew = [...chatLog, { user: 'me', message: input }];
    let command = input;
    setInput('');
    setChatLog(chatLogNew);
    setTyping(true);

    if (command.substring(0, 1) == '/') {
      let commandExecuted = runCommand(command);

      if (!commandExecuted) {
        setChatLog([...chatLogNew, commandNotFoundMessage])
      }

      setTyping(false);
      return;
    }

    const messages = chatLogNew.map((message) => message.message).join('\n');

    const response = await fetch('http://localhost:3080', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: messages
      })
    });

    const data = await response.json();
    setChatLog([...chatLogNew, { user: 'A.I.', message: data.message }]);
    setTyping(false);
  }

  function runCommand(command) {
    switch (command) {
      case '/reset-chat':
        resetChat();
        break;
      default:
        return false;
    }

    return true;
  }

  function resetChat() {
    setChatLog([firstMessage]);
  }

  return (
    <div className="App">
      <section className="chatbox container">
        <div className="chat-log">
          {chatLog?.map((message, index) => (<ChatMessage key={index} message={message} />))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
              readOnly={typing}
              placeholder={typing ? 'A.I. is typing...' : ''}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="chat-input-textarea"
              rows="1"
            ></input>
            <button>Send</button>
          </form>
          <div className='footer'>
            <div className="message-footer">
              Type <span>/reset-chat</span> to reset the chat
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const ChatMessage = ({ message }) => {
  return (
    <div className={`chat-message ${message.user == 'A.I.' ? 'chat-ai' : ''}`}>
      <div className={`avatar ${message.user == 'A.I.' ? 'chat-ai' : ''}`}>
        <span>{message.user}</span>
      </div>
      <div className="message">{message.message}</div>
    </div>
  );
};

export default App;
