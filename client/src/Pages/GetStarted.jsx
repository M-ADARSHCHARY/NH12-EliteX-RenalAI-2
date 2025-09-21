import React from 'react';
import { Link } from 'react-router-dom';

function GetStarted() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Getting Started with Kidney Stone Detection
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Follow these simple steps to analyze kidney scans and generate comprehensive medical reports
          </p>
        </div>

        {/* Steps Container */}
        <div className="space-y-8">
          
          {/* Step 1: Upload Image */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Upload Your Kidney Scan</h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Start by uploading a high-quality kidney scan image for analysis.
                  </p>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">📋 Requirements:</h4>
                    <ul className="space-y-2 text-blue-800">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        <strong>File formats:</strong> JPG, JPEG, PNG
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        <strong>File size:</strong> Maximum 10MB
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        <strong>Image quality:</strong> Clear, high-resolution medical scan
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                        <strong>Content:</strong> Kidney ultrasound, CT scan, or X-ray image
                      </li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-900 mb-2">💡 Tips for Best Results:</h4>
                    <ul className="space-y-1 text-yellow-800">
                      <li>• Ensure the image is properly oriented</li>
                      <li>• Use images with good contrast and brightness</li>
                      <li>• Avoid blurry or pixelated images</li>
                      <li>• Remove any personal information from the image</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Fill Patient Information */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Enter Patient Information</h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Complete the patient details form to personalize the medical report.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-green-900 mb-2">Required Fields:</h4>
                      <ul className="space-y-2 text-green-800">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          <strong>Patient Name:</strong> Full name (2-50 characters)
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          <strong>Age:</strong> Valid age (1-120 years)
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          <strong>Gender:</strong> Male, Female, or Other
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">🔒 Privacy Notice:</h4>
                      <p className="text-gray-700 text-sm">
                        All patient information is processed securely and used only for generating 
                        the medical report. No data is stored permanently on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: AI Analysis */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">AI-Powered Analysis</h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Our advanced YOLOv8 AI models will analyze your kidney scan for stone detection.
                  </p>
                  
                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">🤖 What Happens During Analysis:</h4>
                    <ul className="space-y-2 text-purple-800">
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Image preprocessing (grayscale conversion, 550x550 standardization)
                      </li>
                      {/* <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Multi-model testing (epoch20.pt, epoch15.pt, epoch10.pt)
                      </li> */}
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Stone detection with confidence scoring
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Size estimation and risk assessment
                      </li>
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                        Location mapping within kidney anatomy
                      </li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-900 mb-2">⏱️ Processing Time:</h4>
                    <p className="text-orange-800">
                      Analysis typically takes 10-30 seconds depending on image complexity and server load.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Review Results */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">4</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Review Detection Results</h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Examine the comprehensive analysis results and annotated kidney scan.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-red-50 rounded-lg p-4">
                      <h4 className="font-semibold text-red-900 mb-2">📊 Results Include:</h4>
                      <ul className="space-y-2 text-red-800">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                          Total number of stones detected
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                          Individual stone details (size, location, risk level)
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                          Annotated scan with highlighted stones
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                          AI confidence scores for each detection
                        </li>
                      </ul>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-4">
                      <h4 className="font-semibold text-indigo-900 mb-2">🎯 Risk Assessment:</h4>
                      <ul className="space-y-2 text-indigo-800">
                        <li><span className="font-semibold text-red-600">High Risk:</span> Large stones (≥10mm)</li>
                        <li><span className="font-semibold text-yellow-600">Medium Risk:</span> Medium stones (5-10mm)</li>
                        <li><span className="font-semibold text-green-600">Low Risk:</span> Small stones (&lt;5mm)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 5: Download PDF Report */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-start space-x-6">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">5</span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Download Comprehensive PDF Report</h3>
                <div className="space-y-4">
                  <p className="text-gray-700">
                    Generate and download a professional medical report for healthcare providers.
                  </p>
                  
                  <div className="bg-teal-50 rounded-lg p-4">
                    <h4 className="font-semibold text-teal-900 mb-2">📄 PDF Report Contains:</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <ul className="space-y-2 text-teal-800">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                          Patient information summary
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                          Detection summary and statistics
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                          Detailed stone analysis table
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                          High-quality annotated scan image
                        </li>
                      </ul>
                      <ul className="space-y-2 text-teal-800">
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                          Risk level guide and legend
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                          AI model information
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                          Generation date and timestamp
                        </li>
                        <li className="flex items-center">
                          <span className="w-2 h-2 bg-teal-500 rounded-full mr-3"></span>
                          Medical disclaimer and notes
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">💾 File Details:</h4>
                    <p className="text-gray-700">
                      <strong>Filename format:</strong> KidneyStone_Report_[PatientName]_[Date].pdf<br/>
                      <strong>File size:</strong> Typically 2-5MB with embedded images<br/>
                      <strong>Compatibility:</strong> Standard PDF format, viewable on all devices
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-yellow-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.314 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">Important Medical Disclaimer</h3>
              <p className="text-yellow-800">
                This AI-powered kidney stone detection system is designed to assist healthcare professionals 
                and should <strong>not replace professional medical diagnosis</strong>. Always consult with 
                qualified healthcare providers for proper medical evaluation, diagnosis, and treatment planning. 
                The results provided are for informational and screening purposes only.
              </p>
            </div>
          </div>
        </div>

        {/* Get Started Button */}
        <div className="text-center mt-12">
          <Link 
            to="/"
            className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg rounded-lg shadow-lg transition duration-200 transform hover:scale-105"
          >
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Analysis Now
          </Link>
        </div>
      </div>
    </div>
  );
}

export default GetStarted;