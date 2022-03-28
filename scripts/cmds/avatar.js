this.config = {
  name: "avatar",
  version: "1.0.5",
  author: {
    name: "NTKhang",
    contacts: ""
  },
  cooldowns: 5,
  role: 0, 
  shortDescription: "create anime avatar",
  longDescription: "create anime avatar with signature",
  category: "image",
  guide: {
    body: "{p}{n} <character code or character name> | <background text> | <signature> | <English color name or background color code (hex color)>\n{p}{n} help: see how to use the command",
    attachment: {
      [__dirname+"/cache/hexcolor.png"]: "https://seotct.com/wp-content/uploads/2020/03/code-backgroud.png"
    }
  }
};

module.exports = {
  config: this.config,
  start: async function({ args, message, download }) {
    const fs = require("fs-extra");
    const axios = require("axios");
    if (!args[0] || args[0] == "help") message.guideCmd();
    else {
		  message.reply(`Image initialization, please wait...`);
		  const content = args.join(" ").split("|").map(item => item = item.trim());
		  let idNhanVat, tenNhanvat;
		  const chu_Nen = content[1];
      const chu_Ky  = content[2];
      const colorBg = content[3];
      try {
  		  const dataChracter = (await axios.get("https://goatbot.tk/taoanhdep/listavataranime?apikey=ntkhang")).data.data;
        if (!isNaN(content[0])) {
          idNhanVat = parseInt(content[0]);
          const totalCharacter = dataChracter.length - 1;
          if (idNhanVat > totalCharacter) return message.reply(`Currently only ${totalCharacter} character on system, please enter character id smaller`);
          tenNhanvat = dataChracter[idNhanVat].name;
        }
        else {
          findChracter = dataChracter.find(item => item.name.toLowerCase() == content[0].toLowerCase());
          if (findChracter) {
            idNhanVat = findChracter.stt;
            tenNhanvat = content[0];
          }
          else return message.reply("Cannot find character with name " + content[0] + " in the character list");
        }
      }
      catch(error) {
        const err = error.response.data;
        return message.reply(`There was an error retrieving character data:\n${err.name}: ${err.message}`);
      }
      
      const endpoint = `https://goatbot.tk/taoanhdep/avataranime`;
      const params = {
        id: idNhanVat,
        chu_Nen,
        chu_Ky,
        apikey: "ntkhangGoatBot"
      };
      if (colorBg) params.colorBg = colorBg;
      
      try {
        const response = await axios.get(endpoint, {
          params,
          responseType: "stream"
        });
        message.reply({
          body: `✅ Your Avatar\character: ${tenNhanvat}\nCode: ${idNhanVat}\Text background: ${chu_Nen}\Signature: ${chu_Ky}\nColor: ${colorBg || "default"}`, 
          attachment: response.data
        });
  		}
  		catch(error) {
  		  error.response.data.on("data", function(e) {
          const err = JSON.parse(e);
          message.reply(`An error occurred ${err.name}: ${err.message}`);
        });
		  }
	  }
  }
};
