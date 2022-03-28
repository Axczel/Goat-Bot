this.config = {    
  name: "unsend",
  version: "1.0.2",
  author: {
    name: "NTKhang", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Remove bot messages",
  longDescription: "Remove bot messages",
  category: "info",
  guide: "Reply to bot's message with content {p}{n}"
};

module.exports = {
  config: this.config,
  start: async function({ message, api, event, args, globalGoat }) {
		if (event.type != "message_reply") return message.reply('Please reply to the bot's message to be removed');
    if (event.messageReply.senderID != globalGoat.botID) return message.reply('Can't remove other people's messages!!');
	  return api.unsendMessage(event.messageReply.messageID);
  }
};
