// // Import required modules
// const express = require("express")
// const router = express.Router();

// // Import functions from controller
// const {
//     getAuthor,
//     getAllAuthors,
//     addAuthor,
//     updateAuthor,
//     deleteAuthor
// } = require('../controllers/authorController')

// router.get("/getAll", (req, res) => getAllAuthors(req, res))

// router.get("/get/:id", (req, res) => getAuthor(req, res))

// router.post("/add", (req, res) => addAuthor(req, res))

// router.put("/update/:id", (req, res) => updateAuthor(req, res))

// router.delete("/delete/:id", (req, res) => deleteAuthor(req, res))

// module.exports = router;


// Import required modules
const express = require("express");
const router = express.Router();

// Import functions from controller
const {
    getAuthor,
    getAllAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor
} = require("../controllers/authorController");

// Import upload middleware
const upload = require("../middleware/upload");

// Get all authors
router.get("/getAll", (req, res) => {
    getAllAuthors(req, res);
});

// Get one author
router.get("/get/:id", (req, res) => {
    getAuthor(req, res);
});

// Add author with photo
router.post("/add", upload.single("photo"), (req, res) => {
    addAuthor(req, res);
});

// Update author with optional photo
router.put("/update/:id", upload.single("photo"), (req, res) => {
    updateAuthor(req, res);
});

// Delete author
router.delete("/delete/:id", (req, res) => {
    deleteAuthor(req, res);
});

module.exports = router;

