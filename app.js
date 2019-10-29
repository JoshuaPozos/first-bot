"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const access_token = "EAAGDfCSwi3MBAOva0v6eQFKgFdJQswZC5aF1hnpCptOZCmTxCdRDuA5ZAj1eQ2LKffGP8HZCwCNDjeuZAyCLNJeqlpa3L9qAXdoMSDspJS5YDR2P3UZAYQS7rZCx7tXRiQoOBy391rlcILEE4syJyxFId8cJtsUndpNeuGZCW2irenMRspPyQZBRFDXqgxHgb794ZD"

/*
 * Extend of express
 */
const app = express();

/*
 * Set port
 */
app.set("port", 5000);

/*
 * Recive json elements from Facebook API
 */
app.use(bodyParser.json());

/*
 * Path
 */
app.get("/", (req, res) => {
  res.send("Hi Edmund");
});

/*
 * Webhook
 */
app.get("/webhook", function(req, res) {
  if (req.query["hub.verify_token"] === "firstbot_token") {
    res.send(req.query["hub.challenge"]);
  } else {
    res.send("You do not have enough permissions");
  }
});

app.post("/webhook/", function(req, res) {
  const webhook_event = req.body.entry[0];
  if (webhook_event.messaging) {
    webhook_event.messaging.forEach(e => {
      handleMessage(e)
    });
  }
  res.sendStatus(200);
});

function handleMessage(e) {
  const senderId = e.sender.id;
  const messageText = e.message.text;
  const messageData = {
    recipient: {
      id: senderId
    },
    message: {
      text: messageText
    }
  }
  callSendApi(messageData)
}

function callSendApi(res) {
  request({
    "uri": "https://graph.facebook.com/v2.11/me/messages",
    "qs": {
      "access_token": access_token
    },
    "method": "POST",
    "json": res
  },
  err => {
    if(err){
      console.log('Ocurrio un error')
    } else{
      console.log("mensaje enviado")
    }
  }
  )

}

/*
 * Listen
 */

app.listen(app.get("port"), () => {
  console.log("Server running on port", app.get("port"));
});
