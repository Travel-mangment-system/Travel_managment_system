import os
from datetime import datetime
from dotenv import load_dotenv

# 1. Import ChatGroq
from langchain_groq import ChatGroq

# 2. Import from langchain_classic.agents
from langchain_classic.agents import create_tool_calling_agent, AgentExecutor

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# 3. FIX: Import from langchain_classic.memory instead of langchain.memory
from langchain_classic.memory import ConversationBufferMemory

from tools.travel_tools import search_packages, get_destination_info, search_buses

# Load environment variables (GROQ_API_KEY)
load_dotenv()

# Get today's dynamic date
today_date = datetime.now().strftime("%B %d, %Y")

# 4. Initialize the Groq LLM
llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    groq_api_key=os.getenv("GROQ_API_KEY")
)

# 5. Define System Prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", f"""You are a helpful travel assistant. You have vast general knowledge about travel, geography, and tourist destinations. Use your internal knowledge to suggest places to visit or give general travel advice. 

    Only use tools when the user specifically wants to search for, check, or book a bus or holiday package.
    
    For Holiday Packages: You MUST ensure you have both the 'destination' and 'budget'. 
    If either is missing, ask the user for the missing information. Do NOT ask for passenger count or any other details.
    
    For Bus Bookings: You MUST ensure you have the 'source' (starting city), 'destination', and travel 'date'. 
    If any of these are missing, ask the user for them before calling the tool. 
    Convert informal dates (like 'tomorrow' or 'next week') into YYYY-MM-DD format before searching. 
    Assume today's date is {today_date}.
    """),
    MessagesPlaceholder(variable_name="chat_history"),
    ("human", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

# 6. Combine Tools
tools = [search_packages, get_destination_info, search_buses]

# 7. Create Tool Calling Agent
agent = create_tool_calling_agent(llm, tools, prompt)

# 8. Initialize Conversation Memory
memory = ConversationBufferMemory(
    memory_key="chat_history", 
    return_messages=True
)

# 9. Create Agent Executor
agent_executor = AgentExecutor(
    agent=agent, 
    tools=tools, 
    memory=memory,
    verbose=True
)