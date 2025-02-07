async function generateImage() {
            const prompt = document.getElementById("imagePrompt").value.trim();
            if (!prompt) {
                alert("Please enter a description for the image.");
                return;
            }

            const imageResult = document.getElementById("imageResult");
            const progressContainer = document.getElementById("progressContainer");
            const progressBar = document.getElementById("progressBar");
            const progressText = document.getElementById("progressText");

            // Reset UI
            imageResult.innerHTML = "";
            progressBar.style.width = "0%";
            progressText.innerText = "Initializing...";
            progressContainer.style.display = "block";

            let progress = 0;
            const progressInterval = setInterval(() => {
                if (progress < 100) {
                    progress += 20;
                    progressBar.style.width = `${progress}%`;
                    if (progress === 20) progressText.innerText = "Generating base structure...";
                    if (progress === 40) progressText.innerText = "Refining details...";
                    if (progress === 60) progressText.innerText = "Enhancing quality...";
                    if (progress === 80) progressText.innerText = "Finalizing...";
                }
            }, 1500); 

            try {
                console.log("🔹 Sending request to API...");
                const response = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev", {
                    method: "POST",
                    headers: {
                        "Authorization": "Bearer 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", 
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ inputs: prompt })
                });

                if (!response.ok) {
                    throw new Error(`API Error: ${response.status} - ${await response.text()}`);
                }

                clearInterval(progressInterval);
                progressBar.style.width = "100%";
                progressText.innerText = "Image Ready!";

                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);

                imageResult.innerHTML = `
                    <p><b>Generated Image:</b></p>
                    <img src="${imageUrl}" alt="AI Generated Image">
                    <br>
                    <a href="${imageUrl}" download="AI-Generated-Image.jpg">
                        <button class="download-btn">Download Image</button>
                    </a>
                `;

            } catch (error) {
                console.error("🚨 Error generating image:", error);
                imageResult.innerHTML = `<p class="error-msg">Failed to generate image. Please try again.</p>`;
            } finally {
                setTimeout(() => {
                    progressContainer.style.display = "none"; 
                }, 1000);
            }
        }
