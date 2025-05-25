import SwiftUI

struct SettingsView: View {
    @AppStorage("animationEnabled") var animationEnabled = true
    @AppStorage("soundEnabled") var soundEnabled = true
    @AppStorage("selectedColor") var selectedColor = "blue"
    
    let colors = ["blue", "green", "orange", "purple", "red"]
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("显示设置")) {
                    Toggle("动画效果", isOn: $animationEnabled)
                    
                    Picker("主题颜色", selection: $selectedColor) {
                        ForEach(colors, id: \.self) { color in
                            Text(color.localizedCapitalized)
                        }
                    }
                }
                
                Section(header: Text("声音设置")) {
                    Toggle("音效", isOn: $soundEnabled)
                }
            }
            .navigationTitle("设置")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button("完成") {
                        // 关闭设置视图
                    }
                }
            }
        }
    }
}

struct SettingsView_Previews: PreviewProvider {
    static var previews: some View {
        SettingsView()
    }
}
