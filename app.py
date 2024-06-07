from huggingface_hub.inference_api import InferenceApi
from flask import Flask, request, jsonify
app = Flask(__name__)

# Load the saved model and tokenizer
# Load model directly


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
        print(input_text)
        inference = InferenceApi(repo_id="rubenskx/PolTect",
                                 token='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')

        result = inference(input_text)
        print(result[0][0], result[0][1], result[0][2])
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
    app.run(host='0.0.0.0', debug=True)
