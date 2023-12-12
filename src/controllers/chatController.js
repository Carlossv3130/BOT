const Question = require('../models/questionModel');

exports.sendMessage = async (req, res) => {
  try {
    const userMessage = req.body.message;
    const botResponse = await findBotResponse(userMessage);
    
    // Establece un temporizador para preguntar después de 3 minutos
    const timeout = setTimeout(() => {
      const followUpQuestion = '¿Sigues ahí? ¿En qué puedo seguir ayudándote?';
      res.json({ botResponse, followUpQuestion });
    }, 3 * 60 * 1000); // 3 minutos en milisegundos

    res.json({ botResponse, timeout });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

async function findBotResponse(userMessage) {
  try {
    const allQuestions = await Question.find({}, 'question answer');

    // Normaliza la entrada del usuario para hacer la comparación uniforme
    const normalizedUserMessage = userMessage.toLowerCase();

    // Busca la mejor coincidencia de pregunta
    const bestMatch = findBestMatch(normalizedUserMessage, allQuestions.map(q => q.question.toLowerCase()));

    // Obtiene la respuesta correspondiente a la pregunta
    const response = allQuestions.find(q => q.question.toLowerCase() === bestMatch.target);

    return response ? response.answer : 'Lo siento, no entendí la pregunta.';
  } catch (error) {
    console.error('Error finding bot response:', error);
    return 'Ocurrió un error al procesar la pregunta.';
  }
}

function findBestMatch(userMessage, questionArray) {
  const stringSimilarity = require('string-similarity');
  return stringSimilarity.findBestMatch(userMessage, questionArray);
}
