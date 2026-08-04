import requests
import os
from langchain_core.tools import tool

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

# --- NEW TOOL ADDED HERE ---
@tool
def search_buses(source: str, destination: str, date: str) -> str:
    """
    Search for available buses between two cities on a specific date.
    The date must be in YYYY-MM-DD format.
    """
    params = {
        "source": source,
        "destination": destination,
        "date": date
    }
        
    try:
        # Assuming this matches your Spring Boot bus controller endpoint
        response = requests.get(f"{SPRING_BOOT_URL}/buses/search", params=params)
        response.raise_for_status()
        return str(response.json())
    except Exception as e:
        return f"Error connecting to backend: {str(e)}"
# ---------------------------

@tool
def get_destination_info(location: str) -> str:
    """
    Get tourist information, famous places, and tips for a specific destination.
    """
    return f"Here is some information about {location}: You should visit the local markets, museums, and historical landmarks."