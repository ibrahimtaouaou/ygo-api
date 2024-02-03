import express from "express";
import { success } from "./helper.js";
import bodyParser from "body-parser";
import { db, storage } from "./config.js";
import { ref as dbRef, get } from "@firebase/database";
import { ref as storageRef, getDownloadURL } from "firebase/storage";

// id : 18318842

const app = express();
const port = process.env.PORT || 3000;
let cardInfo;

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

// Middleware
app.use(bodyParser.json()); // Parses the strings from http to JSON

const cardsInfoRef = dbRef(db, `ygo/`);
const data = await get(cardsInfoRef);

async function getCardImage(id, type) {
  // const data = await getDocs;
  const cardsImageRef = storageRef(storage, `${type}/${id}.jpg`);
  const url = await getDownloadURL(cardsImageRef);
  return url;
}

app.get("/", (req, res) => {
  res.json("Hello 😊");
});

app.get("/api/cards/id/:id", async (req, res) => {
  try {
    const id = +req.params.id;
    cardInfo = data.val().find((card) => card.id === id);

    const type = getType(cardInfo);
    //   const cardsImageRef = storageRef(storage, `${type}/${id}`);
    //   console.log(cardInfo);
    //   res.json(success("message", `cardInfo : ${cardInfo.name}`));

    const cardImageURL = await getCardImage(id, type);
    const selectedCard = { ...cardInfo, imageUrlStorage: cardImageURL };
    const message = `${selectedCard.name} avec l'ID ${id} a bien été trouvé, et l'URL est ${selectedCard.imageUrlStorage}`;
    res.json(success(message, selectedCard));
  } catch (err) {
    console.error(err);
  }
});

app.listen(port, () =>
  console.log(`Notre appli Node est démarré sur : http://localhost:${port}`)
);
