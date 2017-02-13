
import React, {Component} from 'react';
import MessageList from './MessageList.jsx';
import Message from './Message.jsx';
import ChatBar from './ChatBar.jsx';
import uuid from 'node-uuid';

var people = {
  currentUser: "Anonymous",
  messages: []
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = people
  }

  componentDidMount() {
    this.connectSocket = new WebSocket('ws://localhost:4000');
    this.connectSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log(data)

      switch(data.type) {
        case "incomingMessage":
          this.setState({
            messages: this.state.messages.concat(data)
          })
          break;
        case "incomingNotification":
        // console.log(data)
          this.setState({
            messages: this.state.messages.concat(data)
          })
          break;
        case "numberOfUsers":
          this.setState({
            numberUsers: data.numberUsers
          })
          break;
        default:
          break;
      }
    }
  }

  postMessage = (textEntered, ev) => {
    const newMessage = {type: 'postMessage', id:uuid.v4(), username: this.state.currentUser, content: textEntered}
    // console.log(newMessage)
    if (ev.key === 'Enter' && textEntered.length > 0 && this.state.currentUser != "Anonymous") {
      ev.target.value='';
      this.connectSocket.send(JSON.stringify(newMessage));
    }
  }

  assignColor = (textEntered, ev) => {

  }

  editName = (textEntered, ev) => {
    let oldName = this.state.currentUser
    // console.log(oldName, "old user in string")
    if (ev.key === 'Enter' && textEntered.length > 0) {
      const newUser = textEntered
      // console.log(newUser, "New User in string")
      const notification = {type: 'postNotification', content: `${oldName} has changed their username to ${newUser}`}
      this.connectSocket.send(JSON.stringify(notification));
      this.setState({
        currentUser: newUser
      })
    }
  }

  render() {
    console.log(this.state.numberUsers)
    return (
      <div>
        <MessageList messages={this.state.messages} numberUsers={this.state.numberUsers}/>
        <ChatBar defaultValue={this.state.currentUser} postMessage={this.postMessage} editName={this.editName}/>
      </div>
    );
  }
}
export default App;
