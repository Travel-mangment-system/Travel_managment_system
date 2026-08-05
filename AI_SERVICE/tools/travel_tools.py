import os
import requests
from langchain_core.tools import tool
from typing import Optional

# Matches the environment variable base URL used across your project
SPRING_BOOT_URL = os.getenv("SPRING_BOOT_URL", "http://localhost:8080/api/v1")

@tool
def search_packages(destination: str, budget: Optional[float] = None) -> str:
    """
    Search for travel holiday packages based ONLY on destination and an optional budget.
    
    CRITICAL INSTRUCTIONS FOR AI:
    1. NEVER ask the user for the number of travelers, passengers, or group size.
    2. If the user provides a destination, trigger this tool immediately.
    3. If budget is missing, run the search without it. Do not ask for it.
    4. Format the raw JSON output beautifully for the user.
    """
    params = {"destination": destination}
    if budget:
        params["budget"] = budget
        
    try:
        # Hitting the specific CustomerPackageController endpoint
        response = requests.get(f"{SPRING_BOOT_URL}/customer/packages/search", params=params)
        response.raise_for_status()
        data = response.json()
        
        # Inside search_packages tool
        if not data or len(data) == 0:
            return f"EMPTY_RESULT: No travel packages found for {destination}. Tell the user exactly: 'I'm sorry, but there are no holiday packages available for {destination} right now.'"
        
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
                return f"EMPTY_RESULT: No buses found from {source} to {destination}. Tell the user exactly: 'I'm sorry, but there are no buses available for this route on your selected date.'"
            
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