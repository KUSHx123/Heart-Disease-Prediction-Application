# Heart Disease Prediction

## Project Overview

The Heart Disease Prediction project uses machine learning algorithms to predict the likelihood of heart disease in individuals based on their medical data. This project employs various machine learning models, including Logistic Regression, Decision Trees, and Random Forest Classifiers, to make predictions based on user input.

## Deployment

Hosted on Vercel
🔗 [Live Demo](https://heart-disease-prediction-application.vercel.app/)

## Features

- Predict the likelihood of heart disease based on user input.
- Type-safe integration with APIs using Axios.
- Connection with Supabase for database operations.
- User-friendly interface with React.
- Real-time predictions with visual representation.

## Technologies Used

- **Frontend**: React, TypeScript, Axios, Tailwind CSS
- **Backend**: FastAPI (for model integration and API)
- **Database**: Supabase (for storing user prediction data)
- **Machine Learning**: Python, scikit-learn (Logistic Regression, Random Forest, Decision Tree Classifiers)
- **Hosting**: Vercel (for frontend), GitHub (for version control)
- **Version Control**: Git

## Installation

To get started with the project locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/KUSHx123/Heart-Disease-Prediction-Application.git
   cd Heart-Disease-Prediction-Application
   ```

2. Install dependencies:
   For the frontend:
   ```bash
   npm install
   ```

   For the backend (FastAPI):
   ```bash
   pip install -r requirements.txt
   ```

3. Run the frontend:
   ```bash
   npm start
   ```

4. Run the backend (FastAPI):
   ```bash
   uvicorn main:app --reload
   ```

   Your application should now be running locally at `http://localhost:3000`.

## How It Works

- **Data Input**: Users provide their health data (age, sex, blood pressure, cholesterol, etc.) through the frontend form.
- **Prediction**: The model predicts the likelihood of heart disease based on the input data.
- **Database**: Predictions and user data are stored in the Supabase database.
- **Results**: The results are displayed with appropriate messages (e.g., "Low Risk", "High Risk").

## License

This project is licensed under the **Creative Commons Attribution-NonCommercial 4.0 International License**.

You are free to use, share, and adapt the material for non-commercial purposes as long as you give appropriate credit.

[![License: CC BY-NC 4.0](https://img.shields.io/badge/License-CC%20BY--NC%204.0-lightgrey.svg)](https://creativecommons.org/licenses/by-nc/4.0/)

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.

## Acknowledgments

- [scikit-learn](https://scikit-learn.org/) for the machine learning algorithms.
- [Supabase](https://supabase.io/) for the database services.
- [Vercel](https://vercel.com/) for the frontend deployment.
- [FastAPI](https://fastapi.tiangolo.com/) for building the backend API.

## Contact

- **Kush**: [Email](mailto:kushsinha960@gmail.com)
- **GitHub**: [KUSHx123](https://github.com/KUSHx123)
