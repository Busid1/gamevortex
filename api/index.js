import { videogames } from "./videogames.js";
import express from "express";
import cors from "cors";

const api = express();

api.use(cors());

api.get("/", (req, res) => {
    return res.send(videogames);
})

api.get("/:game", (req, res) => {
    const gameName = req.params.game;
    const filterGame = videogames.filter(game => game.title == gameName);
    
    if(filterGame.length === 0) {
        return res.status(404).send(`No se encontro ningun juego con el nombre de "${gameName}"`)
    }
    
    return res.send(filterGame);
})

api.get("/games/:tag/:game", (req, res) => {
    const gameName = req.params.tag;
    const filterGame = videogames.filter(game => game.title == gameName);
    
    if(filterGame.length === 0) {
        return res.status(404).send(`No se encontro ningun juego con el nombre de "${gameName}"`)
    }
    
    return res.send(filterGame);
})

api.get("/games/:tag", (req, res) => {
    const gameTag = req.params.tag;
    const filterGameTag = videogames.filter(game => {
        for(let i = 0; i < game.tags.length; i++){
            if(game.tags[i] == gameTag){
                return game
            }
        }
    });

    if(filterGameTag.length === 0) {
        return res.status(404).send(`No se encontro ningun juego con el nombre de "${gameTag}"`)
    }
    
    return res.send(filterGameTag);
})

const PORT = process.env.PORT || 5000;

api.listen(PORT, () => {
    console.log(`The server its listening to port ${PORT}`);
})