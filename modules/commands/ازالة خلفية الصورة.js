module.exports.config = {
  name: 'ازالة',
  version: '1.1.1',
  hasPermssion: 0,
  credits: '𝙉𝘼𝙐𝙂𝙃𝙏𝙔 𝘽𝙍𝘼𝙉𝘿',
  description: 'زيل خلفية الصورة',
  commandCategory: 'ذكاء اصطناعي',
  usages: 'Reply images or url images',
  cooldowns: 2,
  dependencies: {
       'form-data': '',
       'image-downloader': ''
    }
};

const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs-extra');
const path = require('path');
const {image} = require('image-downloader');
module.exports.run = async function({
    api, event, args
}){
    try {
        if (event.type !== "message_reply") return api.sendMessage("𝙔𝙤𝙪 𝙈𝙪𝙨𝙩 𝙍𝙚𝙥𝙡𝙮 𝙏𝙤 𝙖 𝙋𝙝𝙤𝙩𝙤", event.threadID, event.messageID);
        if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("𝙍𝙚𝙥𝙡𝙮 𝙏𝙤 𝘼 𝙋𝙝𝙤𝙩𝙤", event.threadID, event.messageID);
        if (event.messageReply.attachments[0].type != "photo") return api.sendMessage("𝙏𝙝𝙞𝙨 𝙄𝙨 𝙉𝙤𝙩 𝘼 𝙋𝙝𝙤𝙩𝙤", event.threadID, event.messageID);

        const content = (event.type == "message_reply") ? event.messageReply.attachments[0].url : args.join(" ");
        const MtxApi = ["Z9ZJQh5wcdsz94t6hFaWndEd","P8fWdAixhnkgAfWPankTwTd1"]
        const inputPath = path.resolve(__dirname, 'cache', `photo.png`);
         await image({
        url: content, dest: inputPath
    });
        const formData = new FormData();
        formData.append('size', 'auto');
        formData.append('image_file', fs.createReadStream(inputPath), path.basename(inputPath));
        axios({
            method: 'post',
            url: 'https://api.remove.bg/v1.0/removebg',
            data: formData,
            responseType: 'arraybuffer',
            headers: {
                ...formData.getHeaders(),
                'X-Api-Key': MtxApi[Math.floor(Math.random() * MtxApi.length)],
            },
            encoding: null
        })
            .then((response) => {
                if (response.status != 200) return console.error('Error:', response.status, response.statusText);
                fs.writeFileSync(inputPath, response.data);
                return api.sendMessage({ attachment: fs.createReadStream(inputPath) }, event.threadID, () => fs.unlinkSync(inputPath));
            })
            .catch((error) => {
                return console.error('𝙎𝙚𝙧𝙫𝙚𝙧 𝙁𝙖𝙞𝙡. 𝙎𝙩𝙖𝙮 𝙒𝙞𝙩𝙝 𝙐𝙨 𝙄𝙩 𝙒𝙞𝙡𝙡 𝘽𝙚 𝙁𝙞𝙭𝙚𝙙 𝙎𝙤𝙤𝙣.', error);
            });
     } catch (e) {
        console.log(e)
        return api.sendMessage(`𝘾𝙝𝙖𝙣𝙜𝙚𝙞𝙣𝙜 𝙀𝙫𝙚𝙧𝙮𝙩𝙝𝙞𝙣𝙜 𝙄𝙨 𝙉𝙤𝙩 𝙂𝙤𝙤𝙙`, event.threadID, event.messageID);
  }
};