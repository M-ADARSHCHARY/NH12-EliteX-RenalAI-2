from flask import Flask, request, jsonify
from PIL import Image
import io
import cv2
import numpy as np
import base64
import os
from flask_cors import CORS
from ultralytics import YOLO

app = Flask(__name__)
CORS(app)


class KidneyStoneDetectorAPI:
    def __init__(self):
        """Initialize the detector with multiple YOLOv8 models"""
        self.models_dir = "runs\\train\\test_training\\weights"
        
        # Define models in descending order (latest to earliest)
        self.model_files = [
            "epoch20.pt",  # Latest epoch (try first)
            "epoch15.pt",  # Middle epoch
            "epoch10.pt"   # Earliest epoch (try last)
        ]
        
        # Load all available models
        self.loaded_models = []
        self.load_all_models()
    
    def load_all_models(self):
        """Load all available models from the weights directory"""
        print("Loading kidney stone detection models...")
        
        for model_file in self.model_files:
            model_path = os.path.join(self.models_dir, model_file)
            
            if os.path.exists(model_path):
                try:
                    model = YOLO(model_path)
                    self.loaded_models.append({
                        'model': model,
                        'name': model_file,
                        'path': model_path
                    })
                    print(f"✅ Loaded model: {model_file}")
                except Exception as e:
                    print(f"❌ Failed to load {model_file}: {e}")
            else:
                print(f"⚠️  Model not found: {model_path}")
        
        if not self.loaded_models:
            # Fallback to general YOLO model
            print("⚠️  No custom models found, using general YOLOv8 model")
            general_model = YOLO('yolov8n.pt')
            self.loaded_models.append({
                'model': general_model,
                'name': 'yolov8n.pt',
                'path': 'yolov8n.pt'
            })
        
        print(f"Total models loaded: {len(self.loaded_models)}")
    
    def preprocess_image(self, pil_image):
        """
        Preprocess the image before sending to models:
        1. Convert to grayscale
        2. Crop/resize to 550x550 pixels
        """
        print("🔄 Preprocessing image: Converting to grayscale and resizing to 550x550...")
        
        # Convert to grayscale
        if pil_image.mode != 'L':  # 'L' mode is grayscale
            grayscale_image = pil_image.convert('L')
        else:
            grayscale_image = pil_image
        
        # Get current dimensions
        width, height = grayscale_image.size
        print(f"Original image size: {width}x{height}")
        
        # Calculate crop dimensions to maintain aspect ratio
        target_size = 550
        
        # Find the minimum dimension to crop to a square
        min_dimension = min(width, height)
        
        # Calculate crop box to get center square
        left = (width - min_dimension) // 2
        top = (height - min_dimension) // 2
        right = left + min_dimension
        bottom = top + min_dimension
        
        # Crop to square
        cropped_image = grayscale_image.crop((left, top, right, bottom))
        
        # Resize to target size (550x550)
        processed_image = cropped_image.resize((target_size, target_size), Image.Resampling.LANCZOS)
        
        # Convert back to RGB for YOLO model compatibility (models expect 3 channels)
        final_image = processed_image.convert('RGB')
        
        print(f"✅ Image preprocessed to: {final_image.size[0]}x{final_image.size[1]} (RGB from grayscale)")
        
        return final_image
    
    def detect_stones_with_models(self, pil_image, user_details):
        """
        Test models one by one until one finds stones (total_stones > 0)
        Returns the first successful detection result
        """
        print(f"\n🔍 Starting multi-model detection for user: {user_details.get('name', 'Unknown')}")
        
        # Preprocess the image before model detection
        preprocessed_image = self.preprocess_image(pil_image)
        
        for i, model_info in enumerate(self.loaded_models):
            model = model_info['model']
            model_name = model_info['name']
            
            print(f"Testing model {i+1}/{len(self.loaded_models)}: {model_name}")
            
            try:
                # Run detection with current model using preprocessed image
                result = self._detect_with_single_model(model, model_name, preprocessed_image, user_details)
                
                total_stones = result.get('detection_results', {}).get('total_stones', 0)
                print(f"Model {model_name} detected {total_stones} stones")
                
                # If this model found stones, use this result
                if total_stones > 0:
                    print(f"✅ SUCCESS: Using result from {model_name} (found {total_stones} stones)")
                    return result
                else:
                    print(f"⏭️  No stones detected by {model_name}, trying next model...")
                    
            except Exception as e:
                print(f"❌ Error with model {model_name}: {e}")
                continue
        
        # If no model found stones, return the last model's result (empty detection)
        print("⚠️  No model detected any stones. Returning empty result.")
        return self._get_empty_result(user_details)
    
    def _detect_with_single_model(self, model, model_name, pil_image, user_details):
        """Run detection with a single model"""
        # Convert PIL image to numpy array
        if pil_image.mode != 'RGB':
            pil_image = pil_image.convert('RGB')
        
        image_array = np.array(pil_image)
        
        # Run YOLO detection
        results = model(image_array)
        
        # Process detections
        detections = []
        annotated_image = image_array.copy()
        
        if len(results) > 0 and results[0].boxes is not None:
            boxes = results[0].boxes
            
            for i, box in enumerate(boxes):
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy()
                confidence = box.conf[0].cpu().numpy()
                
                # Skip very low confidence detections
                if confidence < 0.1:
                    continue
                
                # Calculate measurements
                bbox_area = (x2 - x1) * (y2 - y1)
                size_mm = self._estimate_size_mm(bbox_area, image_array.shape[1])
                risk_level = self._assess_risk_level(confidence, bbox_area, size_mm)
                
                # Determine location based on bbox position
                center_x = (x1 + x2) / 2
                center_y = (y1 + y2) / 2
                img_width, img_height = image_array.shape[1], image_array.shape[0]
                
                # Simple location mapping based on image quadrants
                location = self._determine_stone_location(center_x, center_y, img_width, img_height)
                
                detection = {
                    'id': i + 1,
                    'confidence': float(confidence),
                    'bbox': [int(x1), int(y1), int(x2), int(y2)],
                    'size_mm': float(size_mm),
                    'risk_level': risk_level,
                    'area_pixels': int(bbox_area),
                    'location': location
                }
                detections.append(detection)
                
                # Draw annotations on image with thin, visually appealing boxes
                color = self._get_risk_color(risk_level)
                
                # Draw thin bounding box (thickness 1-2 for clean look)
                cv2.rectangle(annotated_image, (int(x1), int(y1)), (int(x2), int(y2)), color, 2)
                
                # Add simple stone number label
                stone_label = f"#{i+1}"
                
                # Calculate label size and position
                label_size = cv2.getTextSize(stone_label, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)[0]
                label_width, label_height = label_size
                
                # Position label at top-left of bounding box with small padding
                label_x = int(x1)
                label_y = int(y1) - 8
                
                # Ensure label doesn't go out of image bounds
                if label_y - label_height < 0:
                    label_y = int(y2) + label_height + 8
                if label_x + label_width > image_array.shape[1]:
                    label_x = int(x2) - label_width
                
                # Draw semi-transparent background for label
                overlay = annotated_image.copy()
                cv2.rectangle(overlay, (label_x - 4, label_y - label_height - 4), 
                            (label_x + label_width + 4, label_y + 4), color, -1)
                cv2.addWeighted(overlay, 0.7, annotated_image, 0.3, 0, annotated_image)
                
                # Draw the stone number text
                cv2.putText(annotated_image, stone_label, (label_x, label_y), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Convert annotated image to base64
        annotated_image_b64 = self._image_to_base64(annotated_image)
        
        # Prepare response
        response = {
            "message": "Kidney stone detection completed",
            "user_details": user_details,
            "detection_results": {
                "total_stones": len(detections),
                "detections": detections,
                "annotated_image": annotated_image_b64,
                "model_type": f"YOLOv8-Custom ({model_name})",
                "model_used": model_name
            }
        }
        
        return response
    
    def _get_empty_result(self, user_details):
        """Return empty result when no stones are detected by any model"""
        return {
            "message": "Kidney stone detection completed - No stones detected",
            "user_details": user_details,
            "detection_results": {
                "total_stones": 0,
                "detections": [],
                "annotated_image": None,
                "model_type": "YOLOv8-Custom (No detection)",
                "model_used": "Multiple models tested"
            }
        }
    
    def detect_stones(self, pil_image, user_details):
        """
        Main detection function that uses multi-model testing approach
        Tests models in order until one finds stones (total_stones > 0)
        """
        try:
            return self.detect_stones_with_models(pil_image, user_details)
        except Exception as e:
            print(f"❌ Critical error in detection: {e}")
            return {
                "error": f"Detection failed: {str(e)}",
                "user_details": user_details,
                "detection_results": {
                    "total_stones": 0,
                    "detections": [],
                    "annotated_image": None,
                    "model_type": "Error - No model available"
                }
            }
    
    def _estimate_size_mm(self, bbox_area, image_width):
        """Estimate stone size in millimeters"""
        # Medical imaging calibration (approximate)
        pixels_per_mm = image_width / 200  # Rough approximation for kidney scans
        area_mm2 = bbox_area / (pixels_per_mm ** 2)
        diameter_mm = 2 * np.sqrt(area_mm2 / np.pi)
        return round(diameter_mm, 1)
    
    def _assess_risk_level(self, confidence, bbox_area, size_mm):
        """Comprehensive risk assessment based on size and confidence"""
        # Size-based scoring
        if size_mm >= 10:
            size_score = 3  # Large stones
        elif size_mm >= 5:
            size_score = 2  # Medium stones
        else:
            size_score = 1  # Small stones
        
        # Confidence-based scoring
        if confidence >= 0.8:
            confidence_score = 3
        elif confidence >= 0.6:
            confidence_score = 2
        else:
            confidence_score = 1
        
        # Combined risk assessment
        total_score = size_score + confidence_score
        
        if total_score >= 5:
            return "High"
        elif total_score >= 3:
            return "Medium"
        else:
            return "Low"
    
    def _get_risk_color(self, risk_level):
        """Get BGR color for OpenCV drawing based on risk level"""
        colors = {
            "High": (0, 69, 255),      # Bright Red (more vibrant)
            "Medium": (0, 140, 255),   # Orange (more saturated)  
            "Low": (50, 205, 50)       # Lime Green (more visible)
        }
        return colors.get(risk_level, (128, 128, 128))  # Gray default
    
    def _determine_stone_location(self, center_x, center_y, img_width, img_height):
        """Determine kidney stone location based on bounding box center position"""
        # Define zones based on medical kidney anatomy
        left_right_threshold = img_width * 0.5
        upper_lower_threshold = img_height * 0.4  # Upper pole is smaller than lower
        middle_upper_threshold = img_height * 0.6
        
        # Determine left/right kidney
        if center_x < left_right_threshold:
            kidney_side = "Left"
        else:
            kidney_side = "Right"
        
        # Determine kidney region (upper pole, middle, lower pole)
        if center_y < upper_lower_threshold:
            kidney_region = "Upper Pole"
        elif center_y < middle_upper_threshold:
            kidney_region = "Middle"
        else:
            kidney_region = "Lower Pole"
        
        # Construct full location
        location = f"{kidney_side} {kidney_region} of Kidney"
        
        return location
    
    def _image_to_base64(self, image_array):
        """Convert numpy image array to base64 string"""
        try:
            # Convert BGR to RGB if needed (OpenCV uses BGR)
            if len(image_array.shape) == 3:
                image_rgb = cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB)
            else:
                image_rgb = image_array
            
            # Convert to PIL Image
            pil_img = Image.fromarray(image_rgb.astype('uint8'))
            
            # Convert to base64
            buffer = io.BytesIO()
            pil_img.save(buffer, format='PNG', quality=95)  # Use PNG for better quality
            img_str = base64.b64encode(buffer.getvalue()).decode()
            
            return img_str  # Return only base64 string, frontend will add data:image/png;base64,
            
        except Exception as e:
            print(f"Error converting image to base64: {e}")
            return None


# Initialize the detector once when the app starts
print("Initializing kidney stone detector with multi-model approach...")
detector = KidneyStoneDetectorAPI()
print("Detector initialized successfully!")


@app.route('/')
def index():
    return "Kidney Stone Detection API is running!"

@app.route('/detect', methods=['POST'])
def detect():
    try:
        # Get the image file from form data
        image_file = request.files.get('image')
        print(f"Received image: {image_file}")
        
        # Get other user details from form data
        name = request.form.get('name', 'Anonymous')
        age = request.form.get('age', 'N/A')
        gender = request.form.get('gender', 'N/A')

        if not image_file:
            return jsonify({"error": "No image provided"}), 400

        print(f"Processing request for user: {name}, Age: {age}, Gender: {gender}")

        # Convert Flask FileStorage to PIL Image
        image_bytes = image_file.read()
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        
        print(f"📷 Original image loaded: {image.size[0]}x{image.size[1]} pixels, Mode: {image.mode}")
        
        # Prepare user details
        user_details = {
            "name": name,
            "age": age,
            "gender": gender
        }
        
        # Perform kidney stone detection
        print("Running kidney stone detection...")
        detection_results = detector.detect_stones(image, user_details) # pass image and user details and get json result
        
        print(f"Detection completed. Found {detection_results.get('detection_results', {}).get('total_stones', 0)} stones")
        
        # print("detection res: ",detection_results)
        return jsonify(detection_results), 200
        
    except Exception as e:
        print(f"Error during detection: {str(e)}")
        return jsonify({
            "error": "Failed to process image", 
            "details": str(e),
            "user_details": {
                "name": name if 'name' in locals() else 'Unknown',
                "age": age if 'age' in locals() else 'N/A',
                "gender": gender if 'gender' in locals() else 'N/A'
            },
            "detection_results": {
                "total_stones": 0,
                "detections": [],
                "annotated_image": None,
                "model_type": "Unknown"
            }
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)