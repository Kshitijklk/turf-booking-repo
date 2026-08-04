async function createBox(req, res) {
    res.json({
        message: "createBox",
        venueId: req.params.venueId
    });
}

async function getBoxes(req, res) {
    res.json({
        message: "getBoxes",
        venueId: req.params.venueId
    });
}

async function getBoxById(req, res) {
    res.json({
        message: "getBoxById",
        venueId: req.params.venueId,
        boxId: req.params.boxId
    });
}

async function updateBox(req, res) {
    res.json({
        message: "updateBox",
        venueId: req.params.venueId,
        boxId: req.params.boxId
    });
}

async function deleteBox(req, res) {
    res.json({
        message: "deleteBox",
        venueId: req.params.venueId,
        boxId: req.params.boxId
    });
}

module.exports = {
    createBox,
    getBoxes,
    getBoxById,
    updateBox,
    deleteBox
};