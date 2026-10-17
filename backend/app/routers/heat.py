"""
HeatShield AI API Endpoints.
"""

from fastapi import APIRouter, HTTPException
from ..schemas import HeatAnalysisRequest, HeatAnalysisResponse
from ..services.heat_service import heat_service
from ..services.weather_service import weather_service

router = APIRouter()

@router.post("/heat/analyze", response_model=HeatAnalysisResponse)
def analyze_heat(req: HeatAnalysisRequest):
    try:
        result = heat_service.evaluate(
            temperature_c=req.temperature_c,
            relative_humidity_pct=req.relative_humidity_pct,
            wind_speed_kmh=req.wind_speed_kmh or 0.0,
            solar_radiation_wm2=req.solar_radiation_wm2 or 0.0
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Heat analysis calculation error: {str(e)}")

@router.get("/weather/current")
async def get_current_weather(lat: float = 28.6139, lon: float = 77.2090):
    weather_data = await weather_service.get_current_weather(latitude=lat, longitude=lon)
    # Also evaluate heat index on current observation
    heat_eval = heat_service.evaluate(
        temperature_c=weather_data["temperature_c"],
        relative_humidity_pct=weather_data["relative_humidity_pct"],
        wind_speed_kmh=weather_data["wind_speed_kmh"],
        solar_radiation_wm2=weather_data["solar_radiation_wm2"]
    )
    weather_data["heat_analysis"] = heat_eval
    return weather_data
