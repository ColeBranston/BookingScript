from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/post-entry', methods=['POST'])
def post_entry():
    data = request.json
    try:
        response = requests.post('http://localhost:4000/api/create/entry', json=data)
        response.raise_for_status()  # Check for HTTP errors
        return jsonify(response.json()), response.status_code
    except requests.exceptions.RequestException as e:
        print(f"HTTP request failed: {e}")
        return jsonify({'error': str(e)}), 500
    except requests.exceptions.JSONDecodeError as e:
        print(f"JSON decode failed: {e}")
        return jsonify({'error': 'Invalid JSON response from server'}), 500

if __name__ == '__main__':
    app.run(port=5000)  # Runs the Flask app on port 5000
