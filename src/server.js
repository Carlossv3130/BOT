const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://carlossv:Carlos3130@cluster0.brkkvx2.mongodb.net/');
const ChatSchema = new mongoose.Schema({
  category: String,
  questions: [String],
  answers: [String],
});

const ChatModel = mongoose.model('Chat', ChatSchema);

app.use(bodyParser.json());

app.post('/ask', async (req, res) => {
  const userMessage = req.body.message.toLowerCase();

  try {
    const chatData = await ChatModel.findOne({
      category: { $in: ["paneles_solares", "multiplexores"] },
      questions: { $in: [userMessage] },
    });

    if (chatData) {
      if (chatData.category === "paneles_solares") {
        // Procesar la respuesta relacionada con paneles solares
        const randomAnswerIndex = Math.floor(Math.random() * chatData.answers.length);
        const botAnswer = chatData.answers[randomAnswerIndex];
        res.json({ answer: botAnswer });
      } else if (chatData.category === "multiplexores") {
        // Procesar la respuesta relacionada con multiplexores
        const randomAnswerIndex = Math.floor(Math.random() * chatData.answers.length);
        const botAnswer = chatData.answers[randomAnswerIndex];
        res.json({ answer: botAnswer });
      }
    } else {
      // No se comprende la pregunta
      res.json({ answer: "Lo siento, no entendí tu pregunta." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.listen(PORT, () => {
  console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});

