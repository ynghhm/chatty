import React, {Component} from 'react';

class MessageList extends Component {
  render() {
    return (
      <div className="wrapper">
        <nav>
          <h1>Chatty</h1>
          <span> {this.props.numberUsers} Users Online</span>
        </nav>
        <div id="message-list">
          {
            this.props.messages.map(function(message, index){
              return (
                <div className="message" key={index}>
                  <span className="username">{message.username}</span>
                  <span className="content">{message.content}</span>
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }
}
export default MessageList;
