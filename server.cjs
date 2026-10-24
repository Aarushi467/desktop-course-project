
const express = require('express');
const fs = require('node:fs');
const path = require('node:path');

const app = express();
const PORT = 3000;

const questionsPath = path.join(__dirname, 'questions.json');

// Allow the React app to request data from this API.
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

app.get('/exam/mcq/:id', (req, res) => {
  try {
    const data = JSON.parse(
      fs.readFileSync(questionsPath, 'utf8')
    );

    const question = data.questions.find(
      (item) => item.id === Number(req.params.id)
    );

    if (!question) {
      return res.status(404).json({
        error: 'Question not found',
      });
    }

    const { correctAnswer, ...publicQuestion } = question;
    res.json(publicQuestion);
  } catch (error) {
    console.error('Could not load questions:', error);
    res.status(500).json({
      error: 'Could not load questions',
    });
  }
});

app.post('/exam/submit', express.json(), (req, res) => {
  try {
    const data = JSON.parse(
      fs.readFileSync(questionsPath, 'utf8')
    );

    const answers = req.body.answers;

    if (!answers || typeof answers !== 'object') {
      return res.status(400).json({
        error: 'Answers are required',
      });
    }

    let score = 0;

    data.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    res.json({
      score,
      total: data.questions.length,
      percentage: Math.round(
        (score / data.questions.length) * 100
      ),
    });
  } catch (error) {
    console.error('Scoring failed:', error);

    res.status(500).json({
      error: 'Could not score exam',
    });
  }
});


app.listen(PORT, () => {
  console.log(`Exam API running at http://localhost:${PORT}`);
});
