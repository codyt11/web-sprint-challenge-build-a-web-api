const express = require("express");

const Projects = require("./projectModel");
const Actions = require("./actionModel");

const router = express.Router();

router.post("/", validateProject, (req, res) => {
    Projects.insert(req.body)
        .then((project) => {
            res.status(201).json(project);
        })
        .catch((err) => res.status(500).json({ message: "Database error." }));
});

router.post("/:id/actions", validateAction, (req, res) => {

    Actions.insert(req.body)
        .then((action) => {
            res.status(201).json(action);
        })
        .catch((error) => {
            console.log(error);
            res.status(500).json({ message: "missing action data" });
        });
});

router.get("/", (req, res) => {
    Projects.get(req.id)
        .then((project) => {
            res.status(200).json(project);
        })
        .catch((error) => {
            console.error(error);
            next(error);
        });
});

router.get("/:id", validateProjectId, (req, res) => {
    Projects.getProjectActions(req.params.id).then((project) => {
        if (project) {
            res.status(201).json(project);
        } else {
            next({
                code: 500,
                message:
                    "There was an error fetching the project from the database",
            });
        }
    });
});

router.get("/:id/actions", validateProjectId, (req, res) => {
    Projects.getProjectsAction(req.params.id).then((actions) => {
        if (actions) {
            res.status(200).json(actions);
        } else {
            next({ code: 400, message: "Could not fetch the action." });
        }
    });
});

router.delete("/:id", validateProjectId, (req, res) => {
    Projects.remove(req.params.id).then((user) => {
        if (user) {
            res.status(200).json({
                message: `Project ${req.params.id} has been deleted successfully.`,
            });
        } else {
            next({ code: 400, message: "Project not found." });
        }
    });
});

router.put("/:id", validateProjectId, (req, res) => {
    Projects.update(req.params.id, req.body).then((project) => {
        if (project) {
            res.status(200).json({
                message: `Project ${req.params.id} has been changed successfully.`,
            });
        } else {
            next({
                code: 404,
                message: "Could not find the user to apply the changes.",
            });
        }
    });
});

//custom middleware

function validateProjectId(req, res, next) {
    Projects.getProjectActions(req.params.id)
        .then((project) => {
            if (project) {
                next();
            } else {
                res.status({ code: 400, message: "invalid project id" });
            }
        })
        .catch((error) => {
            res.status(500).json({ message: "server error, try again later." });
        });
}

function validateProject(req, res, next) {
    if (req.body && Object.keys(req.body).length > 0) {
        next();
    } else {
        next({ message: "missing project data" });
    }
}

function validateAction(req, res, next) {
    if (req.body && Object.keys(req.body).length > 0) {
        next();
    }
    if (!req.body) {
        next({ code: 400, message: "missing action data" });
    }
    if (!req.body.text) {
        next({ code: 400, message: "missing required text field" });
    }
}

module.exports = router;