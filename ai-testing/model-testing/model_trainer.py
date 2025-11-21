import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, classification_report
from sklearn.datasets import make_classification
import joblib
import json
from datetime import datetime
import os

class ModelTrainer:
    def __init__(self):
        self.models = {}
        self.model_performance = {}
        self.test_results = {}
        
    def generate_user_dataset(self):
        """Generate synthetic user data for model training"""
        # Create synthetic dataset based on our API validation requirements
        np.random.seed(42)
        
        # Generate features
        n_samples = 1000
        
        # Age (18-99)
        ages = np.random.randint(18, 100, n_samples)
        
        # User types (encoded as numbers)
        user_types = np.random.choice([0, 1, 2, 3], n_samples)  # STUDENT, EMPLOYEE, ADMIN, GUEST
        
        # Device activity score (0-100)
        device_scores = np.random.uniform(0, 100, n_samples)
        
        # Login frequency (0-50 per month)
        login_frequency = np.random.poisson(15, n_samples)
        
        # Account age in days
        account_age = np.random.exponential(365, n_samples)
        
        # Create target variable: User Risk Level (0=Low, 1=Medium, 2=High)
        # Business logic for risk assessment
        risk_scores = []
        for i in range(n_samples):
            risk = 0
            
            # Age factor
            if ages[i] < 25 or ages[i] > 70:
                risk += 1
            
            # User type factor
            if user_types[i] == 3:  # GUEST users are riskier
                risk += 1
            elif user_types[i] == 2:  # ADMIN users are lower risk
                risk -= 1
            
            # Activity factors
            if device_scores[i] < 30:  # Low device security
                risk += 1
            if login_frequency[i] > 30:  # Too frequent logins
                risk += 1
            if account_age[i] < 30:  # New accounts are riskier
                risk += 1
            
            # Convert to 0-2 scale
            final_risk = max(0, min(2, risk))
            risk_scores.append(final_risk)
        
        # Create DataFrame
        df = pd.DataFrame({
            'age': ages,
            'user_type': user_types,
            'device_score': device_scores,
            'login_frequency': login_frequency,
            'account_age': account_age,
            'risk_level': risk_scores
        })
        
        # Save dataset
        os.makedirs('data', exist_ok=True)
        df.to_csv('data/user_dataset.csv', index=False)
        
        print(f"✅ Generated dataset with {len(df)} samples")
        print(f"Risk distribution: {df['risk_level'].value_counts().to_dict()}")
        
        return df
    
    def train_models(self, df):
        """Train multiple ML models for comparison"""
        # Prepare features and target
        X = df[['age', 'user_type', 'device_score', 'login_frequency', 'account_age']]
        y = df['risk_level']
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
        
        # Store test data for later use
        self.X_test = X_test
        self.y_test = y_test
        
        # Define models to train
        models_to_train = {
            'RandomForest_v1': RandomForestClassifier(n_estimators=100, random_state=42),
            'RandomForest_v2': RandomForestClassifier(n_estimators=200, max_depth=10, random_state=42),
            'LogisticRegression_v1': LogisticRegression(random_state=42, max_iter=1000),
            'SVM_v1': SVC(kernel='rbf', random_state=42, probability=True)
        }
        
        print("🤖 Training models...")
        
        for model_name, model in models_to_train.items():
            print(f"Training {model_name}...")
            
            # Train model
            model.fit(X_train, y_train)
            
            # Make predictions
            y_pred = model.predict(X_test)
            y_pred_proba = model.predict_proba(X_test) if hasattr(model, 'predict_proba') else None
            
            # Calculate metrics
            metrics = {
                'accuracy': accuracy_score(y_test, y_pred),
                'precision': precision_score(y_test, y_pred, average='weighted'),
                'recall': recall_score(y_test, y_pred, average='weighted'),
                'f1_score': f1_score(y_test, y_pred, average='weighted'),
                'training_date': datetime.now().isoformat(),
                'model_version': model_name,
                'test_samples': len(y_test)
            }
            
            # Store model and performance
            self.models[model_name] = model
            self.model_performance[model_name] = metrics
            
            # Save model
            os.makedirs('models', exist_ok=True)
            joblib.dump(model, f'models/{model_name}.pkl')
            
            print(f"✅ {model_name} - Accuracy: {metrics['accuracy']:.3f}, F1: {metrics['f1_score']:.3f}")
        
        # Save performance metrics
        with open('models/performance_metrics.json', 'w') as f:
            json.dump(self.model_performance, f, indent=2)
        
        return self.model_performance
    
    def compare_models(self):
        """Compare performance of different models"""
        print("\n📊 Model Performance Comparison:")
        print("-" * 80)
        print(f"{'Model':<20} {'Accuracy':<10} {'Precision':<10} {'Recall':<10} {'F1-Score':<10}")
        print("-" * 80)
        
        best_model = None
        best_score = 0
        
        for model_name, metrics in self.model_performance.items():
            print(f"{model_name:<20} {metrics['accuracy']:<10.3f} {metrics['precision']:<10.3f} "
                  f"{metrics['recall']:<10.3f} {metrics['f1_score']:<10.3f}")
            
            if metrics['f1_score'] > best_score:
                best_score = metrics['f1_score']
                best_model = model_name
        
        print("-" * 80)
        print(f"🏆 Best Model: {best_model} (F1-Score: {best_score:.3f})")
        
        return best_model, best_score
    
    def test_model_predictions(self, model_name):
        """Test specific model with sample predictions"""
        if model_name not in self.models:
            print(f"❌ Model {model_name} not found!")
            return
        
        model = self.models[model_name]
        
        # Test with sample user data
        test_users = [
            {'age': 19, 'user_type': 0, 'device_score': 85, 'login_frequency': 10, 'account_age': 365},  # Low risk student
            {'age': 45, 'user_type': 1, 'device_score': 25, 'login_frequency': 35, 'account_age': 30},   # High risk employee
            {'age': 35, 'user_type': 2, 'device_score': 95, 'login_frequency': 5, 'account_age': 1000},  # Low risk admin
            {'age': 22, 'user_type': 3, 'device_score': 15, 'login_frequency': 45, 'account_age': 5}     # High risk guest
        ]
        
        print(f"\n🧪 Testing {model_name} with sample users:")
        print("-" * 60)
        
        for i, user in enumerate(test_users):
            user_df = pd.DataFrame([user])
            prediction = model.predict(user_df)[0]
            
            risk_levels = ['Low', 'Medium', 'High']
            user_types = ['Student', 'Employee', 'Admin', 'Guest']
            
            print(f"User {i+1}: {user_types[user['user_type']]}, Age {user['age']}, "
                  f"Device Score {user['device_score']} → Risk: {risk_levels[prediction]}")
        
        return test_users
    
    def performance_regression_test(self, baseline_accuracy=0.7):
        """Test if model performance meets minimum requirements"""
        print(f"\n🎯 Performance Regression Test (Baseline: {baseline_accuracy})")
        print("-" * 50)
        
        passed_models = []
        failed_models = []
        
        for model_name, metrics in self.model_performance.items():
            if metrics['accuracy'] >= baseline_accuracy:
                passed_models.append(model_name)
                print(f"✅ {model_name}: {metrics['accuracy']:.3f} (PASS)")
            else:
                failed_models.append(model_name)
                print(f"❌ {model_name}: {metrics['accuracy']:.3f} (FAIL)")
        
        print(f"\nResults: {len(passed_models)} passed, {len(failed_models)} failed")
        
        return {
            'passed': passed_models,
            'failed': failed_models,
            'baseline': baseline_accuracy
        }

# Main execution
if __name__ == "__main__":
    print("🚀 AI Model Performance Testing Framework")
    print("=" * 50)
    
    trainer = ModelTrainer()
    
    # Step 1: Generate dataset
    print("\n1️⃣ Generating synthetic user dataset...")
    df = trainer.generate_user_dataset()
    
    # Step 2: Train multiple models
    print("\n2️⃣ Training multiple ML models...")
    performance = trainer.train_models(df)
    
    # Step 3: Compare models
    print("\n3️⃣ Comparing model performance...")
    best_model, best_score = trainer.compare_models()
    
    # Step 4: Test predictions
    print("\n4️⃣ Testing model predictions...")
    trainer.test_model_predictions(best_model)
    
    # Step 5: Performance regression test
    print("\n5️⃣ Running performance regression tests...")
    regression_results = trainer.performance_regression_test()
    
    print(f"\n🎉 Model testing complete! Best model: {best_model}")