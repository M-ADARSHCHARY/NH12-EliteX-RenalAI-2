import React, { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../utils/axiosInstance';
import Results from './Results';

function UserInputForm() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState('Anonymous');
  const [age, setAge] = useState('12');
  const [gender, setGender] = useState('male');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Validation states
  const [nameError, setNameError] = useState('');
  const [ageError, setAgeError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [imageError, setImageError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmp', 'image/tiff'];
      if (!allowedTypes.includes(file.type)) {
        setImageError('Please upload a valid image file (JPEG, PNG, BMP, or TIFF).');
        setImage(null);
        return;
      }
      
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setImageError('Image size should be less than 10MB.');
        setImage(null);
        return;
      }
      
      setImage(file);
      toast.success('Image uploaded successfully!');
    }
  };

  const handleNameChange = (e) => {
    const value = e.target.value;
    setName(value);
    setNameError('');
    
    if (value.trim().length === 0) {
      setNameError('Name is required.');
      return;
    }
    
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(value.trim())) {
      setNameError('Name should contain only letters and spaces.');
      return;
    }
    
    if (value.trim().length < 2) {
      setNameError('Name should be at least 2 characters long.');
      return;
    }
    
    if (value.trim().length > 50) {
      setNameError('Name should be less than 50 characters.');
      return;
    }
  };

  const handleAgeChange = (e) => {
    const value = e.target.value;
    setAge(value);
    setAgeError('');
    
    if (value.trim().length === 0) {
      setAgeError('Age is required.');
      return;
    }
    
    const ageNumber = parseInt(value);
    if (isNaN(ageNumber)) {
      setAgeError('Age must be a valid number.');
      return;
    }
    
    if (ageNumber < 1 || ageNumber > 150) {
      setAgeError('Please enter a valid age between 1 and 150 years.');
      return;
    }
  };

  const handleGenderChange = (e) => {
    const value = e.target.value;
    setGender(value);
    setGenderError('');
    
    if (!value || value.trim().length === 0) {
      setGenderError('Please select a gender.');
      return;
    }
  };

  const handleReset = () => {
    setResult(null);
    setImage(null);
    setName('');
    setAge('');
    setGender('');
    // Clear validation errors
    setNameError('');
    setAgeError('');
    setGenderError('');
    setImageError('');
    toast.success('Form reset successfully!');
  };

  const validateInputs = () => {
    let isValid = true;

    // Reset error states
    setNameError('');
    setAgeError('');
    setGenderError('');
    setImageError('');

    // Validate image
    if (!image) {
      setImageError('Please upload an image before analyzing.');
      toast.error("Please upload an image before analyzing.");
      isValid = false;
    }

    // Validate name
    if (!name || name.trim().length === 0) {
      setNameError('Name is required.');
      toast.error("Please enter a valid name.");
      isValid = false;
    } else {
      const nameRegex = /^[a-zA-Z\s]+$/;
      if (!nameRegex.test(name.trim())) {
        setNameError('Name should contain only letters and spaces.');
        toast.error("Name should contain only letters and spaces.");
        isValid = false;
      } else if (name.trim().length < 2) {
        setNameError('Name should be at least 2 characters long.');
        toast.error("Name should be at least 2 characters long.");
        isValid = false;
      } else if (name.trim().length > 50) {
        setNameError('Name should be less than 50 characters.');
        toast.error("Name should be less than 50 characters.");
        isValid = false;
      }
    }

    // Validate age
    if (!age || age.trim().length === 0) {
      setAgeError('Age is required.');
      toast.error("Please enter a valid age.");
      isValid = false;
    } else {
      const ageNumber = parseInt(age);
      if (isNaN(ageNumber)) {
        setAgeError('Age must be a valid number.');
        toast.error("Age must be a valid number.");
        isValid = false;
      } else if (ageNumber < 1 || ageNumber > 150) {
        setAgeError('Please enter a valid age between 1 and 150 years.');
        toast.error("Please enter a valid age between 1 and 150 years.");
        isValid = false;
      }
    }

    // Validate gender
    if (!gender || gender.trim().length === 0) {
      setGenderError('Please select a gender.');
      toast.error("Please select a gender.");
      isValid = false;
    }

    return isValid;
  };

  const handleAnalyzeImage = async (e) => {
    e.preventDefault();
    
    // Validate all inputs before proceeding
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setResult(null);

    // Show success message for valid inputs
    toast.success("Starting analysis...");

    const formData = new FormData();
    formData.append('image', image);
    formData.append('name', name.trim());
    formData.append('age', age.trim());
    formData.append('gender', gender.toLowerCase());
    
    try {
      const response = await axiosInstance.post('/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success("Analysis completed successfully!");
      setResult(response?.data);
    } catch (error) {
      console.error('Error while analyzing image:', error);
      toast.error(`Analysis failed: ${error.response?.data?.message || error.message || 'Unknown error'}`);
      setResult({ error: 'Failed to analyze image' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Show Results component if we have results */}
      {result && <Results result={result} onReset={handleReset} />}
      
      {/* Show form only if no results */}
      {!result && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
              AI-Powered Kidney Stone Detection
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Upload your medical scan and get instant, accurate analysis using advanced artificial intelligence. 
              Our system helps healthcare professionals detect and analyze kidney stones with precision.
            </p>
            <div className="flex justify-center mt-4 sm:mt-6">
              <div className="flex flex-col sm:flex-row items-center sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-gray-500">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Secure Analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Instant Results</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form */}
          <div className="max-w-4xl mx-auto">
            <form
              onSubmit={handleAnalyzeImage}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Form Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-8 py-4 sm:py-6">
                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">Patient Information & Image Upload</h2>
                <p className="text-blue-100 text-sm sm:text-base">Please fill in the patient details and upload the medical scan</p>
              </div>

              {/* Form Content */}
              <div className="p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Patient Details Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Name Field */}
                  <div className="sm:col-span-2 lg:col-span-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      Patient Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        id="name"
                        type="text"
                        required
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                          nameError 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter patient's full name"
                      />
                    </div>
                    {nameError && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {nameError}
                      </p>
                    )}
                  </div>

                  {/* Age Field */}
                  <div className="sm:col-span-1 lg:col-span-1">
                    <label htmlFor="age" className="block text-sm font-semibold text-gray-700 mb-2">
                      Age *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <input
                        id="age"
                        type="number"
                        required
                        className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition duration-200 ${
                          ageError 
                            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                        value={age}
                        onChange={handleAgeChange}
                        placeholder="Age"
                        min="1"
                        max="150"
                      />
                    </div>
                    {ageError && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {ageError}
                      </p>
                    )}
                  </div>
                </div>

                {/* Gender Field */}
                <div className="grid grid-cols-1 sm:grid-cols-1 gap-4 sm:gap-6">
                  <div>
                    <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                      </div>
                    <select
                      id="gender"
                      required
                      className={`block w-full pl-10 pr-3 py-3 border rounded-lg bg-white focus:outline-none focus:ring-2 transition duration-200 ${
                        genderError 
                          ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      value={gender}
                      onChange={handleGenderChange}
                    >
                      <option value="">Select patient's gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {genderError && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {genderError}
                    </p>
                  )}
                  </div>
                </div>

                {/* File Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Medical Scan Upload *
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition duration-200">
                    <div className="space-y-1 text-center">
                      {!image ? (
                        <>
                          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                required
                                accept="image/*"
                                onChange={handleImageChange}
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, JPEG up to 10MB
                          </p>
                        </>
                      ) : (
                        <div className="space-y-3">
                          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <p className="text-sm font-medium text-gray-900">{image.name}</p>
                          <p className="text-xs text-gray-500">{(image.size / 1024 / 1024).toFixed(2)} MB</p>
                          <button
                            type="button"
                            onClick={() => {
                              setImage(null);
                              setImageError('');
                              toast.success('Image removed successfully!');
                            }}
                            className="text-sm text-red-600 hover:text-red-500"
                          >
                            Remove file
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  {imageError && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {imageError}
                    </p>
                  )}
                </div>

                {/* Image Preview */}
                {image && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Image Preview:</h4>
                    <div className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Medical scan preview"
                        className="w-full max-h-64 object-contain rounded-lg border border-gray-200 shadow-sm"
                      />
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Ready for Analysis
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-4 sm:pt-6">
                  <button
                    type="submit"
                    disabled={!image || !name || !age || !gender || loading}
                    className={`w-full flex justify-center items-center px-4 sm:px-6 py-3 sm:py-4 border border-transparent rounded-lg text-sm sm:text-base font-semibold text-white transition duration-200 ${
                      image && name && age && gender && !loading
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 cursor-pointer'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Scan...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Start AI Analysis
                      </>
                    )}
                  </button>
                  
                  {(!image || !name || !age || !gender) && (
                    <p className="mt-2 text-sm text-gray-500 text-center">
                      Please fill in all required fields and upload an image to proceed
                    </p>
                  )}
                </div>
              </div>
            </form>

            {/* Features Section */}
            <div className="mt-8 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg text-center">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Accurate Detection</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Advanced AI algorithms with 70%+ accuracy in kidney stone identification</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg text-center">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Instant Results</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Get comprehensive analysis results in seconds, not hours</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 sm:p-6 shadow-lg text-center sm:col-span-2 lg:col-span-1">
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <svg className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">Detailed Reports</h3>
                <p className="text-gray-600 text-xs sm:text-sm">Professional PDF reports with analysis and recommendations</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserInputForm;
