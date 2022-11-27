const { Client, LocalAuth } = require('whatsapp-web.js');
const { MessageMedia } = require('whatsapp-web.js');
const express = require('express');
const bodyParser = require('body-parser')
const app = express()


const port = 3000
let myNumber_serialized;
const number = "94775614145@c.us";

//create a new client
const client = new Client({
  authStrategy: new LocalAuth()
});


//when the client is ready, start the express server
client.on('ready', async () => {
  myNumber_serialized = client.info.wid._serialized;
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.post('/send/text', (req, res) => sendText(client, req, res))
  app.post('/send/media', (req, res) => sendMedia(client, req, res))
  app.post('/create/group', (req, res) => createGroup(client, req, res))
  app.post('/get/groups', (req, res) => getGroups(client, req, res))

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

});


//send text
async function sendText(client, req, res) {
  let text = req.body.text;
  await client.getChats().then(chats => {
    chats.forEach(chat => {
      if (chat.isGroup) {
        chat.sendMessage(text);
      }
    });
  });
  res.send('success')
}

//send media
async function sendMedia(client, req, res) {
  //get json
  const json = req.body;
  const media = MessageMedia.fromFilePath(json.image)
  const caption = json.caption;
  await client.sendMessage(number, media, { caption: caption });
  res.send('success')

}

//create a group
async function createGroup(client, req, res) {
  let groupName = req.body.groupName;
  const result = await client.createGroup(groupName, [myNumber_serialized, number]);
  contact = await client.getContactById(result.gid._serialized)
  const chat = await contact.getChat()
  const inviteLink=await chat.getInviteCode();
  //send invite link
  res.send({ groupName: groupName, groupId: result.gid.user, inviteLink: inviteLink });
}

//send to all groups
async function sendMessageToAllGroups(client, req, res) {
  let text = req.body.text;
  //send the message to all groups
  await client.getChats().then(chats => {
    chats.forEach(chat => {
      if (chat.isGroup) {
        if (chat.owner == myNumber_serialized) {
          chat.sendMessage(text);
        }
      }
    });

  });
}

//get all groups
async function getGroups(client, req, res) {
  //send the message to all groups
  let groups = [];
  await client.getChats().then(chats => {
    chats.forEach(async chat => {
      if (chat.isGroup) {
        if (chat.owner == myNumber_serialized) {
          console.log(chat);
          const name = chat.name;
          const id = chat.id._serialized;
          const inviteLink = await getInvite(chat);
          const particpantCount = chat.participants.length;
          const createdAt = new Date(chat.creation).toDateString();
          groups.push({ name: name, id: id, inviteLink: inviteLink, particpantCount: particpantCount, createdAt: createdAt });
        }
      }
    });
  });
  res.send(groups);
}

//get invite link
async function getInvite(chat) {
  if (chat.isGroup) {
    let invite = await chat.getInviteCode().then(invite =>
      console.log('https://chat.whatsapp.com/' + invite)).catch(error => { });
  }
}


client.on('message', message => {
  if (message.body.toLowerCase() === 'hi') {
    message.reply('Hi ' + message._data.notifyName + ' 👋');
  }
});
client.initialize();