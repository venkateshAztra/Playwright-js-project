import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import json
from datetime import datetime
import os

class DriftDashboard:
    def __init__(self):
        self.reference_data = None
        self.current_data = None
        
    def load_data(self):
        """Load reference and current data"""
        try:
            self.reference_data = pd.read_csv('data/reference.csv')
            self.current_data = pd.read_csv('data/current.csv')
            return True
        except:
            return False
    
    def create_distribution_plots(self):
        """Create distribution comparison plots"""
        if self.reference_data is None or self.current_data is None:
            st.error("Data not loaded!")
            return
        
        # Get numeric columns
        numeric_columns = self.reference_data.select_dtypes(include=[np.number]).columns
        
        for column in numeric_columns:
            st.subheader(f"📊 {column} Distribution")
            
            # Create subplot
            fig = make_subplots(
                rows=1, cols=2,
                subplot_titles=('Reference Data', 'Current Data'),
                specs=[[{"secondary_y": False}, {"secondary_y": False}]]
            )
            
            # Reference data histogram
            fig.add_trace(
                go.Histogram(
                    x=self.reference_data[column],
                    name='Reference',
                    opacity=0.7,
                    marker_color='blue'
                ),
                row=1, col=1
            )
            
            # Current data histogram
            fig.add_trace(
                go.Histogram(
                    x=self.current_data[column],
                    name='Current',
                    opacity=0.7,
                    marker_color='red'
                ),
                row=1, col=2
            )
            
            fig.update_layout(
                title=f"{column} Distribution Comparison",
                showlegend=True,
                height=400
            )
            
            st.plotly_chart(fig, use_container_width=True)
            
            # Show statistics
            col1, col2 = st.columns(2)
            
            with col1:
                st.metric(
                    "Reference Mean",
                    f"{self.reference_data[column].mean():.2f}",
                    f"Std: {self.reference_data[column].std():.2f}"
                )
            
            with col2:
                current_mean = self.current_data[column].mean()
                ref_mean = self.reference_data[column].mean()
                delta = current_mean - ref_mean
                
                st.metric(
                    "Current Mean",
                    f"{current_mean:.2f}",
                    f"{delta:+.2f}"
                )
    
    def create_drift_summary(self):
        """Create drift detection summary"""
        st.header("🔍 Drift Detection Summary")
        
        # Load drift results if available
        if os.path.exists('drift_results.json'):
            with open('drift_results.json', 'r') as f:
                drift_results = json.load(f)
            
            # Overall drift status
            if drift_results.get('dataset_drift_detected', False):
                st.error("🚨 DRIFT DETECTED!")
            else:
                st.success("✅ NO DRIFT DETECTED")
            
            # Metrics
            col1, col2, col3 = st.columns(3)
            
            with col1:
                st.metric(
                    "Drift Share",
                    f"{drift_results.get('drift_share', 0):.1%}"
                )
            
            with col2:
                st.metric(
                    "Drifted Features",
                    f"{drift_results.get('number_of_drifted_columns', 0)}"
                )
            
            with col3:
                st.metric(
                    "Total Features",
                    f"{drift_results.get('number_of_columns', 0)}"
                )
            
            # Feature-level drift
            if 'drift_by_columns' in drift_results:
                st.subheader("📈 Feature-Level Drift Analysis")
                
                drift_data = []
                for column, info in drift_results['drift_by_columns'].items():
                    drift_data.append({
                        'Feature': column,
                        'Drift Detected': '🚨 Yes' if info.get('drift_detected', False) else '✅ No',
                        'Drift Score': info.get('drift_score', 'N/A')
                    })
                
                drift_df = pd.DataFrame(drift_data)
                st.dataframe(drift_df, use_container_width=True)
        
        else:
            st.warning("No drift results found. Run drift detection first!")
    
    def create_data_overview(self):
        """Create data overview section"""
        st.header("📊 Data Overview")
        
        if self.reference_data is not None and self.current_data is not None:
            col1, col2 = st.columns(2)
            
            with col1:
                st.subheader("Reference Data")
                st.write(f"**Samples:** {len(self.reference_data)}")
                st.write(f"**Features:** {len(self.reference_data.columns)}")
                st.dataframe(self.reference_data.describe(), use_container_width=True)
            
            with col2:
                st.subheader("Current Data")
                st.write(f"**Samples:** {len(self.current_data)}")
                st.write(f"**Features:** {len(self.current_data.columns)}")
                st.dataframe(self.current_data.describe(), use_container_width=True)
        else:
            st.error("Data not loaded. Please ensure data files exist in 'data/' folder.")

def main():
    st.set_page_config(
        page_title="AI Drift Detection Dashboard",
        page_icon="🔍",
        layout="wide"
    )
    
    st.title("🔍 AI Data Drift Detection Dashboard")
    st.markdown("Monitor your ML model's data drift in real-time")
    
    # Initialize dashboard
    dashboard = DriftDashboard()
    
    # Sidebar
    st.sidebar.header("🛠️ Controls")
    
    if st.sidebar.button("🔄 Refresh Data"):
        st.rerun()
    
    if st.sidebar.button("🧪 Run Drift Detection"):
        with st.spinner("Running drift detection..."):
            os.system("python drift_detector.py")
        st.success("Drift detection completed!")
        st.rerun()
    
    # Load data
    if dashboard.load_data():
        # Create tabs
        tab1, tab2, tab3 = st.tabs(["📊 Overview", "🔍 Drift Analysis", "📈 Distributions"])
        
        with tab1:
            dashboard.create_data_overview()
        
        with tab2:
            dashboard.create_drift_summary()
        
        with tab3:
            dashboard.create_distribution_plots()
    
    else:
        st.error("❌ Could not load data files!")
        st.info("💡 Make sure to run 'python scripts/generate_data.py' first to create the datasets.")
        
        if st.button("🚀 Generate Sample Data"):
            with st.spinner("Generating sample data..."):
                os.system("python scripts/generate_data.py")
            st.success("Sample data generated!")
            st.rerun()

if __name__ == "__main__":
    main()