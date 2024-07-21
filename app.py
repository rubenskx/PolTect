from flask import Flask, request, jsonify
from huggingface_hub.inference_api import InferenceApi
import os
app = Flask(__name__)

# Load the saved model and tokenizer
# Load model directly

api_token = os.getenv("TOKEN")


@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get JSON data from the request body
        data = request.get_json()

        # Check if 'text' key exists in the JSON data
        if 'text' not in data:
            return jsonify({'error': 'Missing "text" key in the request body'}), 400

        # Get text data from the JSON data
        input_text = data['text']
        inference = InferenceApi(repo_id="rubenskx/PolTect",
                                 token=api_token)

        result = inference(input_text)
        map = {'LABEL_0': 'left', 'LABEL_1': 'center', 'LABEL_2': 'right'}
        return jsonify({
            map[result[0][0]['label']]: result[0][0]['score'],
            map[result[0][1]['label']]: result[0][1]['score'],
            map[result[0][2]['label']]: result[0][2]['score'],
        })

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
