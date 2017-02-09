
import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import Message from './Message.jsx';
import ChatBar from './ChatBar.jsx';
import uuid from 'node-uuid';

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
    this.connectSocket = new WebSocket('ws://localhost:4000');
    this.connectSocket.onmessage = (event) => {
      let newData = JSON.parse(event.data)
      this.setState({
        messages:this.state.messages.concat(newData)
      })
    }
  }

  postMessage = (textEntered, ev) => {
    const newMessage = {id:uuid.v4(), username: this.state.currentUser.name, content: textEntered}
    if (ev.key === 'Enter' && textEntered.length > 0) {
      ev.target.value='';
      this.connectSocket.send(JSON.stringify(newMessage));
    }
  }

  editName = (textEntered, ev) => {
    const newName = {name: textEntered}
    if (ev.key === 'Enter' && textEntered.length > 0) {
      this.setState({
        currentUser: newName
      })
      console.log(newName)
    }
  }

  render() {
    return (
      <div>
        <MessageList messages={this.state.messages}/>
        <Message />
        <ChatBar defaultValue={this.state.currentUser.name} postMessage={this.postMessage} editName={this.editName}/>
      </div>
    );
  }
}
export default App;
