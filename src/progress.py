import os
import time
import datetime
import tkinter as tk
from tkinter import ttk
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from dotenv import load_dotenv

load_dotenv('.env')

domains = os.getenv('DOMAINS').split(',')
entities = os.getenv('ENTITIES').split(',')
target_value = 2 ** (len(domains) + len(entities))

directory_path = os.getenv('RESULTS_FOLDER_NAME')

dir_counts = []
timestamps = []

def seconds_to_human_readable(seconds):
    hours, remainder = divmod(seconds, 3600)
    minutes, seconds = divmod(remainder, 60)
    return f"{int(hours)}h {int(minutes)}m {int(seconds)}s"

def calculate_eta():
    length = len(dir_counts)
    if length < 2:
        return "Not enough data to calculate ETA"

    initial_count = dir_counts[0]
    initial_time = timestamps[0]
    current_count = dir_counts[-1]
    current_time = timestamps[-1]

    growth_rate = (current_count - initial_count) / (current_time - initial_time)
    if growth_rate <= 0:
        return "Growth rate is non-positive, cannot calculate ETA"

    remaining_dirs = target_value - current_count
    eta_seconds = remaining_dirs / growth_rate
    eta_time = datetime.datetime.fromtimestamp(current_time + eta_seconds).strftime("%Y-%m-%d %H:%M:%S")
    human_readable_eta = seconds_to_human_readable(eta_seconds)

    if length > 2:
        previous_eta_seconds = (target_value - dir_counts[-2]) / growth_rate
        previous_eta_time = datetime.datetime.fromtimestamp(timestamps[-2] + previous_eta_seconds).strftime("%Y-%m-%d %H:%M:%S")
        return f"ETA: {eta_time} ({human_readable_eta})\nPrevious ETA: {previous_eta_time}"
    else:
        return f"ETA: {eta_time} ({human_readable_eta})"

def update_data():
    total_dirs = sum([len(directories) for _, directories, _ in os.walk(directory_path)])
    current_time = time.time()

    dir_counts.append(total_dirs)
    timestamps.append(current_time)

    percentage = (total_dirs / target_value) * 100

    eta_info = calculate_eta()

    label_total_dirs.config(text=f"Total directories: {total_dirs}")
    label_percentage.config(text=f"Percentage: {percentage:.2f}%")
    label_eta.config(text=eta_info)

    plot_graph()

    root.after(10000, update_data)

def plot_graph():
    times = [datetime.datetime.fromtimestamp(ts) for ts in timestamps]
    fig.clear()
    ax = fig.add_subplot(111)
    ax.plot(times, dir_counts, marker='o', label="Actual Growth")
    
    if len(dir_counts) > 1:
        initial_count = dir_counts[0]
        initial_time = timestamps[0]
        current_count = dir_counts[-1]
        current_time = timestamps[-1]
        growth_rate = (current_count - initial_count) / (current_time - initial_time)
        
        expected_counts = [initial_count + growth_rate * (ts - initial_time) for ts in timestamps]
        ax.plot(times, expected_counts, 'r--', label="Expected Growth")

    ax.set_title("Directory Count Over Time")
    ax.set_xlabel("Time")
    ax.set_ylabel("Directory Count")
    ax.legend()
    canvas.draw()

root = tk.Tk()
root.title("Directory Monitor")

label_total_dirs = ttk.Label(root, text="Total directories: ")
label_total_dirs.pack()

label_percentage = ttk.Label(root, text="Percentage: ")
label_percentage.pack()

label_eta = ttk.Label(root, text="ETA: ")
label_eta.pack()

fig = plt.Figure(figsize=(6, 4), dpi=100)
canvas = FigureCanvasTkAgg(fig, master=root)
canvas.get_tk_widget().pack()

update_data()

root.mainloop()