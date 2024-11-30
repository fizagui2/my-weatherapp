from flask import Flask, request, jsonify
import requests
from urllib.parse import unquote, urlencode

app = Flask(__name__)

# Function to add CORS headers
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = 'https://fizagui2.github.io'
    response.headers['Access-Control-Allow-Methods'] = 'GET, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response

# Decode URL parameter
def url_decode(value):
    return unquote(value)

# Encode URL parameter
def url_encode(value):
    return urlencode({'': value})[1:]

@app.route('/weather', methods=['OPTIONS'])
def handle_options():
    response = jsonify()
    response.status_code = 204
    return add_cors_headers(response)

@app.route('/weather', methods=['GET'])
def get_weather():
    city_raw = request.args.get('city', '')

    if not city_raw:
        response = jsonify({"error": "City parameter is required"})
        response.status_code = 400
        return add_cors_headers(response)

    try:
        city = url_decode(city_raw)
        encoded_city = url_encode(city)

        api_key = "7ec2cd6a99306895cb0cdceeae49e64e"  # Replace with your API key
        api_url = f"http://api.openweathermap.org/data/2.5/weather?q={encoded_city}&appid={api_key}&units=imperial"

        api_response = requests.get(api_url)

        if api_response.status_code != 200:
            return add_cors_headers(
                jsonify({"error": "Failed to fetch weather data"}),
                500
            )

        weather_data = api_response.json()

        result = {
            "city": weather_data.get("name"),
            "temperature": weather_data["main"].get("temp"),
            "feels_like": weather_data["main"].get("feels_like"),
            "description": weather_data["weather"][0].get("description"),
            "humidity": weather_data["main"].get("humidity"),
            "wind_speed": weather_data["wind"].get("speed"),
        }
        print(weather_data)

        response = jsonify(result)
        return add_cors_headers(response)

    except Exception as e:
        response = jsonify({"error": "Error parsing weather data"})
        response.status_code = 500
        return add_cors_headers(response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)

