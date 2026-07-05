const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

// Press Enter to Send
input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        sendMessage();
    }
});

// Suggestion Cards
function sendSuggestion(element){
    input.value = element.innerText.replace(/[💡🤖📊☁🧠]/g,"").trim();
    sendMessage();
}

// Get Current Time
function getTime(){

    const now = new Date();

    let h = now.getHours();
    let m = now.getMinutes();

    if(m < 10){
        m = "0" + m;
    }

    return h + ":" + m;
}

// Scroll Down
function scrollBottom(){

    chatBox.scrollTop = chatBox.scrollHeight;

}

// Clear Chat
async function clearChat(){

    await fetch("/clear",{
        method:"POST"
    });

    chatBox.innerHTML=`

    <div class="bot">

        <div class="icon">🤖</div>

        <div class="bubble">

            <h2>Welcome 👋</h2>

            <p><b>ProjectSpark AI</b> is ready to help you.</p>

            <p>Ask me anything about:</p>

            <ul>

                <li>AI Projects</li>
                <li>Azure</li>
                <li>Machine Learning</li>
                <li>Hackathons</li>
                <li>Documentation</li>

            </ul>

        </div>

    </div>

    `;

}

// Main Function
async function sendMessage(){

    const message = input.value.trim();

    if(message==="") return;

    // User Message

    chatBox.innerHTML += `

    <div class="user">

        <div class="icon">👨‍🎓</div>

        <div class="bubble">

            ${message}

            <br><br>

            <small>${getTime()}</small>

        </div>

    </div>

    `;

    input.value="";

    scrollBottom();

    // Typing Animation

    const typing = document.createElement("div");

    typing.className="bot";

    typing.id="typing";

    typing.innerHTML=`

    <div class="icon">

        🤖

    </div>

    <div class="bubble">

        <div class="typing">

            <span></span>

            <span></span>

            <span></span>

        </div>

    </div>

    `;

    chatBox.appendChild(typing);

    scrollBottom();

    try{

        const response = await fetch("/chat",{

            method:"POST",

            headers:{

                "Content-Type":"application/json"

            },

            body:JSON.stringify({

                message:message

            })

        });

        const data = await response.json();

        document.getElementById("typing").remove();

        chatBox.innerHTML += `

        <div class="bot">

            <div class="icon">

                🤖

            </div>

            <div class="bubble">

                ${formatResponse(data.response)}

                <br><br>

                <small>

                    ${getTime()}

                </small>

            </div>

        </div>

        `;

        scrollBottom();

    }

    catch(error){

        document.getElementById("typing").remove();

        chatBox.innerHTML += `

        <div class="bot">

            <div class="icon">

                ❌

            </div>

            <div class="bubble">

                Unable to connect to ProjectSpark AI.

            </div>

        </div>

        `;

    }

}

// Response Formatting
function formatResponse(text){

    // Escape HTML

    text = text.replace(/</g,"&lt;").replace(/>/g,"&gt;");

    // Bold **text**

    text = text.replace(/\*\*(.*?)\*\*/g,"<b>$1</b>");

    // Bullet points

    text = text.replace(/^- /gm,"• ");

    // Line Breaks

    text = text.replace(/\n/g,"<br>");

    return text;

}