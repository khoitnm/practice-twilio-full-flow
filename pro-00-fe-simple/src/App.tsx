import React from 'react';
import routingPath from "./common/pagerouting/RoutingPath";
import LoginPage from "./login/LoginPage";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ConversationDetailPage from "./conversation/ConversationDetailPage";
import ConversationsListPage from "./conversation/ConversationsListPage";


function App() {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path={['/', routingPath.login]} component={LoginPage} exact/>
                    <Route path={routingPath.conversationsList} component={ConversationsListPage}/>
                    <Route path={routingPath.conversationDetail} component={ConversationDetailPage}/>
                </Switch>
            </div>
        </BrowserRouter>

    );
}

export default App;
