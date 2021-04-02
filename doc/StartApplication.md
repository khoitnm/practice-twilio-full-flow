This sample code include back-end app (server) and front-end app (web app).
Therefore, we'll need to start both server and font-end.

# Server
Before starting the server, we need to configure the Twilio Account:

Step 1: <br/>
In `pro-00-be-simple/src/main/resources/application.yml`
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

Build project with the command line from folder `pro-00-fe-simple`
``` 
npm install
```

Start project (from folder `pro-00-fe-simple`)
``` 
npm start
```

Then in the terminal, we'll see the log say that the web application is running on the port 3001 (configured in `.env`)

Then on the browser (Chrome, for example), 

Open this URL in the first tab:
`localhost:3001`. <br/>
Then join room `room01` with username `user01`

Open the same URL in the second tab:
`localhost:3001`. <br/>
Then join room `room01` with username `user02`

Then we'll see `user01` and `user02` talking to each other.
