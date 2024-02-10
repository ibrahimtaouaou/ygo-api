import { Router } from "express";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
// import { ref as dbRef, get } from "@firebase/database";
import { storage, db } from "../config.js";
import { success } from "../helper.js";
// import NodeCache from "node-cache";

import { readFileSync } from "node:fs";

export const router = Router();

// const cardsInfoRef = dbRef(db, `ygo/`);
// const cardInfoCache = new NodeCache({ stdTTL: 600 });

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
  const rawData = readFileSync("driveImageId.json");
  const data = JSON.parse(rawData);
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
    const rawData = readFileSync("card-misc.json");
    const data = JSON.parse(rawData).data;

    const id = +req.params.id;
    const cardInfo = data.find((card) => card.id === id);

    // const type = getType(cardInfo);

    const cardImageURL = await getCardImage(id);
    const selectedCard = { ...cardInfo, imageUrl: cardImageURL };
    const message = `${selectedCard.name} avec l'ID ${id} a bien été trouvé, et l'URL est ${selectedCard.imageUrl}`;

    res.json(success(message, selectedCard));
    // const message = `${cardInfo.name} avec l'ID ${id} a bien été trouvé.}`;
    // res.json(success(message, cardInfo));
  } catch (err) {
    console.error(err);
  }
});

router.get("/mostViewed/:num", async (req, res) => {
  try {
    const rawData = readFileSync("mostViewedCard.json");
    const data = JSON.parse(rawData);

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
    console.error(err);
  }
});
