import pandas as pd
import numpy as np
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import json
from datetime import datetime

class BiasDetector:
    def __init__(self):
        self.model = None
        self.data = None
        self.predictions = None
        self.protected_attributes = []
        
    def load_data(self, data_path=None, protected_attrs=None):
        """Load dataset and define protected attributes"""
        if data_path:
            self.data = pd.read_csv(data_path)
        else:
            # Generate synthetic dataset for demo
            self.data = self._generate_synthetic_data()
            
        self.protected_attributes = protected_attrs or ['gender', 'age_group', 'race']
        
        print(f"✅ Data loaded: {len(self.data)} samples")
        print(f"🔒 Protected attributes: {self.protected_attributes}")
        print(f"\n📊 Data preview:")
        print(self.data.head())
        
        return True
    
    def _generate_synthetic_data(self):
        """Generate synthetic hiring dataset with potential bias"""
        np.random.seed(42)
        n_samples = 1000
        
        # Protected attributes
        gender = np.random.choice(['Male', 'Female'], n_samples, p=[0.6, 0.4])
        age_group = np.random.choice(['Young', 'Middle', 'Senior'], n_samples, p=[0.4, 0.4, 0.2])
        race = np.random.choice(['White', 'Black', 'Hispanic', 'Asian'], n_samples, p=[0.5, 0.2, 0.2, 0.1])
        
        # Features
        experience = np.random.normal(5, 2, n_samples)
        education = np.random.choice([1, 2, 3, 4], n_samples, p=[0.1, 0.3, 0.4, 0.2])
        skills_score = np.random.normal(75, 15, n_samples)
        
        # Introduce bias: favor males and younger candidates
        bias_factor = np.where(gender == 'Male', 1.2, 0.8) * np.where(age_group == 'Young', 1.1, 0.9)
        
        # Target variable with bias
        hiring_score = (experience * 0.3 + education * 0.2 + skills_score * 0.01) * bias_factor
        hired = (hiring_score > np.percentile(hiring_score, 70)).astype(int)
        
        return pd.DataFrame({
            'gender': gender,
            'age_group': age_group,
            'race': race,
            'experience': np.clip(experience, 0, 15),
            'education': education,
            'skills_score': np.clip(skills_score, 0, 100),
            'hired': hired
        })
    
    def train_model(self, target_column='hired'):
        """Train a model for bias testing"""
        # Prepare features (exclude protected attributes and target)
        feature_cols = [col for col in self.data.columns 
                       if col not in self.protected_attributes + [target_column]]
        
        X = pd.get_dummies(self.data[feature_cols])
        y = self.data[target_column]
        
        # Train model
        self.model = RandomForestClassifier(random_state=42)
        self.model.fit(X, y)
        
        # Get predictions
        self.predictions = self.model.predict(X)
        
        print(f"✅ Model trained on features: {feature_cols}")
        print(f"📊 Overall accuracy: {accuracy_score(y, self.predictions):.3f}")
        
        return True
    
    def detect_bias(self):
        """Detect bias across protected attributes"""
        if self.model is None or self.predictions is None:
            print("❌ Model not trained. Run train_model() first.")
            return None
        
        print("\n🔍 Analyzing Fairness and Bias...")
        print("=" * 50)
        
        bias_results = {
            'timestamp': datetime.now().isoformat(),
            'overall_metrics': self._calculate_overall_metrics(),
            'bias_by_attribute': {},
            'fairness_violations': [],
            'recommendations': []
        }
        
        # Analyze each protected attribute
        for attr in self.protected_attributes:
            if attr in self.data.columns:
                attr_results = self._analyze_attribute_bias(attr)
                bias_results['bias_by_attribute'][attr] = attr_results
                
                # Check for violations
                violations = self._check_fairness_violations(attr, attr_results)
                bias_results['fairness_violations'].extend(violations)
        
        # Generate recommendations
        bias_results['recommendations'] = self._generate_recommendations(bias_results)
        
        # Display results
        self._display_bias_results(bias_results)
        
        # Save results
        with open('bias_results.json', 'w') as f:
            json.dump(bias_results, f, indent=2)
        
        return bias_results
    
    def _calculate_overall_metrics(self):
        """Calculate overall model performance metrics"""
        y_true = self.data['hired']
        return {
            'accuracy': float(accuracy_score(y_true, self.predictions)),
            'precision': float(precision_score(y_true, self.predictions)),
            'recall': float(recall_score(y_true, self.predictions)),
            'f1_score': float(f1_score(y_true, self.predictions))
        }
    
    def _analyze_attribute_bias(self, attribute):
        """Analyze bias for a specific protected attribute"""
        results = {}
        
        for group in self.data[attribute].unique():
            mask = self.data[attribute] == group
            group_data = self.data[mask]
            group_predictions = self.predictions[mask]
            group_actual = group_data['hired']
            
            # Calculate metrics for this group
            if len(group_actual) > 0:
                results[str(group)] = {
                    'count': int(len(group_data)),
                    'positive_rate': float(group_predictions.mean()),
                    'accuracy': float(accuracy_score(group_actual, group_predictions)),
                    'precision': float(precision_score(group_actual, group_predictions, zero_division=0)),
                    'recall': float(recall_score(group_actual, group_predictions, zero_division=0)),
                    'f1_score': float(f1_score(group_actual, group_predictions, zero_division=0))
                }
        
        return results
    
    def _check_fairness_violations(self, attribute, attr_results):
        """Check for fairness violations using demographic parity"""
        violations = []
        
        # Get positive rates for all groups
        positive_rates = {group: data['positive_rate'] 
                         for group, data in attr_results.items()}
        
        if len(positive_rates) < 2:
            return violations
        
        # Check demographic parity (80% rule)
        max_rate = max(positive_rates.values())
        min_rate = min(positive_rates.values())
        
        if min_rate / max_rate < 0.8:  # 80% rule violation
            violations.append({
                'attribute': attribute,
                'violation_type': 'Demographic Parity',
                'severity': 'High' if min_rate / max_rate < 0.6 else 'Medium',
                'description': f"Significant disparity in positive rates: {min_rate:.3f} vs {max_rate:.3f}",
                'ratio': float(min_rate / max_rate)
            })
        
        return violations
    
    def _generate_recommendations(self, bias_results):
        """Generate recommendations based on bias analysis"""
        recommendations = []
        
        if bias_results['fairness_violations']:
            recommendations.extend([
                "🔄 Re-examine training data for historical bias",
                "⚖️ Consider bias mitigation techniques (reweighting, adversarial debiasing)",
                "📊 Implement fairness constraints during model training",
                "🔍 Regular bias monitoring in production"
            ])
        else:
            recommendations.extend([
                "✅ Model shows acceptable fairness levels",
                "📈 Continue monitoring for bias drift",
                "🔄 Regular fairness audits recommended"
            ])
        
        return recommendations
    
    def _display_bias_results(self, results):
        """Display bias analysis results"""
        print(f"\n📊 BIAS DETECTION RESULTS")
        print("=" * 50)
        print(f"Timestamp: {results['timestamp']}")
        
        # Overall metrics
        metrics = results['overall_metrics']
        print(f"\n📈 Overall Model Performance:")
        print(f"Accuracy: {metrics['accuracy']:.3f}")
        print(f"Precision: {metrics['precision']:.3f}")
        print(f"Recall: {metrics['recall']:.3f}")
        print(f"F1-Score: {metrics['f1_score']:.3f}")
        
        # Bias by attribute
        for attr, attr_data in results['bias_by_attribute'].items():
            print(f"\n⚖️ Bias Analysis - {attr.upper()}:")
            print("-" * 30)
            
            for group, metrics in attr_data.items():
                print(f"{group:<15} | Positive Rate: {metrics['positive_rate']:.3f} | "
                      f"Accuracy: {metrics['accuracy']:.3f} | Count: {metrics['count']}")
        
        # Violations
        if results['fairness_violations']:
            print(f"\n🚨 FAIRNESS VIOLATIONS DETECTED:")
            print("-" * 40)
            for violation in results['fairness_violations']:
                print(f"• {violation['attribute']}: {violation['description']} "
                      f"(Severity: {violation['severity']})")
        else:
            print(f"\n✅ NO MAJOR FAIRNESS VIOLATIONS DETECTED")
        
        # Recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        for rec in results['recommendations']:
            print(f"  {rec}")

if __name__ == "__main__":
    detector = BiasDetector()
    
    # Load data and train model
    if detector.load_data():
        if detector.train_model():
            results = detector.detect_bias()
            
            if results:
                print("\n🎯 Bias detection completed successfully!")
            else:
                print("\n❌ Bias detection failed.")