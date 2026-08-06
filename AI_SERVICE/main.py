from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import your LangChain agent executor
from agent import agent_executor

app = FastAPI(title="TravelHub AI Service")

# Add CORS middleware so your React frontend can communicate with this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],       # Allows requests from any frontend origin
    allow_credentials=False,   # Must be False if allow_origins is ["*"]
    allow_methods=["*"],       # Allows all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],       # Allows all headers
)

# Define the expected JSON payload from React
class ChatRequest(BaseModel):
    message: str

# Expose the API endpoint
@app.post("/api/v1/chat")
async def chat_endpoint(request: ChatRequest):
    # Pass the user's message to the LangChain AgentExecutor
    response = agent_executor.invoke({"input": request.message})
    
    # Return the AI's response to the frontend
    return {
        "sender": "ai",
        "text": response["output"]
    }

# Run the server on port 8000
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)