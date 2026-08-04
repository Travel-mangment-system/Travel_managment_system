import os
import requests
from langchain_core.tools import tool

# Matches the environment variable base URL used across your project
SPRING_BOOT_URL = os.getenv("SPRING_BOOT_URL", "http://localhost:8080/api/v1")

@tool
def search_packages(destination: str, budget: float = None) -> str:
    """
    Search for travel holiday packages based on destination and budget.
    """
    params = {"destination": destination}
    if budget:
        params["budget"] = budget
        
    try:
        response = requests.get(f"{SPRING_BOOT_URL}/packages/search", params=params)
        response.raise_for_status()
        return str(response.json())
    except Exception as e:
        return f"Error connecting to backend: {str(e)}"


@tool
def search_buses(source: str, destination: str, date: str) -> str:
    """
    Searches for available buses between two cities on a specific date.
    Use this tool whenever the user wants to book or find a bus.
    """
    try:
        # Uses the correct SPRING_BOOT_URL and matches your Java @RequestParam names
        response = requests.get(
            f"{SPRING_BOOT_URL}/buses/search",
            params={
                "source": source,
                "destination": destination,
                "date": date
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            
            if not data or len(data) == 0:
                return f"No buses found from {source} to {destination} on {date}."
            
            # FIX: We return the raw JSON list directly to the AI.
            # We explicitly tell the AI NOT to loop and to format it using its system prompt.
            return f"Success! Found {len(data)} buses. Raw data: {str(data)}. Format this data for the user as instructed. DO NOT invoke this tool again."
            
        else:
            return f"Failed to fetch bus data. Server returned status {response.status_code}."
            
    except Exception as e:
        return f"Error connecting to backend: {str(e)}"


@tool
def get_destination_info(location: str) -> str:
    """
    Get tourist information, famous places, and tips for a specific destination.
    """
    return f"Here is some information about {location}: You should visit the local markets, museums, and historical landmarks."