import pandas as pd
import numpy as np
import json
import time
from datetime import datetime, timedelta
import os
import smtplib
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from drift_detector import DriftDetector

class DriftMonitor:
    def __init__(self, drift_threshold=0.2, check_interval_hours=24):
        self.drift_threshold = drift_threshold
        self.check_interval_hours = check_interval_hours
        self.detector = DriftDetector()
        self.monitoring_log = []
        
    def start_monitoring(self):
        """Start continuous drift monitoring"""
        print("🚀 Starting AI Drift Monitoring System")
        print(f"📊 Drift threshold: {self.drift_threshold}")
        print(f"⏰ Check interval: {self.check_interval_hours} hours")
        print("-" * 50)
        
        while True:
            try:
                # Run drift detection
                drift_results = self.run_drift_check()
                
                if drift_results:
                    # Log results
                    self.log_monitoring_result(drift_results)
                    
                    # Check if action needed
                    if self.should_alert(drift_results):
                        self.send_alert(drift_results)
                    
                    # Save monitoring history
                    self.save_monitoring_history()
                
                # Wait for next check
                print(f"⏰ Next check in {self.check_interval_hours} hours...")
                time.sleep(self.check_interval_hours * 3600)  # Convert to seconds
                
            except KeyboardInterrupt:
                print("\n🛑 Monitoring stopped by user")
                break
            except Exception as e:
                print(f"❌ Error in monitoring: {e}")
                time.sleep(300)  # Wait 5 minutes before retry
    
    def run_drift_check(self):
        """Run a single drift detection check"""
        print(f"\n🔍 Running drift check at {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        # Load data and detect drift
        if self.detector.load_data():
            drift_results = self.detector.detect_drift()
            return drift_results
        else:
            print("❌ Could not load data for drift check")
            return None
    
    def should_alert(self, drift_results):
        """Determine if an alert should be sent"""
        if 'error' in drift_results:
            return False
        
        # Check if dataset drift detected
        if drift_results.get('dataset_drift_detected', False):
            return True
        
        # Check drift share threshold
        drift_share = drift_results.get('drift_share', 0)
        if drift_share > self.drift_threshold:
            return True
        
        return False
    
    def send_alert(self, drift_results):
        """Send drift alert (console for now, can be extended to email/Slack)"""
        print("\n🚨 DRIFT ALERT TRIGGERED!")
        print("=" * 40)
        
        alert_message = self.create_alert_message(drift_results)
        print(alert_message)
        
        # Save alert to file
        alert_data = {
            'timestamp': datetime.now().isoformat(),
            'alert_type': 'drift_detected',
            'drift_results': drift_results,
            'message': alert_message
        }
        
        # Append to alerts log
        alerts_file = 'drift_alerts.json'
        alerts = []
        
        if os.path.exists(alerts_file):
            with open(alerts_file, 'r') as f:
                alerts = json.load(f)
        
        alerts.append(alert_data)
        
        with open(alerts_file, 'w') as f:
            json.dump(alerts, f, indent=2)
        
        print(f"📝 Alert logged to {alerts_file}")
    
    def create_alert_message(self, drift_results):
        """Create human-readable alert message"""
        message = f"""
🚨 DATA DRIFT ALERT
==================
Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}
Status: {drift_results.get('summary', 'Drift detected')}

Details:
- Drift Share: {drift_results.get('drift_share', 0):.1%}
- Drifted Features: {drift_results.get('number_of_drifted_columns', 0)}/{drift_results.get('number_of_columns', 0)}

Recommended Actions:
1. 🔍 Review drift report: drift_report.html
2. 📊 Analyze affected features
3. 🔄 Consider model retraining
4. ⚠️  Monitor model performance closely

This is an automated alert from your AI Drift Monitoring System.
        """
        return message
    
    def log_monitoring_result(self, drift_results):
        """Log monitoring result to history"""
        log_entry = {
            'timestamp': datetime.now().isoformat(),
            'dataset_drift_detected': drift_results.get('dataset_drift_detected', False),
            'drift_share': drift_results.get('drift_share', 0),
            'number_of_drifted_columns': drift_results.get('number_of_drifted_columns', 0),
            'alert_triggered': self.should_alert(drift_results)
        }
        
        self.monitoring_log.append(log_entry)
        
        # Print summary
        status = "🚨 DRIFT" if log_entry['dataset_drift_detected'] else "✅ OK"
        print(f"Status: {status} | Drift Share: {log_entry['drift_share']:.1%} | Alert: {log_entry['alert_triggered']}")
    
    def save_monitoring_history(self):
        """Save monitoring history to file"""
        history_file = 'drift_monitoring_history.json'
        
        with open(history_file, 'w') as f:
            json.dump(self.monitoring_log, f, indent=2)
    
    def generate_monitoring_report(self):
        """Generate a monitoring summary report"""
        if not self.monitoring_log:
            print("No monitoring data available")
            return
        
        print("\n📊 DRIFT MONITORING REPORT")
        print("=" * 30)
        
        total_checks = len(self.monitoring_log)
        drift_detected_count = sum(1 for log in self.monitoring_log if log['dataset_drift_detected'])
        alerts_triggered = sum(1 for log in self.monitoring_log if log['alert_triggered'])
        
        print(f"Total Checks: {total_checks}")
        print(f"Drift Detected: {drift_detected_count} ({drift_detected_count/total_checks*100:.1f}%)")
        print(f"Alerts Triggered: {alerts_triggered}")
        
        if self.monitoring_log:
            latest_check = self.monitoring_log[-1]
            print(f"Latest Check: {latest_check['timestamp']}")
            print(f"Latest Status: {'🚨 DRIFT' if latest_check['dataset_drift_detected'] else '✅ OK'}")
    
    def run_single_check(self):
        """Run a single drift check (for testing)"""
        print("🧪 Running single drift check...")
        
        drift_results = self.run_drift_check()
        
        if drift_results:
            self.log_monitoring_result(drift_results)
            
            if self.should_alert(drift_results):
                self.send_alert(drift_results)
            else:
                print("✅ No alert needed - drift within acceptable limits")
            
            return drift_results
        else:
            print("❌ Drift check failed")
            return None

# CLI interface
if __name__ == "__main__":
    import sys
    
    monitor = DriftMonitor(drift_threshold=0.15, check_interval_hours=1)  # 1 hour for demo
    
    if len(sys.argv) > 1:
        command = sys.argv[1]
        
        if command == "start":
            monitor.start_monitoring()
        elif command == "check":
            monitor.run_single_check()
        elif command == "report":
            monitor.generate_monitoring_report()
        else:
            print("Usage: python drift_monitor.py [start|check|report]")
    else:
        print("🔍 AI Drift Monitor")
        print("Available commands:")
        print("  python drift_monitor.py start  - Start continuous monitoring")
        print("  python drift_monitor.py check  - Run single drift check")
        print("  python drift_monitor.py report - Generate monitoring report")