from flask import Flask, request, jsonify
import numpy as np
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch.nn.functional as F

app = Flask(__name__)

# Load the saved model and tokenizer
tokenizer = AutoTokenizer.from_pretrained('BERT')
model = AutoModelForSequenceClassification.from_pretrained('PreTrainedModel')


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
        # Tokenize input text
        # left - 0, center - 1, right - 2
        inputs = tokenizer(input_text, return_tensors='pt')

        # Forward pass through the model
        outputs = model(**inputs)

        # Extract probabilities or logits from the output
        logits = outputs.logits

        # Make predictions based on logits or probabilities as needed
        # For example, if it's a binary classification task:
        probabilities = F.softmax(logits, dim=1)
        indx_max = np.argmax(probabilities.detach())
        array = probabilities.detach().numpy()

        result = {
            'left': array[0].tolist()[0],
            'center': array[0].tolist()[1],
            'right': array[0].tolist()[2]
        }

        return jsonify(result)

    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
