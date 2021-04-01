import React from 'react';
import routingPath from "./common/pagerouting/RoutingPath";
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import VideoRoomPage from "./video/VideoRoomPage";


function App() {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    {/*<Route path={['/', routingPath.login]} component={LoginPage} exact/>*/}
                    {/*<Route path={routingPath.conversationsList} component={ConversationsListPage}/>*/}
                    {/*<Route path={routingPath.conversationDetail} component={ConversationDetailPage}/>*/}
                    <Route path={['/', routingPath.videoRoom]} component={VideoRoomPage}/>
                </Switch>
            </div>
        </BrowserRouter>

    );
}

export default App;
