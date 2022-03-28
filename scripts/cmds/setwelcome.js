this.config = {    
  name: "setwelcome",
  version: "1.0.1",
  author: {
    name: "NTKhang", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "edit the text of the welcome message",
  longDescription: "edit the text of the message to welcome new members to your chat group",
  category: "custom",
  guide: "{p}{n} text [<content>|reset]: Edit text content or reset to default, available shortcuts:"
       + "\n+ {userName}: new member's name"
       + "\n+ {boxName}:  the name of the chat group"
       + "\n+ {multiple}: you || you"
       + "\n+ {session}:  session of the day"
       + "\n* For example: {p}{n} text Hello {userName}, welcome to {boxName}, chúc {multiple} a new day fun"
       + "\n"
       + "\nReply (feedback) a message with a file with the content {p}{n} file: to send that file when there is a new member (photo, video, audio)"
       + "\n{p}{n} file reset: delete send file"
};

module.exports = {
  config: this.config,
  start: async function({ args, threadsData, globalGoat, message, event, download }) {
    const fs = require("fs-extra");
    const { threadID } = event;
    const data = (await threadsData.getData(threadID)).data;
    
    if (args[0] == "text") {
      if (!args[1]) return message.reply("Please enter message text");
      else if (args[1] == "reset") data.welcomeMessage = null;
      else data.welcomeMessage = args.slice(1).join(" ");
    }
    else if (args[0] == "file") {
      if (args[1] == "reset") {
        try {
          fs.unlinkSync(__dirname+"/../events/src/mediaWelcome/" + data.welcomeAttachment);
        }
        catch(e){}
        data.welcomeAttachment = null;
      }
      else if (!event.messageReply || event.messageReply.attachments.length == 0) return message.reply("Vui lòng reply (phản hồi) một tin nhắn có chứa file ảnh/video/audio");
      else {
        const attachments = event.messageReply.attachments;
        const typeFile = attachments[0].type;
        const ext = typeFile == "audio" ? ".mp3" :
        typeFile == "video" ? ".mp4" :
        typeFile == "photo" ? ".png" : 
        typeFile == "animated_image" ? ".gif" : "";
        const fileName = "welcome" + threadID + ext;
        await download(attachments[0].url, __dirname+"/../events/src/mediaWelcome/"+fileName);
        data.welcomeAttachment = fileName;
      }
    }
    else return message.SyntaxError();
    
    await threadsData.setData(threadID, {
      data
    }, (err, info) => {
      if (err) return message.reply(`An error occurred, please try again later: ${err.name}: ${err.message}`);
      message.reply(`Saved your changes`);
    });
    
  }
};
