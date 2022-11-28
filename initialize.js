const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

//create a new client
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
		args: ['--no-sandbox'],
	}
});

//show the qr code
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

//when the client is ready
client.on('ready', () => {
  console.log('Client is ready!');
});

client.on('message', message => {
  console.log(message);
});

client.on('message', message => {
	if(message.body === '!ping') {
		message.reply('pong');
	}
});
client.initialize();