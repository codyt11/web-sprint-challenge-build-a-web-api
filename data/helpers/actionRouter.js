const express = require("express");

const Actions = require("./actionModel");

const router = express.Router();

router.use((req, res, next) => {
   console.log("Posts router logger...");
   next();
});

router.get("/", (req, res, next) => {
   Actions.get(req.id)
      .then((action) => {
         res.status(200).json(action);
      })
      .catch((error) => {
         console.log(error);
         next(error);
      });
});

router.post("/", (req, res) => {
    Actions.insert(req.body)
        .then((action) => {
            res.status(201).json(action);
        })
        .catch(() => {
            res.status(404).json({ message: "Could not add new Action." });
        });
});

router.delete("/:id", validatePost, (req, res) => {
    Actions.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({message: "The post has been removed"});
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        error: "The post could not be removed",
      });
    });
});

router.put("/:id", validatePost, (req, res) => {
  const changes = req.body;
  Actions.update(req.params.id, changes)
    .then((action) => {
        if (action) {
            res.status(201).json(action);
        } else {
            res.status(404).json({ message: "Could not make changes." });
        }
    })
    .catch(() => {
      res.status(500).json({error: "The post could not be modified."});
    });
});

// custom middleware

function validatePost(req, res, next) {
   if (req.body.text) {
      next();
   } else if (!req.body) {
      res.status(400).json({ message: "missing post data" });
   } 
}

module.exports = router;