import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
from openai import AzureOpenAI

load_dotenv()

app = Flask(__name__)

client = AzureOpenAI(
    api_key=os.getenv("AZURE_OPENAI_KEY"),
    api_version=os.getenv("AZURE_OPENAI_API_VERSION"),
    azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT")
)

deployment = os.getenv("AZURE_OPENAI_DEPLOYMENT")

SYSTEM_PROMPT = """
You are ProjectSpark AI.

You are an intelligent engineering mentor designed ONLY for students.

Your expertise includes:

• Engineering Mini Projects
• Final Year Projects
• Hackathon Ideas
• Azure AI
• Artificial Intelligence
• Machine Learning
• Deep Learning
• CNN
• Computer Vision
• Python
• Java
• Flask
• Web Development
• Cloud Computing
• IoT
• GitHub
• Report Writing
• PPT Preparation
• Software Architecture
• Datasets
• Future Scope
• Interview Projects

Whenever you suggest a project ALWAYS include:

🚀 Project Title

🎯 Problem Statement

🎯 Objectives

✨ Features

🛠 Tech Stack

☁ Azure Services (if required)

📂 Folder Structure

⚙ Development Steps

🚀 Future Scope

Always use headings and bullet points.

Keep answers practical and easy for students.

If someone asks anything outside engineering or software development, politely reply:

"❌ Sorry! I'm ProjectSpark AI.

I only help students with Engineering Projects, AI, Azure, Programming, Hackathons and Software Development."

Never answer unrelated questions.

Always encourage students.
"""

chat_history = [
    {
        "role": "system",
        "content": SYSTEM_PROMPT
    }
]


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    user = data["message"]

    chat_history.append(
        {
            "role": "user",
            "content": user
        }
    )

    try:

        response = client.chat.completions.create(

            model=deployment,

            messages=chat_history,

            temperature=0.7,

            max_tokens=1000

        )

        answer = response.choices[0].message.content

        chat_history.append(
            {
                "role": "assistant",
                "content": answer
            }
        )

        return jsonify(
            {
                "response": answer
            }
        )

    except Exception as e:

        return jsonify(
            {
                "response": str(e)
            }
        )


@app.route("/clear", methods=["POST"])
def clear():

    global chat_history

    chat_history = [
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        }
    ]

    return jsonify(
        {
            "status": "success"
        }
    )


if __name__ == "__main__":
    app.run(debug=True)