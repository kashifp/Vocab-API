const express = require("express");
const bodyParser = require("body-parser");
// const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

mongoose.connect("***********************", {useNewUrlParser: true, useUnifiedTopology: true });

const wordSchema = {
    word: String,
    french: String
};

const Word = mongoose.model("Word", wordSchema);

// Requests for all words

app.route("/words")
.get(function(req, res) {
    Word.find(function(err, foundWords){
        if (!err) {
            res.send(foundWords);
        } else {
            res.send(err);
        }
    });
})
.post(function(req,res) {

    const newWord = new Word({
        word: req.body.word,
        french: req.body.french
    });

    newWord.save(function(err) {
        if (!err) {
            res.send("Added a new article");
        } else {
            res.send(err);
        }
    });

})
.delete(function(req, res) {
    Word.deleteMany(function(err) {
        if (!err) {
            res.send("Deleted all");
        } else {
            res.send(err);
        }
    })
});

// Requests for a word

app.route("/words/:wordName")
.get(function(req,res) {
    Word.findOne({word: req.params.wordName}, function(err, foundWords) {
        if (!err) {
            res.send(foundWords);
        } else {
            res.send("No word found");
        }
    });
})
.put(function(req, res) {
    Word.update(
        {word: req.params.wordName},
        {word: req.body.word, connect: req.body.french},
        {overwrite: true},
        function(err) {
            if (!err) {
                res.send("Updates word");
            } else {
                res.send(err);
            }
        }
    );
})
.patch(function(req, res) {
    Word.update(
        {word: req.params.wordName},
        {$set: req.body},
        function(err) {
            if (!err) {
                res.send("Updated word");
            } else {
                res.send(err);
            }
        }
    );
})
.delete(function(req, res) {
    Word.deleteOne(
        {word: req.params.wordName},
        function(err) {
            if (!err) {
                res.send("Deleted word");
            } else {
                res.send(err);
            }
        }
    );
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});