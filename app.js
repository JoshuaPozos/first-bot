"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const access_token =
  "";

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
      handleEvent(e.sender.id, e);
    });
  }
  res.sendStatus(200);
});

function handleEvent(senderId, e) {
  if (e.message) {
    handleMessage(senderId, e.message);
  } else if (e.postback) {
    handlePostback(senderId, e.postback.payload);
  }
}

function handleMessage(senderId, e) {
  if (e.text) {
    defaultMessage(senderId);
  } else if (e.attachments) {
    handleAttachments(senderId, e);
  }
}

function handlePostback(senderId, payload) {
  switch (payload) {
    case "GET_STARTED_FIRSTBOT":
      console.log(payload);
      break;
  }
}

function handleAttachments(senderId, e) {
  let attachment_type = e.attachments[0].type;
  switch (attachment_type) {
    case "image":
      console.log(attachment_type);
    break;
    case "video":
      console.log(attachment_type);
    break;
    case "audio":
      console.log(attachment_type);
    break;
    case "file":
      console.log(attachment_type);
    break;
  }
}

function defaultMessage(senderId) {
  const messageData = {
    recipient: {
      id: senderId
    },
    message: {
      text: "Hi, soy un bot de messenger. Te invito a utilizar nuestro menu."
    }
  };
  callSendApi(messageData);
}

function callSendApi(res) {
  request(
    {
      uri: "https://graph.facebook.com/v2.11/me/messages",
      qs: {
        access_token: access_token
      },
      method: "POST",
      json: res
    },
    err => {
      if (err) {
        console.log("Ocurrio un error");
      } else {
        console.log("mensaje enviado");
      }
    }
  );
}

/*
 * Listen
 */

app.listen(app.get("port"), () => {
  console.log("Server running on port", app.get("port"));
});
