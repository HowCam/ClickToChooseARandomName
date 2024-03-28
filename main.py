import tkinter as tk
import random
import openpyxl
import keyboard

class FloatingWindow:
    def __init__(self, master):
        self.master = master
        master.title("点名器")   # 设置窗口标题
        master.geometry("650x300+100+100")  # 设置窗口大小和位置

        self.load_names_from_excel()

        self.name_label = tk.Label(master, font=("楷体", 120), fg="#005f35")  #姓名标签
        self.name_label.place(relx=0.5, rely=0.5, anchor=tk.CENTER)  # 将姓名标签放置在窗口中央

        self.update_name()

        self.name_label.bind("<Button-1>", self.update_name)  # 点击窗口更新姓名
        self.master.bind("<space>", self.update_name)    #按下空格键更新姓名
        self.master.bind("<Return>", self.update_name)    #按下回车键更新姓名

        # 添加全局键盘监听事件
        self.shift_pressed = False
        keyboard.on_press_key("shift", self.toggle_window)

        # 添加提示文本
        self.tip_label = tk.Label(master, text="按下 Shift 键隐藏/显示窗口", font=("仿宋", 12), fg="gray")
        self.tip_label.place(relx=1.0, rely=1.0, anchor=tk.SE)

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

    # 切换隐藏/显示窗口状态
    def toggle_window(self, event):
        self.shift_pressed = not self.shift_pressed
        if self.shift_pressed:
            self.master.withdraw()  # 隐藏窗口
        else:
            self.master.deiconify()  # 显示窗口

def main():
    root = tk.Tk()
    app = FloatingWindow(root)
    root.mainloop()

if __name__ == "__main__":
    main()
