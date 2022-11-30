
//sample json for chats
let chats = [
    {
        name: 'Ceylon Bitcoin Meetup',
        id: '120363044707184103@g.us',
        inviteLink: 'https://chat.whatsapp.com/EGuJdlCcGs28pxwnFyOorQ',
        particpantCount: 395,
        createdAt: 'Sun Oct 16 2022',
        isGroup: true
    },
    {
        name: 'harshi menike',
        id: '120363046364514730@g.us'
        inviteLink: 'https://chat.whatsapp.com/BAuoS5oYxsr4f3jqK42OQU',
        particpantCount: 2,
        createdAt: 'Mon Nov 28 2022',
        isGroup: true

    },
    {
        name: 'Announcement Testing',
        id: '120363048121776539@g.us',
        inviteLink: 'https://chat.whatsapp.com/GAzsY031jEZJwthVfzIYu9',
        particpantCount: 3,
        createdAt: 'Fri Nov 04 2022',
        isGroup: true
    },
    {
        name: 'harshi menike',
        id: '120363045655357906@g.us',
        inviteLink: 'https://chat.whatsapp.com/FdqQs3oYMg4Im3dKocaRjD',
        particpantCount: 2,
        createdAt: 'Mon Nov 28 2022',
        isGroup: true
    },
    {
        name: 'harshi huikj',
        id: '120363048746298249@g.us',
        inviteLink: 'https://chat.whatsapp.com/FdI3e2ekgu7JxBsXKjKBE5',
        particpantCount: 2,
        createdAt: 'Mon Nov 28 2022',
        isGroup: true
    },
    {
        name: 'harshi menike',
        id: '120363046152228538@g.us',
        inviteLink: 'https://chat.whatsapp.com/EcBkQl77s08HmPIAKNRlwX',
        particpantCount: 2,
        createdAt: 'Mon Nov 28 2022',
        isGroup: true
    },
    {
        name: 'harshi menike',
        id: '120363029326198643@g.us',
        inviteLink: 'https://chat.whatsapp.com/EKlBg8xCFcMGxzjRcbSFD3',
        particpantCount: 2,
        createdAt: 'Mon Nov 28 2022',
        isGroup: true
    },
    {
        name: 'Ceylon Bitcoin Meetup 2️⃣',
        id: '120363027998622815@g.us',
        inviteLink: 'https://chat.whatsapp.com/IjHkAaB7p6z0NK25DeyuJW',
        particpantCount: 165,
        createdAt: 'Sun Oct 23 2022',
        isGroup: true
    }
]
var groupsi = [];

chats.forEach(async (chat) => {
    if (chat.isGroup) {
        // console.log(myNumber_serialized);
        try {
            const name = chat.name;
            const id = chat.id;
            const inviteLink = chat.inviteLink;
            const particpantCount = chat.particpantCount;
            // console.log(chat);
            const createdAt =chat.createdAt;
            groupsi.push({ name: name, id: id, inviteLink: inviteLink, particpantCount: particpantCount, createdAt: createdAt });
        } catch (error) {
        }
        
    }
});
console.log(groupsi);
