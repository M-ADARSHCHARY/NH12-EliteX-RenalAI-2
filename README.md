<div align="center">

# 🔬 RenalAI - Advanced Medical Imaging Solution for Kidney Stone Detection

*🏆 NeuraX Hackathon Project*

![RenalAI](https://img.shields.io/badge/RenalAI-Medical%20AI-blue?style=for-the-badge&logo=healthcare)
![YOLOv8](https://img.shields.io/badge/YOLOv8-Custom%20Trained-green?style=for-the-badge&logo=python)
![React](https://img.shields.io/badge/React-19.1.1-blue?style=for-the-badge&logo=react)
![Flask](https://img.shields.io/badge/Flask-2.3.0-black?style=for-the-badge&logo=flask)

</div>

---

## 🚀 Hackathon Info

<div align="center">

### 🎯 *NeuraX Hackathon Submission*

**Team ID:** NH12 | **Team Name:** EliteX

*Developed during the NeuraX Hackathon - Innovating AI solutions for healthcare*

</div>

<div align="center">

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📝 Project Overview

**RenalAI** is an advanced medical imaging application that leverages custom-trained YOLOv8 models to detect and analyze kidney stones in medical images. The system provides comprehensive analysis including stone size estimation, risk assessment, and precise location mapping within kidney anatomy.

### 🎯 Key Objectives
- **Accurate Detection**: Multi-model approach for enhanced kidney stone detection accuracy
- **Medical Analysis**: Size estimation, risk assessment, and anatomical location mapping
- **User-Friendly Interface**: Intuitive React-based web application
- **Professional Reporting**: Detailed medical reports with visual annotations

---

## ✨ Features

### 🔍 **AI-Powered Detection**
- **Custom YOLOv8 Models**: Three trained models (epoch10.pt, epoch15.pt, epoch20.pt)
- **Multi-Model Testing**: Cascading model approach for optimal detection
- **High Accuracy**: Confidence-based filtering and risk assessment
- **Real-time Processing**: Fast image analysis and results generation

### 📊 **Medical Analysis**
- **Size Estimation**: Millimeter-precise stone measurements
- **Risk Assessment**: Three-tier risk levels (Low, Medium, High)
- **Location Mapping**: Anatomical positioning (Left/Right kidney, Upper/Middle/Lower pole)
- **Visual Annotations**: Color-coded bounding boxes with stone numbering

### 🖥️ **Modern Web Interface**
- **Responsive Design**: Tailwind CSS for modern, mobile-friendly UI
- **Image Upload**: Support for JPEG, PNG, BMP, TIFF formats
- **Form Validation**: Real-time input validation for user data
- **Results Visualization**: Interactive results display with annotated images
- **PDF Export**: Generate professional medical reports

### 🔒 **Robust Backend**
- **Flask API**: RESTful endpoints for image processing
- **CORS Support**: Cross-origin requests enabled
- **Error Handling**: Comprehensive error management
- **Image Preprocessing**: Grayscale conversion and 550x550 standardization

---

## 🏗️ Architecture

### **System Components**

```
RenalAI/
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── Pages/          # Main application pages
│   │   │   ├── UserInputForm.jsx    # Image upload and user details
│   │   │   ├── Results.jsx          # Detection results display
│   │   │   └── GetStarted.jsx       # Landing page
│   │   └── utils/
│   │       └── axiosInstance.js     # API configuration
│   ├── package.json        # Dependencies and scripts
│   └── vite.config.js      # Vite build configuration
│
├── server/                 # Flask Backend API
│   ├── app.py              # Main Flask application
│   ├── requirements.txt    # Python dependencies
│   ├── test_preprocessing.py # Image preprocessing tests
│   └── runs/
│       └── train/
│           └── test_training/
│               └── weights/          # Custom trained models
│                   ├── epoch10.pt
│                   ├── epoch15.pt
│                   └── epoch20.pt
│
├── README.md               # Project documentation
└── LICENSE                 # MIT License
```

### **Technology Stack**

#### **Frontend**
- **React 19.1.1**: Modern UI library with hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router Dom**: Client-side routing
- **Axios**: HTTP client for API requests
- **React Hot Toast**: Elegant notifications
- **jsPDF & html2canvas**: PDF report generation

#### **Backend**
- **Flask 2.3.0**: Lightweight Python web framework
- **Flask-CORS**: Cross-origin resource sharing
- **YOLOv8 (Ultralytics)**: Object detection models
- **OpenCV**: Computer vision and image processing
- **Pillow (PIL)**: Python image manipulation
- **NumPy**: Numerical computing
- **PyTorch**: Deep learning framework

---

## 🚀 Quick Start

### **Prerequisites**
- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher
- **npm**: 8.0 or higher

### **Installation**

#### **1. Clone Repository**
```bash
git clone https://github.com/yourusername/RenalAI.git
cd RenalAI
```

#### **2. Backend Setup**
```bash
# Navigate to server directory
cd server

# Install Python dependencies
pip install -r requirements.txt

# Start Flask development server
python app.py
```
*Server runs on: http://localhost:5000*

#### **3. Frontend Setup**
```bash
# Navigate to client directory (new terminal)
cd client

# Install Node.js dependencies
npm install

# Start development server
npm run dev
```
*Client runs on: http://localhost:5173*

### **Usage**

1. **Upload Medical Image**: Select kidney scan image (JPEG, PNG, BMP, TIFF)
2. **Enter Patient Details**: Name, age, and gender
3. **Submit for Analysis**: Click "Analyze Image" button
4. **View Results**: Review detected stones with risk assessment
5. **Export Report**: Generate PDF report for medical records

---

## 🔬 AI Model Details

### **Custom YOLOv8 Models**
- **Training Data**: Specialized kidney stone dataset
- **Architecture**: YOLOv8 with custom weights
- **Model Versions**: Three checkpoints for cascading detection
- **Input Size**: 550x550 pixels (preprocessed)
- **Output**: Bounding boxes with confidence scores

### **Detection Process**
1. **Image Preprocessing**: Grayscale conversion and resizing
2. **Multi-Model Testing**: Sequential model evaluation
3. **Confidence Filtering**: Remove low-confidence detections (< 0.1)
4. **Size Estimation**: Pixel-to-millimeter conversion
5. **Risk Assessment**: Combined confidence and size scoring
6. **Location Mapping**: Anatomical position determination

### **Risk Assessment Criteria**
- **Low Risk**: Small stones (<5mm), low confidence
- **Medium Risk**: Medium stones (5-10mm), moderate confidence  
- **High Risk**: Large stones (>10mm), high confidence

---

## 📡 API Documentation

### **Base URL**
```
http://localhost:5000
```

### **Endpoints**

#### **POST /detect**
Main detection endpoint

**Request:**
- **Content-Type**: `multipart/form-data`
- **Fields**:
  - `image`: Image file (JPEG, PNG, BMP, TIFF)
  - `name`: Patient name (string)
  - `age`: Patient age (integer)
  - `gender`: Patient gender (string)

**Response:**
```json
{
  "message": "Kidney stone detection completed",
  "user_details": {
    "name": "John Doe",
    "age": "45",
    "gender": "male"
  },
  "detection_results": {
    "total_stones": 2,
    "detections": [
      {
        "id": 1,
        "confidence": 0.85,
        "bbox": [120, 150, 180, 200],
        "size_mm": 7.2,
        "risk_level": "Medium",
        "area_pixels": 3000,
        "location": "Left Upper Pole of Kidney"
      }
    ],
    "annotated_image": "base64_encoded_image_string",
    "model_type": "YOLOv8-Custom (epoch20.pt)",
    "model_used": "epoch20.pt"
  }
}
```

---

## 🧪 Development

### **Running Tests**
```bash
# Backend preprocessing tests
cd server
python test_preprocessing.py

# Frontend linting
cd client
npm run lint
```

### **Building for Production**
```bash
# Build frontend
cd client
npm run build

# Production server setup
cd server
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### **Environment Variables**
Create `.env` file in server directory:
```env
FLASK_ENV=development
FLASK_DEBUG=True
MODEL_PATH=runs/train/test_training/weights
```

---

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

### **Code Standards**
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ESLint configuration
- **Documentation**: Update README for significant changes
- **Testing**: Add tests for new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NeuraX Hackathon** for providing the platform
- **Ultralytics** for YOLOv8 framework
- **Medical imaging community** for inspiration
- **Open source contributors** for tools and libraries

---

## 📞 Support

For questions, issues, or contributions:

- **Team**: EliteX (NH12)
- **Hackathon**: NeuraX 2025
- **Project**: RenalAI Medical Imaging Solution

---

<div align="center">

**Made with ❤️ for advancing healthcare through AI**

*RenalAI - Empowering medical professionals with intelligent kidney stone detection*

</div>"# NH12-EliteX-RenalAI-2" 
