const express = require("express");

const projectRouter = require("./data/helpers/projectRouter");
const actionRouter = require("./data/helpers/actionRouter");

const helmet = require("helmet");

const server = express();

server.use(express.json());
server.use(helmet());

server.get("/", (req, res) => {
    res.status(200).json({message: "the server is running"})
})
server.use("/api/projects", projectRouter)
server.use("/api/actions", actionRouter);
module.exports = server;