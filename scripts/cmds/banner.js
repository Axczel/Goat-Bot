this.config = {    
  name: "banner",
  version: "1.0.3",
  author: {
    name: "Axczel", 
    contacts: ""
  },
  cooldowns: 5,
  role: 0,
  shortDescription: "Create online service banners",
  longDescription: "Create cover photo to support online service",
  category: "image",
  guide: "{prefix}banner <facebook> | <zalo> | <phone> | <momo> | <title> | <subtitle> | <titlefacebook> | <info> | [<photo link> | or reply to pictures]"
};

module.exports = {
  config: this.config,
  start: async function({ api, message, event, args, help }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    
    const content = args.join(" ").split("|").map(item => item = item.trim());
    const apikey = "ntkhangGoatBot";
    const facebook      = content[0],
    zalo                = content[1],
    phone               = content[2],
    momo                = content[3],
    title               = content[4],
    subtitle            = content[5],
    titlefacebook       = content[6],
    info                = content[7];
    const avatarurl     = event.messageReply ? ((event.messageReply.attachments.length > 0) ? event.messageReply.attachments[0].url : content[8]) : content[8];
    if (!avatarurl || !avatarurl.includes("http")) return message.reply(`Please enter a valid image link, use help ${this.config.name} for details on how to use the command`);
    const params = { facebook, zalo, phone, momo, title, subtitle, titlefacebook, info, avatarurl, apikey };
    for (const i in params) if (!params[i]) return message.SyntaxError();
    message.reply(`Initializing image, please wait...`);
   
    axios.get("https://goatbot.tk/taoanhdep/banner1", {
      params,
      responseType: "arraybuffer"
    })
    .then(data => {
      const imageBuffer = data.data;
      const pathSave = __dirname + "/cache/banner.jpg";
      fs.writeFileSync(pathSave, Buffer.from(imageBuffer));
      message.reply({
        attachment: fs.createReadStream(pathSave)
      }, () => fs.unlinkSync(pathSave));
    })
    .catch(error => {
      const err = error.response ? JSON.parse(error.response.data.toString()) : error;
      return message.reply(`An error occurred ${err.name} ${err.message}`);
    });
  }
};
