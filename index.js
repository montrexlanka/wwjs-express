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
  authStrategy: new LocalAuth(),
  puppeteer: {
		args: ['--no-sandbox'],
	}
});


//when the client is ready, start the express server
client.on('ready', async () => {
  myNumber_serialized = client.info.wid._serialized;
  
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(bodyParser.json())

  app.post('/send/text', (req, res) => sendText(client, req, res))
  app.post('/send/media', (req, res) => sendMedia(client, req, res))
  app.post('/create/group', (req, res) => createGroup(client, req, res))
  app.post('/delete/group', (req, res) => deleteGroup(client, req, res))
  app.post('/get/groups', (req, res) => getGroups(client, req, res))

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

});


//send text
async function sendText(client, req, res) {
  let text = req.body.text;
  await client.getChats().then(async chats => {
    chats.forEach(async chat => {
      if (chat.isGroup) {
        if (chat.id._serialized == "120363027998622815@g.us" || chat.id._serialized == "120363044707184103@g.us" || chat.id._serialized == "120363028768225462@g.us") {
          return;
        }
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
  const media = MessageMedia.fromFilePath(json.media)
  const caption = json.caption;
  await client.getChats().then(async chats => {
    chats.forEach(async chat => {
      if (chat.isGroup) {
        if (chat.id._serialized == "120363027998622815@g.us" || chat.id._serialized == "120363044707184103@g.us" || chat.id._serialized == "120363028768225462@g.us") {
          return;
        }
        chat.sendMessage(media, { caption: caption });
      }
    });
  }).catch((erro) => {
    console.log(erro);
  });
  res.send('success')

}

//create a group
async function createGroup(client, req, res) {
  let groupName = req.body.groupName;
  const result = await client.createGroup(groupName, [myNumber_serialized, number]);
  const contact = await client.getContactById(result.gid._serialized)
  const chat = await contact.getChat()
  chat.setMessagesAdminsOnly()
  chat.setInfoAdminsOnly()
  //set group description if exists
  chat.setDescription(req.body.groupDescription!=null?req.body.groupDescription:groupName);
  const inviteLink = 'https://chat.whatsapp.com/' + await chat.getInviteCode();
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

//delete a group
async function deleteGroup(client, req, res) {
  let groupId = req.body.groupId;
  client.getChats().then(async chats => {
    chats.forEach(chat => {
      if (chat.isGroup) {
        if (chat.id._serialized == groupId) {

          //remove all participants
          chat.participants.forEach(participant => {
            if (participant.id._serialized != myNumber_serialized) {
              chat.removeParticipants([participant.id._serialized]);
            }
            // chat.removeParticipants([participant.id._serialized]);
          });
          chat.leave();
          chat.delete();
          return;
        }
      }
    });
  });
  res.send('success')
}

//get all groups
async function getGroups(client, req, res) {
  //send the message to all groups
  await client.getChats().then(async chats => {

    let groupsi = [];
    for (const chat of chats) {

      if (chat.isGroup) {
        //if is_admin
        try {
          if (chat.owner._serialized == myNumber_serialized) {
            
            try {
              const name = chat.name;
              const id = chat.id._serialized;
              let inviteLink;
              try {

                inviteLink = 'https://chat.whatsapp.com/' + await chat.getInviteCode();
              } catch (error) {
                inviteLink = 'cannot obtain link'
              }
              const particpantCount = chat.participants.length;
              const createdAt = new Date(chat.createdAt).toDateString();
              groupsi.push({ name: name, id: id, inviteLink: inviteLink, particpantCount: particpantCount, createdAt: createdAt });
              i++;
            } catch (error) {
            }
          }
        }
        catch (error) {

        }
      }
    }
    res.send(groupsi);
  }
  ).catch((erro) => {
    console.log(erro);
  });
}


client.on('message', message => {
  if (message.body.toLowerCase() === 'hi') {
    message.reply('Hi ' + message._data.notifyName + ' 👋');
  }
});
client.initialize();