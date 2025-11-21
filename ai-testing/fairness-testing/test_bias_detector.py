import unittest
import pandas as pd
import numpy as np
from bias_detector import BiasDetector

class TestBiasDetector(unittest.TestCase):
    def setUp(self):
        """Set up test fixtures"""
        self.detector = BiasDetector()
        
    def test_load_synthetic_data(self):
        """Test loading synthetic data"""
        result = self.detector.load_data()
        
        self.assertTrue(result)
        self.assertIsNotNone(self.detector.data)
        self.assertEqual(len(self.detector.data), 1000)
        self.assertIn('gender', self.detector.data.columns)
        self.assertIn('hired', self.detector.data.columns)
        
    def test_model_training(self):
        """Test model training"""
        self.detector.load_data()
        result = self.detector.train_model()
        
        self.assertTrue(result)
        self.assertIsNotNone(self.detector.model)
        self.assertIsNotNone(self.detector.predictions)
        
    def test_bias_detection(self):
        """Test bias detection functionality"""
        self.detector.load_data()
        self.detector.train_model()
        results = self.detector.detect_bias()
        
        self.assertIsNotNone(results)
        self.assertIn('timestamp', results)
        self.assertIn('overall_metrics', results)
        self.assertIn('bias_by_attribute', results)
        self.assertIn('fairness_violations', results)
        
    def test_fairness_violations_detection(self):
        """Test detection of fairness violations"""
        # Create biased data
        biased_data = pd.DataFrame({
            'gender': ['Male'] * 60 + ['Female'] * 40,
            'experience': np.random.normal(5, 2, 100),
            'education': np.random.choice([1, 2, 3, 4], 100),
            'skills_score': np.random.normal(75, 15, 100),
            'hired': [1] * 50 + [0] * 10 + [1] * 10 + [0] * 30  # Biased toward males
        })
        
        self.detector.data = biased_data
        self.detector.protected_attributes = ['gender']
        self.detector.train_model()
        results = self.detector.detect_bias()
        
        # Should detect bias
        self.assertGreater(len(results['fairness_violations']), 0)
        
    def test_no_bias_scenario(self):
        """Test scenario with no significant bias"""
        # Create fair data
        fair_data = pd.DataFrame({
            'gender': ['Male'] * 50 + ['Female'] * 50,
            'experience': np.random.normal(5, 2, 100),
            'education': np.random.choice([1, 2, 3, 4], 100),
            'skills_score': np.random.normal(75, 15, 100),
            'hired': np.random.choice([0, 1], 100, p=[0.7, 0.3])  # Fair hiring
        })
        
        self.detector.data = fair_data
        self.detector.protected_attributes = ['gender']
        self.detector.train_model()
        results = self.detector.detect_bias()
        
        # Should have minimal or no violations
        self.assertIsNotNone(results)

if __name__ == '__main__':
    print("🧪 Running Bias Detection Tests...")
    print("=" * 40)
    
    unittest.main(verbosity=2)