from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import random

class CropAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Mock data for Crop Analytics
        data = {
            "crop_health": random.choice(["Optimal", "Good", "Fair"]),
            "soil_moisture": random.randint(30, 80),
            "growth_stage": random.choice(["Vegetative", "Flowering", "Ripening"]),
            "irrigation_status": random.choice(["Required", "Not Required", "Scheduled"]),
            "growth_trend": [
                {"day": "Mon", "value": random.randint(10, 20)},
                {"day": "Tue", "value": random.randint(20, 30)},
                {"day": "Wed", "value": random.randint(30, 45)},
                {"day": "Thu", "value": random.randint(45, 60)},
                {"day": "Fri", "value": random.randint(60, 80)},
            ],
            "soil_moisture_levels": [
                {"time": "06:00", "moisture": random.randint(40, 50)},
                {"time": "12:00", "moisture": random.randint(30, 40)},
                {"time": "18:00", "moisture": random.randint(50, 60)},
                {"time": "00:00", "moisture": random.randint(55, 65)},
            ]
        }
        
        return Response(data)
