module.exports.config = {
    name: "العق",
    version: "2.2.2",
    hasPermssion: 0,
    credits: "CHIP2502",
    description: "خلي يلحس ابطك",
    commandCategory: "+18",
    usages: "[@tag]",
    cooldowns: 5,
    dependencies: {
        "axios": "",
        "fs-extra": "",
        "path": "",
        "jimp": ""
    }
};

module.exports.onLoad = async() => {
  const { resolve } = global.nodemodule["path"];
  const { existsSync, mkdirSync } = global.nodemodule["fs-extra"];
  const { downloadFile } = global.utils;
  const dirMaterial = __dirname + `/cache/canvas/`;
  const path = resolve(__dirname, 'cache/canvas', 'liemnach.png');
  if (!existsSync(dirMaterial + "canvas")) mkdirSync(dirMaterial, { recursive: true });
  if (!existsSync(path)) await downloadFile("https://i.imgur.com/avEdd36.jpeg", path);
}

async function makeImage({ one, two }) {
  const fs = global.nodemodule["fs-extra"];
  const axios = global.nodemodule["axios"]; 
  const jimp = global.nodemodule["jimp"];
  const path = global.nodemodule["path"];
  const __root = path.resolve(__dirname, "cache", "canvas");

  let batgiam_img = await jimp.read(__root + "/liemnach.png");
  let pathImg = __root + `/liemnach_${one}_${two}.png`;
  let avatarOne = __root + `/avt_${one}.png`;
  let avatarTwo = __root + `/avt_${two}.png`;

  let getAvatarOne = (await axios.get(`https://graph.facebook.com/${two}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarOne, Buffer.from(getAvatarOne, 'utf-8'));

  let getAvatarTwo = (await axios.get(`https://graph.facebook.com/${one}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' })).data;
  fs.writeFileSync(avatarTwo, Buffer.from(getAvatarTwo, 'utf-8'));

  let circleOne = await jimp.read(await circle(avatarOne));
  let circleTwo = await jimp.read(await circle(avatarTwo));
  batgiam_img.composite(circleOne.resize(170, 170), 46, 584).composite(circleTwo.resize(220, 220), 316, 204);

  let raw = await batgiam_img.getBufferAsync("image/png");

  fs.writeFileSync(pathImg, raw);
  fs.unlinkSync(avatarOne);
  fs.unlinkSync(avatarTwo);

  return pathImg;
}

async function circle(image) {
  const jimp = global.nodemodule["jimp"]; // تأكد من تعريف jimp هنا أيضًا
  image = await jimp.read(image);
  image.circle();
  return await image.getBufferAsync("image/png");
}

module.exports.run = async ({ event, api, args }) => {
  const fs = global.nodemodule["fs-extra"];
  const { threadID, messageID, senderID } = event;
  const mention = Object.keys(event.mentions);

  if (!mention[0]) {
    return api.sendMessage("تاغ للبني ادم", threadID, messageID);
  } else {
    const one = senderID, two = mention[0];
    try {
      const path = await makeImage({ one, two });
      if (!path) {
        throw new Error('لم يتم إنشاء مسار الصورة.');
      }
      const imageReadStream = fs.createReadStream(path);
      api.sendMessage({ body: "", attachment: imageReadStream }, threadID, () => {
        fs.unlinkSync(path);
      }, messageID);
    } catch (error) {
      console.error("تعذر إرسال الصورة: ", error);
      api.sendMessage(`حدث خطأ أثناء إنشاء الصورة: ${error.message}`, threadID, messageID);
    }
  }
};
