from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/post-entry', methods=['POST'])
def post_entry():
    data = request.json
    response = requests.post('http://localhost:4000/api/create/entry', json=data)
    return jsonify(response.json()), response.status_code

if __name__ == '__main__':
    app.run(port=5000)  # Runs the Flask app on port 5000
