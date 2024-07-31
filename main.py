import tkinter as tk
from tkinter import messagebox
import json
import sympy as sp

# Load JSON data from file
with open('constants.json', 'r') as f:
    data = json.load(f)


class CalculatorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Calculator with Constants")
        self.root.geometry("1200x800")

        # Frame for constants list
        self.constants_frame = tk.Frame(self.root)
        self.constants_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

        self.listbox = tk.Listbox(self.constants_frame)
        self.listbox.pack(fill=tk.BOTH, expand=True)

        # Frame for calculator
        self.calc_frame = tk.Frame(self.root)
        self.calc_frame.pack(side=tk.RIGHT, fill=tk.BOTH, expand=True)

        self.entry = tk.Entry(self.calc_frame, font=("Arial", 24))
        self.entry.pack(fill=tk.BOTH, expand=True)

        self.buttons_frame = tk.Frame(self.calc_frame)
        self.buttons_frame.pack(fill=tk.BOTH, expand=True)

        self.add_buttons()

        self.constants = {}
        self.populate_listbox()
        self.add_drag_and_drop()

    def populate_listbox(self):
        for item in data:
            unit = item["unit"]
            if unit not in self.constants:
                self.constants[unit] = []
            self.constants[unit].append(item)

        for unit, items in self.constants.items():
            self.listbox.insert(tk.END, unit)
            for item in items:
                display_text = f"  {item['value']} {item['unit']} ({item['uncertainty']})"
                self.listbox.insert(tk.END, display_text)

    def add_buttons(self):
        button_texts = [
            '7', '8', '9', '/',
            '4', '5', '6', '*',
            '1', '2', '3', '-',
            '0', '.', '=', '+',
            'Undo', 'Clean', 'd/dx'
        ]

        for text in button_texts:
            button = tk.Button(self.buttons_frame, text=text, font=("Arial", 18), command=lambda t=text: self.on_button_click(t))
            button.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)

    def on_button_click(self, text):
        if text == '=':
            try:
                expression = self.entry.get()
                result = eval(expression)
                self.entry.delete(0, tk.END)
                self.entry.insert(0, str(result))
            except Exception as e:
                messagebox.showerror("Error", "Invalid expression")
        elif text == 'Undo':
            current_text = self.entry.get()
            if current_text:
                self.entry.delete(len(current_text) - 1, tk.END)
        elif text == 'Clean':
            self.entry.delete(0, tk.END)
        elif text == 'd/dx':
            try:
                expression = self.entry.get()
                x = sp.symbols('x')
                derivative = sp.diff(expression, x)
                self.entry.delete(0, tk.END)
                self.entry.insert(0, str(derivative))
            except Exception as e:
                messagebox.showerror("Error", "Invalid expression for differentiation")
        else:
            self.entry.insert(tk.END, text)

    def add_drag_and_drop(self):
        self.listbox.bind("<ButtonPress-1>", self.on_start)
        self.listbox.bind("<B1-Motion>", self.on_drag)
        self.listbox.bind("<ButtonRelease-1>", self.on_drop)
        self.drag_data = {"x": 0, "y": 0, "item": None}

    def on_start(self, event):
        widget = event.widget
        index = widget.curselection()
        if index:
            self.drag_data["item"] = index[0]
            self.drag_data["x"] = event.x
            self.drag_data["y"] = event.y

    def on_drag(self, event):
        pass  # You can add visual feedback for dragging if needed

    def on_drop(self, event):
        index = self.drag_data["item"]
        if index is not None:
            selected_text = self.listbox.get(index).strip()
            if selected_text and selected_text[0] != " ":
                unit = selected_text
                items = self.constants[unit]
            else:
                constant_value = selected_text.split()[0]
                self.entry.insert(tk.END, constant_value)

if __name__ == "__main__":
    root = tk.Tk()
    app = CalculatorApp(root)
    root.mainloop()
