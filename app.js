const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3001;

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// Serve static files
app.use(express.static('public'));

// Define API endpoints
app.post('/upload', upload.single('file'), (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'Please upload a valid .txt file' });
  }

  const filePath = file.path;

  // Read the uploaded .txt file
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading the file' });
    }

    // Tokenize the text into words
    const words = data.split(/\s+/);

    // Calculate word frequencies
    const wordFrequencies = {};
    words.forEach((word) => {
      const cleanWord = word.toLowerCase().replace(/[^a-zA-Z]/g, ''); // Remove non-alphabetic characters
      if (cleanWord) {
        if (wordFrequencies[cleanWord]) {
          wordFrequencies[cleanWord]++;
        } else {
          wordFrequencies[cleanWord] = 1;
        }
      }
    });

    // Calculate the top 5 most frequent words
    const topWords = Object.keys(wordFrequencies)
      .sort((a, b) => wordFrequencies[b] - wordFrequencies[a])
      .slice(0, 5);

    // Calculate the top 5 most frequent co-occurrences (adjacent word pairs)
    const coOccurrences = {};
    for (let i = 0; i < words.length - 1; i++) {
      const pair = `${words[i]} ${words[i + 1]}`;
      if (coOccurrences[pair]) {
        coOccurrences[pair]++;
      } else {
        coOccurrences[pair] = 1;
      }
    }
    const topCoOccurrences = Object.keys(coOccurrences)
      .sort((a, b) => coOccurrences[b] - coOccurrences[a])
      .slice(0, 5);

    // Return results as JSON
    const results = {
      topWords,
      topCoOccurrences,
      wordFrequencies,
    };

    res.json(results);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
