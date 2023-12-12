document.addEventListener('DOMContentLoaded', function () {
    const chatDisplay = document.getElementById('chat-display');
    const messageInput = document.getElementById('message-input');

    function sendMessage() {
        const userInput = messageInput.value;

        fetch('/api/chat/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userInput }),
        })
        .then(response => response.json())
        .then(data => {
            const messageContainer = document.createElement('div');
            messageContainer.classList.add('message-container');

            const userMessage = document.createElement('div');
            userMessage.classList.add('user-message');
            userMessage.textContent = `You: ${userInput}`;

            const botMessage = document.createElement('div');
            botMessage.classList.add('bot-message');
            botMessage.textContent = `Bot: ${data.botResponse}`;

            messageContainer.appendChild(userMessage);
            messageContainer.appendChild(botMessage);
            chatDisplay.appendChild(messageContainer);

            // Enfocar en el elemento de entrada después de agregar el mensaje
            messageInput.value = '';
            messageInput.focus();

            // Mantener la barra de entrada en la parte inferior
            chatDisplay.scrollTop = chatDisplay.scrollHeight;
        })
        .catch(error => console.error('Error sending message:', error));
    }

    const sendButton = document.getElementById('send-button');
    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendMessage();
        }
    });
});
