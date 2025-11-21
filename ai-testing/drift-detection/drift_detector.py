import pandas as pd
import numpy as np
import json
from datetime import datetime

# Using simple drift detection only
EVIDENTLY_AVAILABLE = False

class DriftDetector:
    def __init__(self):
        self.reference_data = None
        self.current_data = None
        
    def load_data(self):
        """Load reference and current datasets"""
        try:
            self.reference_data = pd.read_csv('data/reference.csv')
            self.current_data = pd.read_csv('data/current.csv')
            
            print(f"✅ Reference data loaded: {len(self.reference_data)} samples")
            print(f"✅ Current data loaded: {len(self.current_data)} samples")
            
            # Show data preview
            print("\n📊 Reference Data Preview:")
            print(self.reference_data.head())
            
            print("\n📊 Current Data Preview:")
            print(self.current_data.head())
            
            return True
            
        except FileNotFoundError as e:
            print(f"❌ Data files not found: {e}")
            print("💡 Run 'python scripts/generate_data.py' first!")
            return False
        except Exception as e:
            print(f"❌ Error loading data: {e}")
            return False
    
    def detect_drift(self):
        """Detect data drift between reference and current data"""
        if self.reference_data is None or self.current_data is None:
            print("❌ Data not loaded. Run load_data() first.")
            return None
        
        print("\n🔍 Analyzing Data Drift...")
        print("-" * 50)
        
        print("🔄 Using simple drift detection...")
        drift_results = self._simple_drift_detection()
        
        # Display results
        self._display_drift_results(drift_results)
        
        # Save results as JSON
        with open('drift_results.json', 'w') as f:
            json.dump(drift_results, f, indent=2)
        
        return drift_results
    
    def _display_drift_results(self, results):
        """Display drift results in a readable format"""
        if 'error' in results:
            print(f"❌ {results['error']}")
            return
        
        print(f"\n📊 DRIFT DETECTION RESULTS")
        print("=" * 50)
        print(f"Timestamp: {results['timestamp']}")
        print(f"Summary: {results['summary']}")
        
        if results.get('drift_by_columns'):
            print(f"\n📈 Feature-Level Drift Analysis:")
            print("-" * 30)
            
            for column, drift_info in results['drift_by_columns'].items():
                drift_detected = drift_info.get('drift_detected', False)
                drift_score = drift_info.get('drift_score', 'N/A')
                
                status = "🚨 DRIFT" if drift_detected else "✅ OK"
                print(f"{column:<20} {status:<10} (Score: {drift_score})")
        
        # Recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        if results['dataset_drift_detected']:
            print("- 🔄 Consider retraining your model")
            print("- 📊 Investigate drifted features")
            print("- ⚠️  Monitor model performance closely")
        else:
            print("- ✅ Model is stable, continue monitoring")
            print("- 📈 Current data matches training distribution")
    
    def calculate_simple_drift_metrics(self):
        """Calculate simple drift metrics manually"""
        if self.reference_data is None or self.current_data is None:
            print("❌ Data not loaded.")
            return None
        
        print("\n🧮 Simple Drift Metrics:")
        print("-" * 30)
        
        metrics = {}
        
        for column in self.reference_data.columns:
            if column in self.current_data.columns:
                ref_mean = self.reference_data[column].mean()
                curr_mean = self.current_data[column].mean()
                
                # Calculate percentage change
                if ref_mean != 0:
                    pct_change = abs((curr_mean - ref_mean) / ref_mean) * 100
                else:
                    pct_change = 0
                
                metrics[column] = {
                    'reference_mean': ref_mean,
                    'current_mean': curr_mean,
                    'percentage_change': pct_change,
                    'drift_detected': pct_change > 10  # 10% threshold
                }
                
                status = "🚨 DRIFT" if pct_change > 10 else "✅ OK"
                print(f"{column:<20} {status} ({pct_change:.1f}% change)")
        
        return metrics
    
    def _simple_drift_detection(self):
        """Simple drift detection without Evidently"""
        print("📊 Running simple statistical drift detection...")
        
        drift_results = {
            'timestamp': datetime.now().isoformat(),
            'dataset_drift_detected': False,
            'drift_share': 0,
            'number_of_columns': 0,
            'number_of_drifted_columns': 0,
            'drift_by_columns': {},
            'summary': ''
        }
        
        numeric_columns = self.reference_data.select_dtypes(include=[np.number]).columns
        drift_results['number_of_columns'] = len(numeric_columns)
        
        drifted_count = 0
        
        for column in numeric_columns:
            if column in self.current_data.columns:
                # Calculate statistical measures
                ref_mean = self.reference_data[column].mean()
                curr_mean = self.current_data[column].mean()
                ref_std = self.reference_data[column].std()
                
                # Calculate drift score (normalized difference)
                if ref_std > 0:
                    drift_score = abs(curr_mean - ref_mean) / ref_std
                else:
                    drift_score = 0
                
                # Determine if drift detected (threshold: 2.0)
                drift_detected = drift_score > 2.0
                
                if drift_detected:
                    drifted_count += 1
                
                drift_results['drift_by_columns'][column] = {
                    'drift_detected': drift_detected,
                    'drift_score': float(drift_score),
                    'reference_mean': float(ref_mean),
                    'current_mean': float(curr_mean)
                }
        
        # Calculate overall drift metrics
        drift_results['number_of_drifted_columns'] = drifted_count
        drift_results['drift_share'] = drifted_count / len(numeric_columns) if len(numeric_columns) > 0 else 0
        drift_results['dataset_drift_detected'] = drifted_count > 0
        
        # Create summary
        if drift_results['dataset_drift_detected']:
            drift_results['summary'] = f"🚨 DRIFT DETECTED: {drifted_count}/{len(numeric_columns)} features drifted ({drift_results['drift_share']:.1%} drift share)"
        else:
            drift_results['summary'] = f"✅ NO DRIFT: All features stable ({drift_results['drift_share']:.1%} drift share)"
        
        return drift_results

if __name__ == "__main__":
    detector = DriftDetector()
    
    if detector.load_data():
        results = detector.detect_drift()
        
        if results:
            print("\n🎯 Drift detection completed successfully!")
        else:
            print("\n❌ Drift detection failed.")