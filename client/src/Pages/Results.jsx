import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

function Results({ result, onReset }) {
  const resultsRef = useRef();
  console.log(result);
  if (!result) return null;



  // Enhanced PDF Download Function with proper structure
  const downloadPDF = async () => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;
      let yPosition = margin;

      // Helper function to add text with proper formatting
      const addText = (text, x, y, options = {}) => {
        const { 
          fontSize = 12, 
          fontStyle = 'normal', 
          color = [0, 0, 0],
          align = 'left',
          maxWidth = contentWidth
        } = options;
        
        pdf.setFontSize(fontSize);
        pdf.setFont('helvetica', fontStyle);
        pdf.setTextColor(...color);
        
        if (align === 'center') {
          pdf.text(text, pageWidth / 2, y, { align: 'center', maxWidth });
        } else {
          pdf.text(text, x, y, { maxWidth });
        }
        
        return y + fontSize * 0.6; // Return next y position
      };

      // Helper function to add a section separator
      const addSeparator = (y) => {
        pdf.setDrawColor(200, 200, 200);
        pdf.line(margin, y, pageWidth - margin, y);
        return y + 10;
      };

      // 1. Header Section
      yPosition = addText('KIDNEY STONE DETECTION REPORT', 0, yPosition, {
        fontSize: 20,
        fontStyle: 'bold',
        color: [41, 128, 185],
        align: 'center'
      });

      yPosition = addText(`Generated on ${new Date().toLocaleDateString()}`, 0, yPosition + 5, {
        fontSize: 10,
        color: [128, 128, 128],
        align: 'center'
      });

      yPosition = addSeparator(yPosition + 15);

      // 2. Patient Information Section
      yPosition = addText('PATIENT INFORMATION', margin, yPosition, {
        fontSize: 16,
        fontStyle: 'bold',
        color: [52, 73, 94]
      });

      yPosition += 10;

      // Patient details in a structured format
      const patientInfo = [
        ['Name:', result.user_details?.name || 'N/A'],
        ['Age:', result.user_details?.age || 'N/A'],
        ['Gender:', result.user_details?.gender || 'N/A']
      ];

      patientInfo.forEach(([label, value]) => {
        addText(label, margin, yPosition, { fontSize: 12, fontStyle: 'bold' });
        addText(value, margin + 40, yPosition, { fontSize: 12 });
        yPosition += 8;
      });

      yPosition = addSeparator(yPosition + 10);

      // 3. Detection Summary Section
      yPosition = addText('DETECTION SUMMARY', margin, yPosition, {
        fontSize: 16,
        fontStyle: 'bold',
        color: [52, 73, 94]
      });

      yPosition += 10;

      // Create a summary box
      pdf.setFillColor(240, 248, 255);
      pdf.rect(margin, yPosition - 5, contentWidth, 25, 'F');
      
      addText('Total Stones Detected:', margin + 5, yPosition + 5, { fontSize: 12, fontStyle: 'bold' });
      addText(`${result.detection_results?.total_stones || 0}`, margin + 5, yPosition + 15, {
        fontSize: 18,
        fontStyle: 'bold',
        color: [41, 128, 185]
      });

      addText('Model Used:', margin + 80, yPosition + 5, { fontSize: 12, fontStyle: 'bold' });
      addText(result.detection_results?.model_type || 'Unknown', margin + 80, yPosition + 15, { fontSize: 12 });

      yPosition += 35;

      // 4. Individual Stone Details (if any)
      if (result.detection_results?.detections && result.detection_results.detections.length > 0) {
        yPosition = addText('STONE DETAILS', margin, yPosition, {
          fontSize: 16,
          fontStyle: 'bold',
          color: [52, 73, 94]
        });

        yPosition += 10;

        result.detection_results.detections.forEach((stone, index) => {
          // Check if we need a new page
          if (yPosition > pageHeight - 60) {
            pdf.addPage();
            yPosition = margin;
          }

          // Stone header
          addText(`Stone #${stone.id || index + 1}`, margin, yPosition, {
            fontSize: 14,
            fontStyle: 'bold'
          });

          // Risk level with color coding
          const riskColor = stone.risk_level?.toLowerCase() === 'high' ? [220, 38, 38] :
                          stone.risk_level?.toLowerCase() === 'medium' ? [217, 119, 6] :
                          [22, 163, 74];

          addText(`${stone.risk_level || 'Unknown'} Risk`, margin + 100, yPosition, {
            fontSize: 12,
            fontStyle: 'bold',
            color: riskColor
          });

          yPosition += 15;

          // Stone details in table format
          const stoneDetails = [
            ['Confidence:', `${((stone.confidence || 0) * 100).toFixed(1)}%`],
            ['Size:', `${stone.size_mm || 'N/A'} mm`],
            ['Area:', `${stone.area_pixels || 'N/A'} pixels`]
          ];

          stoneDetails.forEach(([label, value]) => {
            addText(label, margin + 10, yPosition, { fontSize: 11, fontStyle: 'bold' });
            addText(value, margin + 60, yPosition, { fontSize: 11 });
            yPosition += 7;
          });

          yPosition += 10;
        });
      }

      // 5. Add annotated image if available
      if (result.detection_results?.annotated_image) {
        // Check if we need a new page for the image
        if (yPosition > pageHeight - 100) {
          pdf.addPage();
          yPosition = margin;
        }

        yPosition = addText('ANNOTATED SCAN', margin, yPosition, {
          fontSize: 16,
          fontStyle: 'bold',
          color: [52, 73, 94]
        });

        yPosition += 10;

        try {
          // Calculate image dimensions to fit in PDF
          const maxWidth = contentWidth;
          const maxHeight = 120; // Reserve space for image
          
          // Add image to PDF directly from base64
          const imgData = result.detection_results.annotated_image.startsWith('data:') 
            ? result.detection_results.annotated_image 
            : `data:image/png;base64,${result.detection_results.annotated_image}`;

          // Center the image
          const imgX = margin + (contentWidth - maxWidth) / 2;

          // Add image to PDF
          pdf.addImage(imgData, 'PNG', imgX, yPosition, maxWidth, maxHeight);
          
          yPosition += maxHeight + 10;
          
          addText('Detected stones are highlighted with colored bounding boxes', 0, yPosition, {
            fontSize: 10,
            color: [128, 128, 128],
            align: 'center'
          });

          yPosition += 20;
        } catch (error) {
          console.warn('Could not add image to PDF:', error);
          addText('Annotated image could not be included in the PDF', margin, yPosition, {
            fontSize: 11,
            color: [128, 128, 128]
          });
          yPosition += 15;
        }
      }

      // 6. Risk Level Legend
      if (yPosition > pageHeight - 80) {
        pdf.addPage();
        yPosition = margin;
      }

      yPosition = addText('RISK LEVEL GUIDE', margin, yPosition, {
        fontSize: 14,
        fontStyle: 'bold',
        color: [52, 73, 94]
      });

      yPosition += 10;

      const riskLevels = [
        { level: 'High Risk', color: [220, 38, 38], desc: 'Large stones (>=10mm) with high confidence' },
        { level: 'Medium Risk', color: [217, 119, 6], desc: 'Medium stones (5-10mm) or moderate confidence' },
        { level: 'Low Risk', color: [22, 163, 74], desc: 'Small stones (<5mm) with lower confidence' }
      ];

      riskLevels.forEach(({ level, color, desc }) => {
        // Color indicator
        pdf.setFillColor(...color);
        pdf.rect(margin, yPosition - 2, 4, 4, 'F');
        
        addText(level + ':', margin + 8, yPosition, { fontSize: 11, fontStyle: 'bold', color });
        addText(desc, margin + 50, yPosition, { fontSize: 10, color: [100, 100, 100] });
        yPosition += 8;
      });

      // 7. Footer/Disclaimer
      yPosition = pageHeight - 40;
      
      pdf.setFillColor(255, 251, 235);
      pdf.rect(margin, yPosition - 10, contentWidth, 25, 'F');
      
      addText('MEDICAL DISCLAIMER', 0, yPosition - 5, {
        fontSize: 12,
        fontStyle: 'bold',
        color: [146, 64, 14],
        align: 'center'
      });

      const disclaimer = 'This AI-powered analysis is for informational purposes only and should not replace professional medical diagnosis. Please consult with a healthcare professional for proper medical evaluation and treatment.';
      
      pdf.setFontSize(9);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(146, 64, 14);
      const disclaimerLines = pdf.splitTextToSize(disclaimer, contentWidth - 10);
      pdf.text(disclaimerLines, margin + 5, yPosition + 5);

      // Generate filename and save
      const patientName = result.user_details?.name?.replace(/\s+/g, '_') || 'Patient';
      const date = new Date().toISOString().split('T')[0];
      const filename = `KidneyStone_Report_${patientName}_${date}.pdf`;
      
      pdf.save(filename);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  // Handle error case
  if (result.error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <strong className="font-bold">Error: </strong>
            <span>{result.error}</span>
          </div>
          <button 
            onClick={onReset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const { message, user_details, detection_results } = result;

  // Risk level color mapping
  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Enhanced location detection using bounding box coordinates
  const determineStoneLocation = (bbox) => {
    if (!bbox || bbox.length < 4) return 'Location not determined';
    
    const [x1, y1, x2, y2] = bbox;
    const centerX = (x1 + x2) / 2;
    const centerY = (y1 + y2) / 2;
    
    // Assume image dimensions (550x550 after preprocessing, but coordinates might be from original)
    // We'll use relative positioning for better accuracy
    const imageWidth = 550; // Standard preprocessed size
    const imageHeight = 550;
    
    // More precise anatomical mapping
    const leftRightThreshold = imageWidth * 0.5;
    const upperThreshold = imageHeight * 0.35; // Upper pole (smaller region)
    const middleThreshold = imageHeight * 0.65; // Middle region
    
    // Determine kidney side
    const kidney = centerX < leftRightThreshold ? 'Left' : 'Right';
    
    // Determine kidney region with more medical accuracy
    let region;
    if (centerY < upperThreshold) {
      region = 'Upper Pole';
    } else if (centerY < middleThreshold) {
      region = 'Middle';
    } else {
      region = 'Lower Pole';
    }
    
    // Add more specific location details based on exact position
    let specificLocation = '';
    if (centerY < upperThreshold * 0.7) {
      specificLocation = ' (Superior)';
    } else if (centerY > middleThreshold + (imageHeight - middleThreshold) * 0.7) {
      specificLocation = ' (Inferior)';
    }
    
    return `${kidney} ${region}${specificLocation} of Kidney`;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      {/* Header with Action Buttons */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Kidney Stone Detection Results</h2>
        <p className="text-green-600 font-semibold mb-4">{message}</p>
        
        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button 
            onClick={downloadPDF}
            className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF Report
          </button>
          
          <button 
            onClick={onReset}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-200"
          >
            Analyze Another Image
          </button>
        </div>
      </div>

      {/* PDF Content - This will be captured for PDF generation */}
      <div ref={resultsRef} className="bg-white">
        {/* PDF Header (will only show in PDF) */}
        <div className="mb-6 text-center border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Kidney Stone Detection Report</h1>
          <p className="text-gray-600 mt-2">Generated on {new Date().toLocaleDateString()}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - User Details & Summary */}
          <div className="space-y-6">
            {/* Patient Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Patient Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Name:</span>
                  <span className="text-gray-800">{user_details?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Age:</span>
                  <span className="text-gray-800">{user_details?.age || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Gender:</span>
                  <span className="text-gray-800">{user_details?.gender || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Detection Summary */}
            <div className={ detection_results?.total_stones != 0 ? 'bg-red-200 p-6 rounded-lg': 'bg-green-200 rounded-lg p-6'}>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Detection Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-600">Total Stones Detected:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    {detection_results?.total_stones || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Model Used:</span>
                  <span className="text-gray-800 bg-gray-200 px-2 py-1 rounded text-sm">
                    {detection_results?.model_type.slice(0,13) || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            {/* Individual Stone Details */}
            {detection_results?.detections && detection_results.detections.length > 0 && (
              <div className="bg-white border border-gray-200 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Stone Details</h3>
                <div className="space-y-4">
                  {detection_results.detections.map((stone, index) => (
                    <div key={stone.id || index} className="border border-gray-200 p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-800">Stone #{stone.id || index + 1}</h4>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(stone.risk_level)}`}>
                          {stone.risk_level || 'Unknown'} Risk
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-600">Confidence:</span>
                          <span className="ml-2 font-medium">{((stone.confidence || 0) * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Size:</span>
                          <span className="ml-2 font-medium">{stone.size_mm.toFixed(3) || 'N/A'} mm</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Location:</span>
                          <span className="ml-2 font-medium">
                            {stone?.location || determineStoneLocation(stone?.bbox)}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-gray-600">Area:</span>
                          <span className="ml-2 font-medium">{stone.area_pixels || 'N/A'} pixels</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Annotated Image */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Annotated Scan</h3>
              {detection_results?.annotated_image ? (
                <div className="text-center">
                  <img
                    src={`data:image/png;base64,${detection_results.annotated_image}`}
                    alt="Annotated kidney scan showing detected stones"
                    className="w-full max-h-96 object-contain rounded-lg border border-gray-300"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Detected stones are highlighted with colored bounding boxes
                  </p>
                </div>
              ) : (
                <div className="bg-gray-100 h-64 flex items-center justify-center rounded-lg">
                  <p className="text-gray-500">No annotated image available</p>
                </div>
              )}
            </div>

            {/* Risk Level Legend */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-3">Risk Level Guide</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-red-100 border border-red-300 rounded"></span>
                  <span className="text-red-600 font-medium">High Risk:</span>
                  <span className="text-gray-600">Large stones (≥10mm) with high confidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></span>
                  <span className="text-yellow-600 font-medium">Medium Risk:</span>
                  <span className="text-gray-600">Medium stones (5-10mm) or moderate confidence</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 bg-green-100 border border-green-300 rounded"></span>
                  <span className="text-green-600 font-medium">Low Risk:</span>
                  <span className="text-gray-600">Small stones (&lt;5mm) with lower confidence</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This AI-powered analysis is for informational purposes only and should not replace professional medical diagnosis. 
            Please consult with a healthcare professional for proper medical evaluation and treatment.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Results;