import tkinter as tk
import random
import openpyxl
import keyboard
import requests
from tkinter import messagebox

class FloatingWindow:
    def __init__(self, master):
        self.master = master
        master.title("点名器")   # 设置窗口标题
        master.geometry("650x300+100+100")  # 设置窗口大小和位置

        # 设置图标
        master.iconbitmap("icon.ico")

        # 存储当前版本号
        self.current_version = "1.1.2"

        # 获取远程服务器上的最新版本号
        self.latest_version = self.get_latest_version()

        self.load_names_from_excel()

        self.name_label = tk.Label(master, font=("楷体", 120), fg="#005f35")  #姓名标签
        self.name_label.place(relx=0.5, rely=0.5, anchor=tk.CENTER)  # 将姓名标签放置在窗口中央

        self.update_name()

        self.name_label.bind("<Button-1>", self.update_name)  # 点击窗口更新姓名
        self.master.bind("<space>", self.update_name)     #按下空格键更新姓名
        self.master.bind("<Return>", self.update_name)    #按下回车键更新姓名
        self.master.bind("<Down>", self.update_name)      #按下方向下键更新姓名

        # 添加全局键盘监听事件
        self.shift_pressed = False
        keyboard.on_press_key("x", self.toggle_window)

        # 添加提示文本
        self.tip_label = tk.Label(master, text="按下 X 键隐藏/显示窗口", font=("仿宋", 12), fg="gray")
        self.tip_label.place(relx=1.0, rely=1.0, anchor=tk.SE)

        # 显示当前版本
        self.version_label = tk.Label(master, text=f"当前版本：{self.current_version}", font=("仿宋", 12))
        self.version_label.place(relx=0.5, rely=1.0, anchor=tk.S)

        # 检查更新并显示通知
        self.check_and_notify_update()

        # 设置窗口置顶
        master.attributes("-topmost", True)

    def load_names_from_excel(self):
        self.names = []
        wb = openpyxl.load_workbook('names.xlsx')  # xlsx文件路径
        ws = wb.active
        for row in ws.iter_rows(values_only=True):
            self.names.extend(row)

    # 选择随机姓名
    def update_name(self, event=None):
        name = random.choice(self.names)
        self.name_label.config(text=name)
        self.master.update()  # 更新 GUI

    # 切换隐藏/显示窗口状态
    def toggle_window(self, event):
        self.shift_pressed = not self.shift_pressed
        if self.shift_pressed:
            self.master.withdraw()  # 隐藏窗口
        else:
            self.master.deiconify()  # 显示窗口

    # 获取远程服务器上的最新版本号
    def get_latest_version(self):
        try:
            response = requests.get("https://api.github.com/repos/HowCam/ClickToChooseARandomName/releases/latest")
            latest_version = response.json()["tag_name"]
            return latest_version
        except Exception as e:
            print("Error fetching latest version:", e)
            return None

    # 检查更新并显示通知
    def check_and_notify_update(self):
        if self.latest_version and self.latest_version != self.current_version:
            message = f"发现新版本 {self.latest_version}，请 前往GitHub 或 联系作者 获取最新版本！"
            messagebox.showinfo("更新提示", message)

def main():
    root = tk.Tk()
    app = FloatingWindow(root)
    app.update_name()  # 初始化时更新一次姓名
    root.mainloop()

if __name__ == "__main__":
    main()
