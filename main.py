import tkinter as tk
from PIL import Image, ImageTk
import random
import openpyxl

class FloatingWindow:
    def __init__(self, master):
        self.master = master
        master.title("点名器")
        master.attributes("-topmost", True)  # 窗口置顶

        # 设置窗口图标
        icon = Image.open("icon.png")  # 替换为你的png文件路径
        master.iconphoto(True, ImageTk.PhotoImage(icon))

        self.load_names_from_excel()

        self.label = tk.Label(master, font=("楷体", 50), fg="#005f35")
        self.label.place(relx=0.5, rely=0.5, anchor=tk.CENTER)  # 将标签放置在窗口中央

        self.update_name()

        self.label.bind("<Button-1>", self.update_name)  # 点击窗口更新姓名

    def load_names_from_excel(self):
        self.names = []
        wb = openpyxl.load_workbook('names.xlsx')  # 替换为你的xlsx文件路径
        ws = wb.active
        for row in ws.iter_rows(values_only=True):
            self.names.extend(row)

    def update_name(self, event=None):
        name = random.choice(self.names)
        self.label.config(text=name)

def main():
    root = tk.Tk()
    root.geometry("280x120+100+100")  # 设置窗口大小和位置
    app = FloatingWindow(root)
    root.mainloop()

if __name__ == "__main__":
    main()
