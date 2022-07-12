This sample code include back-end app (server) and front-end app (web app).
Therefore, we'll need to start both server and font-end.

# Server
Before starting the server, we need to configure the Twilio Account:

Step 1: <br/>
Copy `pro-00-be-simple/src/main/resources/application.yml` to `application-local.yml`, and then replace blow values with your real Twilio Account information:
``` 
  accountSid: ${TWILIO_ACCOUNT_SID}
  apiKey: ${TWILIO_API_KEY}
  apiSecret: ${TWILIO_API_SECRET}
  serviceSid: ${TWILIO_CHAT_SERVICE_SID}
```

Step 2: <br/>
Build project by using this command line in the folder `pro-00-be-simple`:
``` 
mvn clean install -DskipTests
```

Step 3: <br/>
Then start the server by using this command line in a terminal in the folder `pro-00-be-simple`:
``` 
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

After that, you'll see in the log that the server is starting at the port: 8080

# Client (Web App)
We can start either:
- `pro-01-fe-simple` (similar to Zoom call when we have to join a specific room)
- or `pro-02-fe-direct-video-call` (similar to Facebook call)

 
For example, go into folder `pro-02-fe-direct-video-call` and compile the code with the command line: `npm install`
Start project: `npm start`

Then in the terminal, we'll see the log say that the web application is running on the port 3001 (configured in `.env`)

Then on the browser (Chrome, for example), 

Open this URL in the first tab:
`localhost:3001`. <br/>
Then join room `room01` with username `user01`

Open the same URL in the second tab:
`localhost:3001`. <br/>
Then join room `room01` with username `user02`

Then we'll see `user01` and `user02` talking to each other.

# Connecting Video from other devices <br/>

When testing with Video, we must either run **on localhost, or run on https**, running on http won't work.
So let say you have a laptop at start the web server at localhost:3001, then your second device (mobile or laptop, for example) won't be able to connect with http.
On solution to test with second device is using [ngrok](https://ngrok.com/), you can register a free account and use it:
- Register a free account (free forever)
- Download
- Connect to it by using the commandline provided by ngrok when you login into it's [dashboard](https://dashboard.ngrok.com/get-started/setup):
  `./ngrok authtoken xxxxxxxxx_your_auth_token_xxxxxxxxx`
- Then port forward it by using the command line:
  `ngrok http 3001 -host-header="localhost:3001"` (View more at https://stackoverflow.com/questions/45425721/invalid-host-header-when-ngrok-tries-to-connect-to-react-dev-server)

