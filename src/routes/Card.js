import express from "express";
import { ref as storageRef, getDownloadURL } from "firebase/storage";
import { ref as dbRef, get } from "@firebase/database";
import { storage, db } from "../config.js";
import { success } from "../helper.js";
import NodeCache from "node-cache";

export const router = express.Router();

const cardsInfoRef = dbRef(db, `ygo/`);
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

async function getCardImage(id, type) {
  const cardsImageRef = storageRef(storage, `${type}/${id}.jpg`);
  const url = await getDownloadURL(cardsImageRef);
  return url;
}

router.get("/:id", async (req, res) => {
  try {
    let data;
    if (cardInfoCache.has("data")) data = cardInfoCache.get("data");
    else {
      data = await get(cardsInfoRef);
      cardInfoCache.set("data", data);
    }

    const id = +req.params.id;
    const cardInfo = data.val().find((card) => card.id === id);

    const type = getType(cardInfo);

    const cardImageURL = await getCardImage(id, type);
    const selectedCard = { ...cardInfo, imageUrlStorage: cardImageURL };
    const message = `${selectedCard.name} avec l'ID ${id} a bien été trouvé, et l'URL est ${selectedCard.imageUrlStorage}`;
    res.json(success(message, selectedCard));
  } catch (err) {
    console.error(err);
  }
});
