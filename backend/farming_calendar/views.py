import random
from datetime import datetime, timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

class FarmingCalendarView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        crop_type = user.crop_type or "Soybean"
        sowing_date_str = user.planting_date
        
        if not sowing_date_str:
            # For demo, if not set, assume 15 days ago
            sowing_date = datetime.now().date() - timedelta(days=15)
        else:
            if isinstance(sowing_date_str, str):
                sowing_date = datetime.strptime(sowing_date_str, '%Y-%m-%d').date()
            else:
                sowing_date = sowing_date_str

        # Define crop cycles (Day offsets from sowing)
        CROP_CYCLES = {
            "Soybean": [
                {"day": 1, "task": "Sowing", "icon": "🌱", "desc": "Sow seeds at 2-3cm depth"},
                {"day": 15, "task": "Initial Irrigation", "icon": "💧", "desc": "Provide light watering for germination"},
                {"day": 30, "task": "Fertilizer Application", "icon": "🧪", "desc": "Apply NPK (20:20:20) mix"},
                {"day": 45, "task": "Pest Monitoring", "icon": "🐛", "desc": "Check for Aphids and Stem Fly"},
                {"day": 60, "task": "Weed Control", "icon": "🌿", "desc": "Manual weeding or selective herbicide"},
                {"day": 75, "task": "Secondary Irrigation", "icon": "💧", "desc": "Ensure moisture during pod filling"},
                {"day": 90, "task": "Harvest Preparation", "icon": "🌾", "desc": "Monitor moisture content for harvest"},
                {"day": 105, "task": "Harvesting", "icon": "🚜", "desc": "Harvest when 90% of pods are brown"}
            ],
            "Wheat": [
                {"day": 1, "task": "Sowing", "icon": "🌱", "desc": "Drill sowing with fertilizer"},
                {"day": 21, "task": "Crown Root Initiation", "icon": "💧", "desc": "Critical first irrigation"},
                {"day": 45, "task": "Tillering Stage", "icon": "🧪", "desc": "Top dressing with Urea"},
                {"day": 65, "task": "Jointing Stage", "icon": "💧", "desc": "Second irrigation and weed check"},
                {"day": 85, "task": "Flowering/Heading", "icon": "🐛", "desc": "Check for Rust and Aphids"},
                {"day": 105, "task": "Milking Stage", "icon": "💧", "desc": "Final irrigation"},
                {"day": 125, "task": "Dough Stage", "icon": "🌾", "desc": "Stop irrigation, allow drying"},
                {"day": 140, "task": "Harvesting", "icon": "🚜", "desc": "Harvest when grains are hard"}
            ],
            "Cotton": [
                {"day": 1, "task": "Sowing", "icon": "🌱", "desc": "Sowing at recommended spacing"},
                {"day": 30, "task": "Thinning & Weeding", "icon": "🌿", "desc": "Maintain optimum plant population"},
                {"day": 50, "task": "Flower Bud Initiation", "icon": "🧪", "desc": "Apply growth regulators and nutrients"},
                {"day": 75, "task": "Peak Flowering", "icon": "🐛", "desc": "Monitor for Bollworms"},
                {"day": 100, "task": "Boll Development", "icon": "💧", "desc": "Critical moisture requirement"},
                {"day": 130, "task": "First Picking", "icon": "🚜", "desc": "Pick when bolls are fully opened"},
                {"day": 160, "task": "Final Picking", "icon": "🚜", "desc": "Complete harvest and clear residues"}
            ]
        }

        # Select cycle or default to Soybean
        base_tasks = CROP_CYCLES.get(crop_type, CROP_CYCLES["Soybean"])
        
        # Mock weather data for adjustment
        # In real scenario, fetch from weather service
        rain_prob = random.randint(0, 100)
        temp = random.randint(20, 42)
        
        tasks_with_dates = []
        today = datetime.now().date()
        
        for base in base_tasks:
            task_date = sowing_date + timedelta(days=base["day"] - 1)
            status = "Completed" if task_date < today else "Upcoming"
            
            # AI Adjustments
            current_action = base["desc"]
            adjustment = None
            
            if base["task"] == "Initial Irrigation" or base["task"] == "Secondary Irrigation" or "irrigation" in base["task"].lower():
                if rain_prob > 60:
                    adjustment = "Rain predicted (>60%). Delaying scheduled irrigation to prevent waterlogging."
                elif temp > 38:
                    adjustment = "High temperature detected. Recommend increasing water volume by 20%."
            
            if "Fertilizer" in base["task"] and rain_prob > 70:
                adjustment = "Heavy rain expected. Postpone fertilizer application to avoid runoff."

            tasks_with_dates.append({
                "day": base["day"],
                "date": task_date.strftime('%Y-%m-%d'),
                "task": base["task"],
                "icon": base["icon"],
                "action": current_action,
                "ai_adjustment": adjustment,
                "status": status,
                "is_critical": base["day"] in [1, 90, 140] or "Critical" in base["desc"]
            })

        return Response({
            "crop": crop_type,
            "sowing_date": sowing_date.strftime('%Y-%m-%d'),
            "current_day": (today - sowing_date).days + 1,
            "weather_context": {
                "rain_prob": rain_prob,
                "temp": temp
            },
            "tasks": tasks_with_dates
        }, status=status.HTTP_200_OK)
