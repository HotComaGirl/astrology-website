document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    const userDOB = sessionStorage.getItem("dob");
    const userTOB = sessionStorage.getItem("tob");
    const userPOB = sessionStorage.getItem("pob");
    const userAPIKey = "abcd";

    if (!userDOB || !userTOB || !userPOB || !userAPIKey) {
        alert("Missing details! Please fill in your astrology details first.");
        window.location.href = "index.html"; 
    }

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

        const response = await fetch("https://astrology-bot-worker.mahima-gandhi15.workers.dev/", {
            method: "POST",
            headers: { 
                "Authorization": `Bearer ${userAPIKey}`,
                "Content-Type": "application/json" 
            },
            body: JSON.stringify({ query: userText })
        });

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let botResponse = "";

        async function readStream() {
            const { done, value } = await reader.read();
            if (done) return;
            botResponse += decoder.decode(value, { stream: true });
            loadingMessage.textContent = botResponse; // ✅ Update UI dynamically
            await readStream();
        }

        readStream();
        chatBox.scrollTop = chatBox.scrollHeight;
    });
});
