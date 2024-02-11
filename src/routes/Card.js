import { Router } from "express";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
// import { ref as dbRef, get } from "@firebase/database";
import { storage, db } from "../config.js";
import { success } from "../helper.js";
import NodeCache from "node-cache";
import { google } from "googleapis";
// import { GoogleAuth } from "google-auth-library";

import { readFileSync } from "node:fs";

export const router = Router();

const CARD_MISC_ID = "117U7NvNMWSrPqD_zKXa7zKhNA3PvOvdM";
const MVC_ID = "1iM4S9EDwbJYzDZ00SK_iesBJ57D6pu_8";
const DRIVE_IMG_ID = "1LkqtP1IMRq4N05qiXK_TmxDfhd0GAvfa";
// const YGO_ID = "1Nx1AQrvGNdwYiwy5zq7PXJNAvFC6bKvI";
const API_KEY = "AIzaSyCXhfo0Gzw8d7IJEMK6zWZ-E5Ou69qwgCM";

// const cardsInfoRef = dbRef(db, `ygo/`);
const cardInfoCache = new NodeCache({ stdTTL: 600 });

function getType(cardInfo) {
  return cardInfo.frameType === "spell"
    ? "spell"
    : cardInfo.frameType === "trap"
    ? "trap"
    : cardInfo.frameType === "token"
    ? "token"
    : cardInfo.frameType === "skill"
    ? "skill"
    : "monster";
}

async function getCardImage(id) {
  // const cardsImageRef = storageRef(storage, `${type}/${id}.jpg`);
  // const url = await getDownloadURL(cardsImageRef);
  // const rawData = readFileSync("./driveImageId.json");
  // const data = JSON.parse(rawData);

  let data;
  if (cardInfoCache.has("driveImageId"))
    data = cardInfoCache.get("driveImageId");
  else {
    data = await downloadFile(DRIVE_IMG_ID);
    cardInfoCache.set("driveImageId", data);
  }
  const urlID = data.find((link) => link.id === id).url;

  return `https://lh3.googleusercontent.com/d/${urlID}`;
}

// router.get("/:id", async (req, res) => {
//   try {
//     let data;
//     if (cardInfoCache.has("data")) data = cardInfoCache.get("data");
//     else {
//       data = await get(cardsInfoRef);
//       cardInfoCache.set("data", data);
//     }

//     const id = +req.params.id;
//     const cardInfo = data.val().find((card) => card.id === id);

//     const type = getType(cardInfo);

//     const cardImageURL = await getCardImage(id, type);
//     const selectedCard = { ...cardInfo, imageUrlStorage: cardImageURL };
//     const message = `${selectedCard.name} avec l'ID ${id} a bien été trouvé, et l'URL est ${selectedCard.imageUrlStorage}`;
//     res.json(success(message, selectedCard));
//   } catch (err) {
//     console.error(err);
//   }
// });

router.get("/:id", async (req, res) => {
  try {
    let data;
    if (cardInfoCache.has("cardInfo")) data = cardInfoCache.get("cardInfo");
    else {
      data = (await downloadFile(CARD_MISC_ID)).data;
      cardInfoCache.set("cardInfo", data);
    }
    // const rawData = readFileSync("./card-misc.json");
    // const data = await JSON.parse(rawData).data;
    // res.json(success("message", data));

    const id = +req.params.id;
    console.log("GOT THE ID");
    const cardInfo = data.find((card) => card.id === id);
    // const type = getType(cardInfo);
    const cardImageURL = await getCardImage(id);
    console.log("GOT THE IMAGE ID");
    const selectedCard = { ...cardInfo, imageUrl: cardImageURL };
    const message = `${selectedCard.name} avec l'ID ${id} a bien été trouvé, et l'URL est ${selectedCard.imageUrl}`;
    res.json(success(message, selectedCard));
    // const message = `${cardInfo.name} avec l'ID ${id} a bien été trouvé.}`;
    // res.json(success(message, cardInfo));
  } catch (err) {
    console.error(err);
  }
  // res.json("JSUIS LA");
});

router.get("/mostViewed/:num", async (req, res) => {
  try {
    // const rawData = readFileSync("./public/mostViewedCard.json");
    // const data = JSON.parse(rawData);
    let data;
    if (cardInfoCache.has("mostViewedCard"))
      data = cardInfoCache.get("mostViewedCard");
    else {
      data = await downloadFile(MVC_ID);
      cardInfoCache.set("mostViewedCard", data);
    }

    const num = +req.params.num;
    const cardInfo = data.slice(0, num);
    const selectedCard = await Promise.all(
      cardInfo.map(async (card) => {
        const url = await getCardImage(card.id);
        return { ...card, imageUrl: url };
      })
    );
    // console.log()
    // const selectedCard = cardInfo.map((card) => {
    //   const obj = { ...cardInfo, imageUrlStorage: cardImageURL };
    //   return obj;
    // });
    // { ...cardInfo, imageUrlStorage: cardImageURL };
    // const cardImageURL = await getCardImage(id);
    const message = `${num} cards have been found`;

    res.json(success(message, selectedCard));
  } catch (err) {
    console.error(err, " 💥💥");
  }
});

async function downloadFile(realFileId) {
  // const auth = new GoogleAuth({
  //   scopes: "https://www.googleapis.com/auth/drive",
  // });

  const service = google.drive({ version: "v3" });

  const fileId = realFileId;
  try {
    console.log("ILL DL FROM GDRIVE");
    const file = await service.files.get({
      fileId: fileId,
      alt: "media",
      key: API_KEY,
    });
    console.log("FINISHED DL FROM GDRIVE");
    return file.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}
