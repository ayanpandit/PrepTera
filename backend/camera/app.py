#!/usr/bin/env python3
"""
Advanced Face Detection & Eye Tracking System for Terminal
High-accuracy monitoring for online test environments using MediaPipe
"""

import cv2
import numpy as np
import mediapipe as mp
import math
import time
import threading
from collections import deque
import warnings
warnings.filterwarnings("ignore")

class AdvancedFaceDetector:
    def __init__(self):
        # Initialize MediaPipe
        self.mp_face_mesh = mp.solutions.face_mesh
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        # Face mesh for high accuracy detection
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7
        )
        
        # Camera and detection parameters
        self.cap = None
        self.frame_width = 640
        self.frame_height = 480
        
        # Tracking variables
        self.face_detected = False
        self.eyes_detected = False
        self.looking_at_camera = False
        self.head_pose_valid = False
        self.eye_landmarks = None
        
        # Accuracy buffers for smoothing
        self.eye_track_buffer = deque(maxlen=15)
        self.face_track_buffer = deque(maxlen=10)
        self.pose_buffer = deque(maxlen=12)
        self.gaze_buffer = deque(maxlen=20)
        
        # Thresholds for high accuracy
        self.EYE_ASPECT_RATIO_THRESHOLD = 0.22
        self.GAZE_THRESHOLD = 0.04  # More sensitive threshold
        self.HEAD_POSE_THRESHOLD = 15  # degrees
        self.IRIS_THRESHOLD = 0.03  # Iris position threshold
        
        # Eye landmark indices for MediaPipe
        self.LEFT_EYE_INDICES = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
        self.RIGHT_EYE_INDICES = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
        self.LEFT_IRIS_INDICES = [468, 469, 470, 471, 472]
        self.RIGHT_IRIS_INDICES = [473, 474, 475, 476, 477]
        
        # Statistics
        self.total_frames = 0
        self.valid_frames = 0
        self.start_time = time.time()
        self.alert_threshold = 3  # seconds before alert
        self.last_valid_time = time.time()
        
    def initialize_camera(self, camera_id=0):
        """Initialize camera with optimal settings"""
        self.cap = cv2.VideoCapture(camera_id)
        if not self.cap.isOpened():
            raise Exception("Cannot open camera")
        
        # Set camera properties for better quality
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.frame_width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.frame_height)
        self.cap.set(cv2.CAP_PROP_FPS, 30)
        self.cap.set(cv2.CAP_PROP_AUTO_EXPOSURE, 0.25)
        self.cap.set(cv2.CAP_PROP_BRIGHTNESS, 0.6)
        self.cap.set(cv2.CAP_PROP_CONTRAST, 0.6)
        
        print("✓ Camera initialized successfully")
        print("✓ MediaPipe Face Mesh loaded")
        return True
    
    def calculate_eye_aspect_ratio(self, eye_landmarks):
        """Calculate Eye Aspect Ratio (EAR) for blink detection"""
        if len(eye_landmarks) < 6:
            return 0
        
        # Calculate vertical distances
        vertical_1 = math.dist(eye_landmarks[1], eye_landmarks[5])
        vertical_2 = math.dist(eye_landmarks[2], eye_landmarks[4])
        
        # Calculate horizontal distance
        horizontal = math.dist(eye_landmarks[0], eye_landmarks[3])
        
        # EAR formula
        ear = (vertical_1 + vertical_2) / (2.0 * horizontal)
        return ear
    
    def get_eye_landmarks(self, landmarks, eye_indices):
        """Extract eye landmarks from face mesh"""
        eye_points = []
        for idx in eye_indices[:6]:  # Get first 6 points for EAR calculation
            point = landmarks.landmark[idx]
            eye_points.append([point.x, point.y])
        return eye_points
    
    def calculate_iris_position(self, landmarks, iris_indices, eye_indices):
        """Calculate iris position relative to eye corners"""
        if not iris_indices or not eye_indices:
            return 0.5, 0.5  # Center position
        
        # Get iris center
        iris_points = []
        for idx in iris_indices:
            point = landmarks.landmark[idx]
            iris_points.append([point.x, point.y])
        
        if not iris_points:
            return 0.5, 0.5
        
        iris_center = np.mean(iris_points, axis=0)
        
        # Get eye corners
        left_corner = landmarks.landmark[eye_indices[0]]
        right_corner = landmarks.landmark[eye_indices[8] if len(eye_indices) > 8 else eye_indices[-1]]
        top_point = landmarks.landmark[eye_indices[4] if len(eye_indices) > 4 else eye_indices[1]]
        bottom_point = landmarks.landmark[eye_indices[12] if len(eye_indices) > 12 else eye_indices[2]]
        
        # Calculate relative position
        eye_width = abs(right_corner.x - left_corner.x)
        eye_height = abs(top_point.y - bottom_point.y)
        
        if eye_width > 0:
            iris_x_ratio = (iris_center[0] - left_corner.x) / eye_width
        else:
            iris_x_ratio = 0.5
            
        if eye_height > 0:
            iris_y_ratio = (iris_center[1] - bottom_point.y) / eye_height
        else:
            iris_y_ratio = 0.5
        
        return iris_x_ratio, iris_y_ratio
    
    def estimate_head_pose(self, landmarks, frame_shape):
        """Estimate head pose using facial landmarks"""
        # Key facial points for pose estimation
        nose_tip = landmarks.landmark[1]
        nose_bridge = landmarks.landmark[6]
        left_eye = landmarks.landmark[33]
        right_eye = landmarks.landmark[263]
        left_mouth = landmarks.landmark[61]
        right_mouth = landmarks.landmark[291]
        chin = landmarks.landmark[18]
        
        # Convert to pixel coordinates
        h, w = frame_shape[:2]
        
        # 3D model points (in mm, approximate head dimensions)
        model_points = np.array([
            (0.0, 0.0, 0.0),           # Nose tip
            (0.0, -63.6, -12.5),       # Chin
            (-43.3, 32.7, -26.0),      # Left eye left corner
            (43.3, 32.7, -26.0),       # Right eye right corner
            (-28.9, -28.9, -24.1),     # Left mouth corner
            (28.9, -28.9, -24.1)       # Right mouth corner
        ], dtype=np.float64)
        
        # Corresponding 2D image points
        image_points = np.array([
            (nose_tip.x * w, nose_tip.y * h),
            (chin.x * w, chin.y * h),
            (left_eye.x * w, left_eye.y * h),
            (right_eye.x * w, right_eye.y * h),
            (left_mouth.x * w, left_mouth.y * h),
            (right_mouth.x * w, right_mouth.y * h)
        ], dtype=np.float64)
        
        # Camera parameters
        focal_length = w
        center = (w / 2, h / 2)
        camera_matrix = np.array([
            [focal_length, 0, center[0]],
            [0, focal_length, center[1]],
            [0, 0, 1]
        ], dtype=np.float64)
        
        dist_coeffs = np.zeros((4, 1))
        
        # Solve PnP
        success, rotation_vector, translation_vector = cv2.solvePnP(
            model_points, image_points, camera_matrix, dist_coeffs
        )
        
        if success:
            # Convert rotation vector to Euler angles
            rotation_matrix, _ = cv2.Rodrigues(rotation_vector)
            
            # Extract Euler angles
            sy = math.sqrt(rotation_matrix[0,0] * rotation_matrix[0,0] + rotation_matrix[1,0] * rotation_matrix[1,0])
            singular = sy < 1e-6
            
            if not singular:
                x = math.atan2(rotation_matrix[2,1], rotation_matrix[2,2])
                y = math.atan2(-rotation_matrix[2,0], sy)
                z = math.atan2(rotation_matrix[1,0], rotation_matrix[0,0])
            else:
                x = math.atan2(-rotation_matrix[1,2], rotation_matrix[1,1])
                y = math.atan2(-rotation_matrix[2,0], sy)
                z = 0
            
            # Convert to degrees
            pitch = math.degrees(x)
            yaw = math.degrees(y) 
            roll = math.degrees(z)
            
            return pitch, yaw, roll
        
        return None, None, None
    
    def analyze_gaze(self, landmarks):
        """Advanced gaze analysis using iris tracking"""
        if not landmarks:
            return False
        
        # Calculate iris positions for both eyes
        left_iris_x, left_iris_y = self.calculate_iris_position(
            landmarks, self.LEFT_IRIS_INDICES, self.LEFT_EYE_INDICES
        )
        right_iris_x, right_iris_y = self.calculate_iris_position(
            landmarks, self.RIGHT_IRIS_INDICES, self.RIGHT_EYE_INDICES
        )
        
        # Check if both irises are centered (looking at camera)
        left_centered = (0.4 < left_iris_x < 0.6) and (0.4 < left_iris_y < 0.6)
        right_centered = (0.4 < right_iris_x < 0.6) and (0.4 < right_iris_y < 0.6)
        
        # Calculate average deviation from center
        avg_x_deviation = abs((left_iris_x + right_iris_x) / 2 - 0.5)
        avg_y_deviation = abs((left_iris_y + right_iris_y) / 2 - 0.5)
        
        # Store gaze data for smoothing
        gaze_score = 1.0 - (avg_x_deviation + avg_y_deviation)
        self.gaze_buffer.append(gaze_score > 0.8)
        
        return left_centered and right_centered
    
    def analyze_frame(self, frame):
        """Main frame analysis function"""
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        # Reset detection flags
        self.face_detected = False
        self.eyes_detected = False
        self.looking_at_camera = False
        self.head_pose_valid = False
        
        if results.multi_face_landmarks:
            self.face_detected = True
            face_landmarks = results.multi_face_landmarks[0]
            
            # Draw face mesh (optional, can be disabled for performance)
            self.mp_drawing.draw_landmarks(
                frame, face_landmarks,
                self.mp_face_mesh.FACEMESH_CONTOURS,
                None,
                self.mp_drawing_styles.get_default_face_mesh_contours_style()
            )
            
            # Analyze eyes
            left_eye_landmarks = self.get_eye_landmarks(face_landmarks, self.LEFT_EYE_INDICES)
            right_eye_landmarks = self.get_eye_landmarks(face_landmarks, self.RIGHT_EYE_INDICES)
            
            if left_eye_landmarks and right_eye_landmarks:
                self.eyes_detected = True
                
                # Calculate EAR for both eyes
                left_ear = self.calculate_eye_aspect_ratio(left_eye_landmarks)
                right_ear = self.calculate_eye_aspect_ratio(right_eye_landmarks)
                avg_ear = (left_ear + right_ear) / 2.0
                
                # Check if eyes are open
                eyes_open = avg_ear > self.EYE_ASPECT_RATIO_THRESHOLD
                
                if eyes_open:
                    # Analyze gaze direction
                    gaze_valid = self.analyze_gaze(face_landmarks)
                    self.looking_at_camera = gaze_valid
            
            # Head pose estimation
            pitch, yaw, roll = self.estimate_head_pose(face_landmarks, frame.shape)
            
            if pitch is not None and yaw is not None:
                # Check if head is facing camera
                head_straight = (abs(pitch) < self.HEAD_POSE_THRESHOLD and 
                               abs(yaw) < self.HEAD_POSE_THRESHOLD)
                self.head_pose_valid = head_straight
                
                # Display pose information on frame
                pose_text = f"Pitch: {pitch:.1f}° Yaw: {yaw:.1f}° Roll: {roll:.1f}°"
                cv2.putText(frame, pose_text, (10, frame.shape[0] - 60), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)
        
        # Update tracking buffers for smoothing
        self.face_track_buffer.append(self.face_detected)
        self.eye_track_buffer.append(self.eyes_detected)
        self.pose_buffer.append(self.head_pose_valid)
        
        # Calculate smoothed results
        face_stability = sum(self.face_track_buffer) / len(self.face_track_buffer) if self.face_track_buffer else 0
        eye_stability = sum(self.eye_track_buffer) / len(self.eye_track_buffer) if self.eye_track_buffer else 0
        pose_stability = sum(self.pose_buffer) / len(self.pose_buffer) if self.pose_buffer else 0
        gaze_stability = sum(self.gaze_buffer) / len(self.gaze_buffer) if self.gaze_buffer else 0
        
        # Final determination with higher accuracy requirements
        final_valid = (face_stability > 0.85 and 
                      eye_stability > 0.8 and 
                      pose_stability > 0.75 and
                      gaze_stability > 0.7 and
                      self.looking_at_camera)
        
        return frame, final_valid
    
    def display_status(self, frame):
        """Display detection status on frame"""
        # Calculate current time without valid detection
        current_time = time.time()
        if self.looking_at_camera:
            self.last_valid_time = current_time
        
        time_since_valid = current_time - self.last_valid_time
        
        # Determine status color and text
        if self.looking_at_camera:
            status_color = (0, 255, 0)  # Green
            status_text = "✓ LOOKING AT CAMERA"
        elif time_since_valid > self.alert_threshold:
            status_color = (0, 0, 255)  # Red
            status_text = f"⚠ ATTENTION REQUIRED! ({time_since_valid:.1f}s)"
        else:
            status_color = (0, 255, 255)  # Yellow
            status_text = "⚬ ADJUSTING POSITION..."
        
        # Status bar background
        overlay = frame.copy()
        cv2.rectangle(overlay, (0, 0), (frame.shape[1], 80), (0, 0, 0), -1)
        frame = cv2.addWeighted(frame, 0.7, overlay, 0.3, 0)
        
        # Main status text
        cv2.putText(frame, status_text, (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 
                   0.8, status_color, 2)
        
        # Individual component status
        indicators = [
            ("Face", self.face_detected, (0, 255, 0) if self.face_detected else (0, 0, 255)),
            ("Eyes", self.eyes_detected, (0, 255, 0) if self.eyes_detected else (0, 0, 255)),
            ("Pose", self.head_pose_valid, (0, 255, 0) if self.head_pose_valid else (0, 0, 255)),
            ("Gaze", self.looking_at_camera, (0, 255, 0) if self.looking_at_camera else (0, 0, 255))
        ]
        
        y_pos = 55
        for i, (label, status, color) in enumerate(indicators):
            symbol = "●" if status else "○"
            text = f"{symbol} {label}"
            cv2.putText(frame, text, (10 + i * 140, y_pos), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, color, 2)
        
        # Accuracy meter
        accuracy = (self.valid_frames / max(self.total_frames, 1)) * 100
        accuracy_text = f"Accuracy: {accuracy:.1f}%"
        cv2.putText(frame, accuracy_text, (frame.shape[1] - 180, 30), 
                   cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
        
        return frame
    
    def print_terminal_status(self):
        """Print comprehensive status to terminal"""
        current_time = time.time()
        elapsed_time = current_time - self.start_time
        accuracy = (self.valid_frames / max(self.total_frames, 1)) * 100
        fps = self.total_frames / max(elapsed_time, 1)
        time_since_valid = current_time - self.last_valid_time
        
        # Status indicators
        status = "✓ VALID  " if self.looking_at_camera else "✗ INVALID"
        face_status = "✓" if self.face_detected else "✗"
        eyes_status = "✓" if self.eyes_detected else "✗"
        pose_status = "✓" if self.head_pose_valid else "✗"
        gaze_status = "✓" if self.looking_at_camera else "✗"
        
        # Stability scores
        face_stability = sum(self.face_track_buffer) / len(self.face_track_buffer) if self.face_track_buffer else 0
        eye_stability = sum(self.eye_track_buffer) / len(self.eye_track_buffer) if self.eye_track_buffer else 0
        gaze_stability = sum(self.gaze_buffer) / len(self.gaze_buffer) if self.gaze_buffer else 0
        
        print(f"\r[{status}] Face:{face_status} Eyes:{eyes_status} Pose:{pose_status} Gaze:{gaze_status} | "
              f"Stability: F:{face_stability:.2f} E:{eye_stability:.2f} G:{gaze_stability:.2f} | "
              f"Acc:{accuracy:.1f}% FPS:{fps:.1f} Frames:{self.total_frames} "
              f"Alert:{time_since_valid:.1f}s", 
              end="", flush=True)
    
    def run(self):
        """Main detection loop"""
        if not self.initialize_camera():
            return
        
        print("🔥 ADVANCED FACE DETECTION SYSTEM 🔥")
        print("Next-Level Accuracy for Online Test Monitoring")
        print("=" * 70)
        print("Controls:")
        print("  'q' - Quit application")
        print("  's' - Save screenshot")
        print("  'r' - Reset statistics")
        print("  'c' - Calibrate thresholds")
        print("=" * 70)
        
        calibration_mode = False
        
        try:
            while True:
                ret, frame = self.cap.read()
                if not ret:
                    break
                
                # Flip frame horizontally for mirror effect
                frame = cv2.flip(frame, 1)
                
                # Analyze frame
                processed_frame, is_valid = self.analyze_frame(frame)
                
                # Update statistics
                self.total_frames += 1
                if is_valid:
                    self.valid_frames += 1
                
                # Display status
                display_frame = self.display_status(processed_frame)
                
                # Show frame
                cv2.imshow('Advanced Face Detection - Next Level Accuracy', display_frame)
                
                # Print terminal status every few frames
                if self.total_frames % 3 == 0:
                    self.print_terminal_status()
                
                # Handle keyboard input
                key = cv2.waitKey(1) & 0xFF
                if key == ord('q'):
                    break
                elif key == ord('s'):
                    filename = f"detection_screenshot_{int(time.time())}.jpg"
                    cv2.imwrite(filename, display_frame)
                    print(f"\n📸 Screenshot saved: {filename}")
                elif key == ord('r'):
                    # Reset statistics
                    self.total_frames = 0
                    self.valid_frames = 0
                    self.start_time = time.time()
                    self.last_valid_time = time.time()
                    print(f"\n🔄 Statistics reset!")
                elif key == ord('c'):
                    print(f"\n🎯 Calibration mode toggled!")
                    calibration_mode = not calibration_mode
        
        except KeyboardInterrupt:
            print("\n\n🛑 Shutting down gracefully...")
        
        finally:
            self.cleanup()
    
    def cleanup(self):
        """Clean up resources and display final statistics"""
        if self.cap:
            self.cap.release()
        cv2.destroyAllWindows()
        
        # Final comprehensive statistics
        print("\n\n" + "=" * 70)
        print("🏁 DETECTION SESSION SUMMARY")
        print("=" * 70)
        
        elapsed_time = time.time() - self.start_time
        accuracy = (self.valid_frames / max(self.total_frames, 1)) * 100
        avg_fps = self.total_frames / max(elapsed_time, 1)
        
        print(f"📊 Total Frames Processed: {self.total_frames:,}")
        print(f"✅ Valid Detections: {self.valid_frames:,}")
        print(f"🎯 Overall Accuracy: {accuracy:.2f}%")
        print(f"⏱️  Session Duration: {elapsed_time:.1f} seconds")
        print(f"📈 Average FPS: {avg_fps:.1f}")
        
        # Performance rating
        if accuracy >= 95:
            rating = "🏆 EXCELLENT"
        elif accuracy >= 85:
            rating = "🥈 GOOD"
        elif accuracy >= 70:
            rating = "🥉 FAIR"
        else:
            rating = "⚠️  NEEDS IMPROVEMENT"
            
        print(f"🏅 Performance Rating: {rating}")
        print("=" * 70)
        print("Thank you for using Advanced Face Detection System!")
        print("=" * 70)

def main():
    """Main function with enhanced startup"""
    print("🚀 Initializing Advanced Face Detection System...")
    print("📦 Loading MediaPipe Face Mesh...")
    print("🎥 Preparing camera interface...")
    print()
    
    try:
        detector = AdvancedFaceDetector()
        detector.run()
    except ImportError as e:
        print("❌ Missing required package!")
        print("Please install: pip install mediapipe opencv-python numpy")
        print(f"Error: {e}")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("💡 Troubleshooting tips:")
        print("   - Make sure your camera is connected")
        print("   - Close other applications using the camera")
        print("   - Try a different camera ID (0, 1, 2...)")

if __name__ == "__main__":
    main()