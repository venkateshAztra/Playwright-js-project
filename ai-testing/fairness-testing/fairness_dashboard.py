import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px
import plotly.graph_objects as go
from bias_detector import BiasDetector
import json

def main():
    st.set_page_config(page_title="AI Fairness Dashboard", layout="wide")
    
    st.title("🏛️ AI Fairness & Bias Detection Dashboard")
    st.markdown("Monitor your AI models for fairness violations and bias")
    
    # Sidebar controls
    st.sidebar.header("⚙️ Configuration")
    
    # Initialize detector
    if 'detector' not in st.session_state:
        st.session_state.detector = BiasDetector()
    
    detector = st.session_state.detector
    
    # Data loading section
    st.header("📊 Data Loading")
    
    data_option = st.radio("Choose data source:", 
                          ["Generate Synthetic Data", "Upload CSV File"])
    
    if data_option == "Generate Synthetic Data":
        if st.button("Generate Demo Dataset"):
            detector.load_data()
            st.success("✅ Synthetic hiring dataset generated!")
            st.dataframe(detector.data.head())
            
    else:
        uploaded_file = st.file_uploader("Upload CSV file", type=['csv'])
        if uploaded_file:
            detector.data = pd.read_csv(uploaded_file)
            st.success("✅ Data uploaded successfully!")
            st.dataframe(detector.data.head())
    
    # Model training section
    if detector.data is not None:
        st.header("🤖 Model Training")
        
        target_col = st.selectbox("Select target column:", 
                                 detector.data.columns.tolist())
        
        protected_attrs = st.multiselect("Select protected attributes:",
                                       detector.data.columns.tolist(),
                                       default=['gender', 'age_group', 'race'] if 'gender' in detector.data.columns else [])
        
        detector.protected_attributes = protected_attrs
        
        if st.button("Train Model"):
            with st.spinner("Training model..."):
                detector.train_model(target_col)
                st.success("✅ Model trained successfully!")
    
    # Bias analysis section
    if detector.model is not None:
        st.header("⚖️ Fairness Analysis")
        
        if st.button("Run Bias Detection"):
            with st.spinner("Analyzing bias..."):
                results = detector.detect_bias()
                
                if results:
                    # Display overall metrics
                    st.subheader("📈 Overall Model Performance")
                    metrics = results['overall_metrics']
                    
                    col1, col2, col3, col4 = st.columns(4)
                    col1.metric("Accuracy", f"{metrics['accuracy']:.3f}")
                    col2.metric("Precision", f"{metrics['precision']:.3f}")
                    col3.metric("Recall", f"{metrics['recall']:.3f}")
                    col4.metric("F1-Score", f"{metrics['f1_score']:.3f}")
                    
                    # Bias analysis by attribute
                    st.subheader("🔍 Bias Analysis by Protected Attribute")
                    
                    for attr, attr_data in results['bias_by_attribute'].items():
                        st.write(f"**{attr.upper()}**")
                        
                        # Create DataFrame for visualization
                        df_attr = pd.DataFrame(attr_data).T
                        df_attr.index.name = 'Group'
                        df_attr = df_attr.reset_index()
                        
                        # Positive rate chart
                        fig = px.bar(df_attr, x='Group', y='positive_rate',
                                   title=f'Positive Rate by {attr}',
                                   color='positive_rate',
                                   color_continuous_scale='RdYlBu_r')
                        st.plotly_chart(fig, use_container_width=True)
                        
                        # Metrics table
                        st.dataframe(df_attr.round(3))
                    
                    # Fairness violations
                    st.subheader("🚨 Fairness Violations")
                    
                    if results['fairness_violations']:
                        for violation in results['fairness_violations']:
                            severity_color = {
                                'High': '🔴',
                                'Medium': '🟡',
                                'Low': '🟢'
                            }
                            
                            st.error(f"{severity_color.get(violation['severity'], '⚪')} "
                                   f"**{violation['attribute']}**: {violation['description']} "
                                   f"(Ratio: {violation['ratio']:.3f})")
                    else:
                        st.success("✅ No major fairness violations detected!")
                    
                    # Recommendations
                    st.subheader("💡 Recommendations")
                    for rec in results['recommendations']:
                        st.info(rec)
                    
                    # Download results
                    st.subheader("📥 Download Results")
                    st.download_button(
                        label="Download Bias Analysis Report (JSON)",
                        data=json.dumps(results, indent=2),
                        file_name=f"bias_report_{results['timestamp'][:10]}.json",
                        mime="application/json"
                    )

if __name__ == "__main__":
    main()