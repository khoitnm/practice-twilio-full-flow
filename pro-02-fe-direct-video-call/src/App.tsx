import React from 'react';
import routingPath from "./common/pagerouting/RoutingPath";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ConversationPage from "./conversation/ConversationPage";
import './App.css';
import './common/Common.css';

function App() {
  return (
    <BrowserRouter>

      <div className={'container-fluid'}>
        <Switch>
          <Route path={['/', routingPath.conversation]} component={ConversationPage}/>
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
