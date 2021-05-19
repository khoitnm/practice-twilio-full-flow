import React from 'react';
import routingPath from "./common/pagerouting/RoutingPath";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import VideoRoomPage from "./video/VideoRoomPage";
import ConversationPage from "./conversation/ConversationPage";
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className={'navigation-header py-3'}>
        <span className={'navigation-icon px-3'}><i className="bi bi-people"></i></span>
        <a className="navigation-item px-2" href={routingPath.videoRoom}>Video Room</a> |
        <a className="navigation-item px-2" href={routingPath.conversation}>Conversation</a>
      </div>

      <div className={'container-fluid'}>
        <Switch>
          <Route path={routingPath.conversation} component={ConversationPage}/>
          <Route path={['/', routingPath.videoRoom]} component={VideoRoomPage}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
