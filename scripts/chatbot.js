    <script>
        let messageHistory = [];

        async function sendMessage() {
            const userInputElement = document.getElementById("userInput");
            const chatbox = document.getElementById("chatbox");
            const userInput = userInputElement.value.trim();
            if (!userInput) return;

            chatbox.innerHTML += `<div class='message user-message'><b>You:</b> ${userInput}</div>`;
            userInputElement.value = "";

            messageHistory.push({ role: "user", content: userInput });
            chatbox.innerHTML += `<div class='message bot-message'><b>Bot:</b> <i>Thinking...</i></div>`;
            chatbox.scrollTop = chatbox.scrollHeight;

            try {
                const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer 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",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: messageHistory,
                        temperature: 0.7,
                        max_tokens: 100
                    })
                });

                const data = await response.json();
                let botResponse = "Sorry, I couldn't understand.";

                if (data.choices && data.choices.length > 0) {
                    botResponse = data.choices[0].message.content;
                }

                chatbox.lastChild.innerHTML = `<div class='message bot-message'><b>Bot:</b> ${botResponse}</div>`;
                messageHistory.push({ role: "assistant", content: botResponse });
            } catch (error) {
                chatbox.lastChild.innerHTML = `<div class='message bot-message'><b>Bot:</b> Error connecting to API.</div>`;
                console.error("API error:", error);
            }
            chatbox.scrollTop = chatbox.scrollHeight;
        }

        function handleKeyPress(event) {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        }
    </script>
