
import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import Message from './Message.jsx';
import ChatBar from './ChatBar.jsx';

var people = {
  currentUser: {name: "Bob"},
  messages: [
    {
      id: "1",
      username: "Bob",
      content: "Has anyone seen my marbles?",
    },
    {
      id: "2",
      username: "Anonymous",
      content: "No, I think you lost them. You lost your marbles Bob. You lost them for good."
    }
  ]
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = people
  }

  componentDidMount() {
  const connectSocket = new WebSocket('ws://localhost:4000');
    connectSocket.addEventListener('open', function(event) {
      function sendText() {
        // Construct a msg object containing the data the server needs to process the message from the chat client.
        var msg = {
          type: "message",
          username: "Bob",
          content: "Hi"
        };
        connectSocket.send(JSON.stringify(msg));
      }
      sendText();
    })
  }

  postMessage = (textEntered, ev) => {
    const newMessage = {id:this.state.messages.length + 1, username: this.state.currentUser.name, content: textEntered}
    if (ev.key === 'Enter') {
      this.setState({
        messages:[...this.state.messages, newMessage]
      })
      ev.target.value='';
    }
  }

  render() {
    return (
      <div>
        <MessageList messages={this.state.messages}/>
        <Message />
        <ChatBar defaultValue={this.state.currentUser.name} postMessage={this.postMessage}/>
      </div>
    );
  }
}
export default App;
