// const Author = require('../models/author')


// //read
// const getAuthor = async (req, res) => {
//     const authorId = req.params.id;

//     Author.findById(authorId, (err, author) => {
//         if (err) {
//             return res.status(400).json({ success: false, err });
//         }

//         return res.status(200).json({
//             success: true,
//             author
//         });
//     });
// }

// const getAllAuthors = async (req, res) => {
//     Author.find({}, (err, authors) => {
//         if (err) {
//             return res.status(400).json({ success: false, err });
//         }

//         return res.status(200).json({
//             success: true,
//             authorsList: authors
//         });
//     })
// }

// //create
// const addAuthor = async (req, res) => {
//     const newAuthor = req.body

//     Author.create(newAuthor, (err, author) => {
//         if (err) {
//             return res.status(400).json({ success: false, err });
//         }

//         return res.status(200).json({
//             success: true,
//             newAuthor: author
//         });
//     })
// }

// //update
// const updateAuthor = async (req, res) => {
//     const authorId = req.params.id
//     const updatedAuthor = req.body

//     Author.findByIdAndUpdate(authorId, updatedAuthor, (err, author) => {
//         if (err) {
//             return res.status(400).json({ success: false, err });
//         }

//         return res.status(200).json({
//             success: true,
//             updatedAuthor: author
//         });
//     })
// }


// //delete
// const deleteAuthor = async (req, res) => {
//     const authorId = req.params.id

//     Author.findByIdAndDelete(authorId, (err, author) => {
//         if (err) {
//             return res.status(400).json({ success: false, err });
//         }

//         return res.status(200).json({
//             success: true,
//             deletedAuthor: author
//         });
//     })
// }

// module.exports = {
//     getAuthor,
//     getAllAuthors,
//     addAuthor,
//     updateAuthor,
//     deleteAuthor
// }


const Author = require("../models/author");

// ===============================
// GET ONE AUTHOR
// ===============================
const getAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;

        const author = await Author.findById(authorId);

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            });
        }

        return res.status(200).json({
            success: true,
            author
        });

    } catch (err) {
        console.error("GET AUTHOR ERROR:", err);

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


// ===============================
// GET ALL AUTHORS
// ===============================
const getAllAuthors = async (req, res) => {
    try {
        const authors = await Author.find({});

        return res.status(200).json({
            success: true,
            authorsList: authors
        });

    } catch (err) {
        console.error("GET ALL AUTHORS ERROR:", err);

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


// ===============================
// ADD AUTHOR
// ===============================
const addAuthor = async (req, res) => {
    try {
        console.log("ADD AUTHOR REQUEST");
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const { name, description } = req.body;

        // Check author name
        if (!name || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Author name is required"
            });
        }

        let photoUrl;

        // If user uploaded a photo
        if (req.file) {
            photoUrl = req.file.path;
            console.log("CLOUDINARY PHOTO:", photoUrl);
        } 
        
        // If no photo was uploaded
        else {
            photoUrl = `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;
        }

        const newAuthor = await Author.create({
            name: name.trim(),
            description: description || "",
            photoUrl: photoUrl
        });

        console.log("AUTHOR CREATED:", newAuthor);

        return res.status(200).json({
            success: true,
            newAuthor: newAuthor
        });

    } catch (err) {
        console.error("ADD AUTHOR ERROR:", err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// ===============================
// UPDATE AUTHOR
// ===============================
const updateAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;

        console.log("UPDATE AUTHOR:", authorId);
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        const updatedAuthor = {
            name: req.body.name,
            description: req.body.description || ""
        };

        // If a new photo was uploaded,
        // replace the old photo URL
        if (req.file) {
            updatedAuthor.photoUrl = req.file.path;

            console.log(
                "NEW CLOUDINARY PHOTO:",
                updatedAuthor.photoUrl
            );
        }

        const author = await Author.findByIdAndUpdate(
            authorId,
            updatedAuthor,
            {
                new: true,
                runValidators: true
            }
        );

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            });
        }

        console.log("AUTHOR UPDATED:", author);

        return res.status(200).json({
            success: true,
            updatedAuthor: author
        });

    } catch (err) {
        console.error("UPDATE AUTHOR ERROR:", err);

        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


// ===============================
// DELETE AUTHOR
// ===============================
const deleteAuthor = async (req, res) => {
    try {
        const authorId = req.params.id;

        const author = await Author.findByIdAndDelete(authorId);

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "Author not found"
            });
        }

        return res.status(200).json({
            success: true,
            deletedAuthor: author
        });

    } catch (err) {
        console.error("DELETE AUTHOR ERROR:", err);

        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
};


// ===============================
// EXPORT
// ===============================
module.exports = {
    getAuthor,
    getAllAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor
};

