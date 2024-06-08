
# PolTect

An AI based Chrome Browser extension to identify political bias in digital news articles.


## Introduction
As we start to live in a increasingly polarised world, it is important that we consume news and other related information by keeping in mind the inevitable bias of authors and publications. PolTect is a simple browser extension that helps you to save your precious time and energy by detecting news articles that are highly polarised and prejudiced.The model is trained on thousands of real news articles, enabling it to identify political bias with sufficient accuracy.
## Run Locally

To run this browser extension locally, make sure that the flask app API is running by using the following command.

```bash
python app.py
```


## Screenshots

| Output Screen | Loading Screen  |
| :-------- |  :----------------|
| ![App Screenshot](https://raw.githubusercontent.com/rubenskx/PolTect/main/images/display.png) | ![App Screenshot](https://raw.githubusercontent.com/rubenskx/PolTect/main/images/loading.png) |





## Current Features

- Displays Percentage of Biasness in input article.
- Uses Pretrained BERT model for classification.
- Displays the total number of paragraphs detected.

## Authors

Ruben Sinu Kurian - https://github.com/rubenskx

