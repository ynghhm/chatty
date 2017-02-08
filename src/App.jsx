
import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import Message from './Message.jsx';
import ChatBar from './ChatBar.jsx';

var people = {
  currentUser: {name: "Bob"},
  messages: []
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = people
    this.connectSocket = undefined;
  }

  onReceive = (message) => {
    this.setState({messages: JSON.parse(message.data)})
  }

  componentDidMount() {
    this.connectSocket = new WebSocket('ws://localhost:4000');
    this.connectSocket.addEventListener('message', this.onReceive)
  }

  render() {
    return (
      <div>
        <MessageList messages={this.state.messages}/>
        <Message />
        <ChatBar defaultValue={this.state.currentUser.name} />
      </div>
    );
  }
}
export default App;
