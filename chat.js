sendBtn.addEventListener("click", async () => {
    const userText = userInput.value.trim();
    if (!userText) return;

    const userMessage = document.createElement("div");
    userMessage.classList.add("user-message");
    userMessage.textContent = userText;
    chatBox.appendChild(userMessage);

    userInput.value = "";

    const loadingMessage = document.createElement("div");
    loadingMessage.classList.add("bot-message");
    loadingMessage.textContent = "Thinking...";
    chatBox.appendChild(loadingMessage);

    try {
        const response = await fetch("https://astrology-bot-worker.mahima-gandhi15.workers.dev/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sessionId: sessionStorage.getItem("sessionId"),
                query: userText,
                dob: sessionStorage.getItem("dob"),
                tob: sessionStorage.getItem("tob"),
                pob: sessionStorage.getItem("pob"),
                apiKey: sessionStorage.getItem("apiKey"),
            }),
        });

        const responseData = await response.json();
        loadingMessage.remove();

        if (responseData.choices && responseData.choices.length > 0) {
            const botMessage = document.createElement("div");
            botMessage.classList.add("bot-message");
            botMessage.textContent = responseData.choices[0].message.content;
            chatBox.appendChild(botMessage);
        }

    } catch (error) {
        loadingMessage.remove();
        const errorMessage = document.createElement("div");
        errorMessage.classList.add("bot-message");
        errorMessage.textContent = "Error: " + error.message;
        chatBox.appendChild(errorMessage);
    }
});
