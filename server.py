from flask import Flask, request, jsonify 
from pymongo import MongoClient

app = Flask(__name__)

# Connect to MongoDB
client = MongoClient('mongodb+srv://ad91482948:112211@cluster0.lynmb.mongodb.net/')
db = client['lapstock_db']
devices_collection = db['devices']

@app.route('/validate', methods=['POST'])
def validate():
    data = request.json
    name = data.get('name')
    token = data.get('token')

    # Check if name and token match (dummy validation for now)
    if name == "lapstock" and token == "12345":
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "error", "message": "Invalid name or token"}), 400

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    print("Received data:", data)  # Debugging line

    serial_number = data.get('serial_number')
    model = data.get('model')
    config = data.get('config')
    storage = data.get('storage')
    ram = data.get('ram')

    if not serial_number or not model or not config:
        return jsonify({"status": "error", "message": "Missing required fields"}), 400

    # Insert device details into MongoDB
    device_data = {
        "serial_number": serial_number,
        "model": model,
        "config": config,
        "storage": storage,
        "ram": ram
    }
    devices_collection.insert_one(device_data)

    return jsonify({"status": "success", "message": "Device registered successfully"})


if __name__ == '__main__':
    app.run(debug=True)