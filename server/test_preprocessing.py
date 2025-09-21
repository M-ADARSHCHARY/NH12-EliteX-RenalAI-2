"""
Test script to demonstrate image preprocessing functionality
"""
import requests
import os
from PIL import Image
import io

def test_preprocessing():
    """Test the image preprocessing endpoint"""
    
    # Check if server is running
    try:
        response = requests.get('http://localhost:5000/')
        print("✅ Server is running")
    except requests.exceptions.ConnectionError:
        print("❌ Server is not running. Please start the server first.")
        return
    
    # Create a test image (you can replace this with an actual medical image)
    test_image = Image.new('RGB', (800, 600), color='gray')
    
    # Save test image to bytes
    img_buffer = io.BytesIO()
    test_image.save(img_buffer, format='PNG')
    img_buffer.seek(0)
    
    print(f"📷 Original test image: {test_image.size[0]}x{test_image.size[1]} pixels")
    
    # Prepare test data
    files = {
        'image': ('test_image.png', img_buffer, 'image/png')
    }
    
    data = {
        'name': 'Test Patient',
        'age': '45',
        'gender': 'male'
    }
    
    print("\n🔄 Sending request to server for processing...")
    
    try:
        # Send request to the detection endpoint
        response = requests.post('http://localhost:5000/detect', files=files, data=data)
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Request successful!")
            print(f"📊 Detection Results:")
            print(f"   - Total stones detected: {result.get('detection_results', {}).get('total_stones', 0)}")
            print(f"   - Model used: {result.get('detection_results', {}).get('model_used', 'N/A')}")
            print(f"   - Message: {result.get('message', 'N/A')}")
            
            if result.get('detection_results', {}).get('annotated_image'):
                print("   - Annotated image: Generated ✅")
            else:
                print("   - Annotated image: Not generated")
                
        else:
            print(f"❌ Request failed with status code: {response.status_code}")
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"❌ Error during request: {e}")

if __name__ == "__main__":
    print("🧪 Testing Image Preprocessing Functionality")
    print("=" * 50)
    test_preprocessing()