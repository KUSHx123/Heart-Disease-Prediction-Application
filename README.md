# ❤️ Heart Disease Prediction Application

An AI-powered web application that predicts the likelihood of heart disease based on medical parameters provided by the user. Built using Machine Learning and modern web technologies to assist healthcare professionals and individuals in making informed health decisions.

## 🧠 Features

- 🩺 Predicts heart disease using trained ML models (Logistic Regression, Random Forest, SVM, etc.)
- 📈 Visual representation of results and medical inputs
- 🔒 Secure user authentication system
- 🧾 Stores patient history for future reference (if authenticated)
- 🌐 Country code and mobile number input with flag support (e.g., via `react-phone-input-2`)
- 📊 Real-time prediction dashboard for analysis

## 🛠️ Tech Stack

### 🔙 Backend
- Python 🐍
- FastAPI ⚡
- Machine Learning (scikit-learn, pandas, NumPy)
- Supabase

### 🔚 Frontend
- React.js ⚛️
- TailwindCSS + DaisyUI for UI components
- React Hook Form + Zod for form validation
- Axios for API communication

### 🌍 Deployment
- Vercel (Frontend)
- Render / Railway / Heroku (Backend)

---

## 🧪 Machine Learning Models

- Logistic Regression
- Random Forest Classifier
- Support Vector Machine (SVM)
- KNN

These models are trained on public datasets (e.g., [UCI Heart Disease Dataset](https://archive.ics.uci.edu/ml/datasets/heart+Disease)) and evaluated based on:
- Accuracy
- Precision
- Recall
- F1 Score

---

## 📷 Screenshots

> Add screenshots or GIFs showing the prediction form, output, dashboard, and login screen.

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/KUSHx123/Heart-Disease-Prediction-Application.git
cd Heart-Disease-Prediction-Application
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints (FastAPI)

| Method | Endpoint            | Description                      |
|--------|---------------------|----------------------------------|
| POST   | `/predict`          | Get prediction from ML model     |
| POST   | `/register`         | Create a new user                |
| POST   | `/login`            | Authenticate user credentials    |
| GET    | `/history/{user}`   | Get previous predictions (auth)  |

---

## 🧑‍💻 Usage

1. Go to the homepage and fill in the medical parameters.
2. Submit the form to get a real-time prediction.
3. Create an account to save your predictions.
4. View your previous results on the dashboard.

---

## 🔐 Authentication & Security

- JWT-based user authentication
- Data validation using Pydantic (FastAPI) and Zod (React)
- Protected routes for dashboards and history

---

## 🔮 Future Enhancements

- 🧑‍⚕️ Integration with wearable device data (e.g., smartwatches)
- 📧 Email alerts for high-risk predictions
- 📱 Mobile app version (React Native or Flutter)
- 📊 Admin panel to manage users and insights

---

## 🤝 Contribution

Contributions, issues and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/KUSHx123/Heart-Disease-Prediction-Application/issues).

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📞 Contact

**Kush**  
📧 kushsinha960@gmail.com  
🌐 [Portfolio](https://kush-portfolio52.netlify.app/)  
🔗 [LinkedIn](https://www.linkedin.com/in/kush-raman-sinha-z52/) | [GitHub](https://github.com/KUSHx123)
