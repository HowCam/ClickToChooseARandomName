pyinstaller --onefile --icon=icon.ico --noconsole main.py
set "source=.\dist\main.exe"
set "destination=main.exe"
copy /Y "%source%" "%destination%"