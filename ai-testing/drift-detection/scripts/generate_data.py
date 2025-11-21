import pandas as pd
from sklearn.datasets import load_iris
import numpy as np
import os

def create_drifted_data():
    # Load the famous Iris dataset
    iris = load_iris(as_frame=True)
    df = iris.frame
    df["target"] = iris.target

    # Split into reference & new data
    reference = df.sample(frac=0.7, random_state=42)
    new_data = df.drop(reference.index)

    # Introduce drift in the new data (simulate real-world data changes)
    new_data = new_data.copy()
    new_data["sepal width (cm)"] = new_data["sepal width (cm)"] * np.random.uniform(0.8, 1.2, len(new_data))

    # Create data directory if it doesn't exist
    os.makedirs("../data", exist_ok=True)
    
    # Save datasets
    reference.to_csv("../data/reference.csv", index=False)
    new_data.to_csv("../data/current.csv", index=False)
    
    print("✅ Generated reference and current datasets!")
    print(f"Reference data: {len(reference)} rows")
    print(f"Current data: {len(new_data)} rows")

if __name__ == "__main__":
    create_drifted_data()