// const Book = require('../models/book')
// const mongoose = require("mongoose");

// const getBook = async (req, res) => {
//   const bookId = req.params.id;

//   Book.findById(bookId, (err, book) => {
//     if (err) {
//       return res.status(400).json({success: false, err});
//     }

//     return res.status(200).json({
//       success: true,
//       book
//     });
//   });
// }

// const getAllBooks = async (req, res) => {
//   Book.aggregate([{
//     $lookup: {
//       from: "authors",
//       localField: "authorId",
//       foreignField: "_id",
//       as: "author"
//     },
//   },
//     {
//       $unwind: "$author"
//     },
//     {
//       $lookup: {
//         from: "genres",
//         localField: "genreId",
//         foreignField: "_id",
//         as: "genre"
//       },

//     },
//     {
//       $unwind: "$genre"
//     },]).exec((err, books) => {
//     if (err) {
//       return res.status(400).json({success: false, err});
//     }

//     return res.status(200).json({
//       success: true,
//       booksList: books
//     });
//   });
// }

// const addBook = async (req, res) => {
//   const newBook = {
//     ...req.body,
//     genreId: mongoose.Types.ObjectId(req.body.genreId),
//     authorId: mongoose.Types.ObjectId(req.body.authorId)
//   }
//   console.log(newBook)
//   Book.create(newBook, (err, book) => {
//     if (err) {
//       return res.status(400).json({success: false, err});
//     }

//     return res.status(200).json({
//       success: true,
//       newBook: book
//     });
//   })
// }

// const updateBook = async (req, res) => {
//   const bookId = req.params.id
//   const updatedBook = req.body

//   Book.findByIdAndUpdate(bookId, updatedBook, (err, book) => {
//     if (err) {
//       return res.status(400).json({success: false, err});
//     }

//     return res.status(200).json({
//       success: true,
//       updatedBook: book
//     });
//   })
// }

// const deleteBook = async (req, res) => {
//   const bookId = req.params.id

//   Book.findByIdAndDelete(bookId, (err, book) => {
//     if (err) {
//       return res.status(400).json({success: false, err});
//     }

//     return res.status(200).json({
//       success: true,
//       deletedBook: book
//     });
//   })
// }

// module.exports = {
//   getBook,
//   getAllBooks,
//   addBook,
//   updateBook,
//   deleteBook
// }

const Book = require("../models/book");
const mongoose = require("mongoose");

const getBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      book,
    });
  } catch (err) {
    console.error("GET BOOK ERROR:", err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


const getAllBooks = async (req, res) => {
  try {
    const books = await Book.aggregate([
      {
        $lookup: {
          from: "authors",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
      {
        $unwind: "$author",
      },
      {
        $lookup: {
          from: "genres",
          localField: "genreId",
          foreignField: "_id",
          as: "genre",
        },
      },
      {
        $unwind: "$genre",
      },
    ]);

    return res.status(200).json({
      success: true,
      booksList: books,
    });
  } catch (err) {
    console.error("GET ALL BOOKS ERROR:", err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


const addBook = async (req, res) => {
  try {
    console.log("ADD BOOK REQUEST");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const {
      name,
      isbn,
      summary,
      isAvailable,
      genreId,
      authorId,
    } = req.body;

    // Validate required fields
    if (!name || name.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Book name is required",
      });
    }

    if (!isbn || isbn.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "ISBN is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(genreId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid genre ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid author ID",
      });
    }

    const newBook = {
      name: name.trim(),
      isbn: isbn.trim(),
      summary: summary || "",
      isAvailable: isAvailable === "true",
      genreId: new mongoose.Types.ObjectId(genreId),
      authorId: new mongoose.Types.ObjectId(authorId),
    };

    // Cloudinary image URL
    if (req.file) {
      newBook.photoUrl = req.file.path;

      console.log("CLOUDINARY BOOK COVER:", req.file.path);
    }

    console.log("NEW BOOK:", newBook);

    const book = await Book.create(newBook);

    return res.status(200).json({
      success: true,
      newBook: book,
    });

  } catch (err) {
    console.error("ADD BOOK ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    console.log("UPDATE BOOK:", bookId);
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid book ID",
      });
    }

    const updatedBook = {
      name: req.body.name,
      isbn: req.body.isbn,
      summary: req.body.summary || "",
      isAvailable: req.body.isAvailable === "true",
      genreId: req.body.genreId,
      authorId: req.body.authorId,
    };

    // Convert IDs to ObjectId
    if (req.body.genreId) {
      updatedBook.genreId = new mongoose.Types.ObjectId(
        req.body.genreId
      );
    }

    if (req.body.authorId) {
      updatedBook.authorId = new mongoose.Types.ObjectId(
        req.body.authorId
      );
    }

    // If a new image is uploaded,
    // replace the old photo URL
    if (req.file) {
      updatedBook.photoUrl = req.file.path;

      console.log(
        "NEW CLOUDINARY BOOK COVER:",
        req.file.path
      );
    }

    const book = await Book.findByIdAndUpdate(
      bookId,
      updatedBook,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    console.log("UPDATED BOOK:", book);

    return res.status(200).json({
      success: true,
      updatedBook: book,
    });

  } catch (err) {
    console.error("UPDATE BOOK ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const book = await Book.findByIdAndDelete(bookId);

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    return res.status(200).json({
      success: true,
      deletedBook: book,
    });

  } catch (err) {
    console.error("DELETE BOOK ERROR:", err);

    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


module.exports = {
  getBook,
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
};