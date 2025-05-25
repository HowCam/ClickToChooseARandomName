import SwiftUI

struct ContentView: View {
    @StateObject private var nameModel = NameModel()
    @State private var showSettings = false
    @State private var showImportSheet = false
    @State private var isRollingMode = false
    
    var body: some View {
        ZStack {
            Color(.systemGroupedBackground)
                .edgesIgnoringSafeArea(.all)
            
            VStack(spacing: 30) {
                // 姓名显示区域
                ZStack {
                    RoundedRectangle(cornerRadius: 20)
                        .fill(Color.white)
                        .shadow(radius: 5)
                    
                    if nameModel.names.isEmpty {
                        Text("请先导入名单")
                            .font(.title)
                            .foregroundColor(.gray)
                    } else {
                        Text(nameModel.currentName ?? "点击抽取")
                            .font(.system(size: 80, weight: .bold))
                            .foregroundColor(.blue)
                            .transition(.opacity)
                    }
                }
                .frame(height: 200)
                .padding(.horizontal)
                
                // 主抽取按钮
                Button(action: {
                    if isRollingMode {
                        nameModel.startRolling()
                    } else {
                        nameModel.pickRandomName()
                    }
                }) {
                    VStack {
                        Image(systemName: "die.face.5")
                            .font(.system(size: 40))
                            .padding(25)
                            .background(Circle().fill(Color.blue))
                            .foregroundColor(.white)
                        Text("抽取名字")
                            .font(.caption)
                    }
                }
                
                // 控制按钮组
                HStack(spacing: 30) {
                    // 模式切换按钮
                    Button(action: {
                        withAnimation {
                            isRollingMode.toggle()
                        }
                    }) {
                        VStack {
                            Image(systemName: isRollingMode ? "repeat" : "shuffle")
                                .font(.title)
                                .padding()
                                .background(Circle().fill(Color.orange))
                                .foregroundColor(.white)
                            Text(isRollingMode ? "滚动模式" : "直接模式")
                                .font(.caption)
                        }
                    }
                    
                    // 导入按钮
                    Button(action: {
                        showImportSheet = true
                    }) {
                        VStack {
                            Image(systemName: "square.and.arrow.down")
                                .font(.title)
                                .padding()
                                .background(Circle().fill(Color.green))
                                .foregroundColor(.white)
                            Text("导入名单")
                                .font(.caption)
                        }
                    }
                    
                    // 设置按钮
                    Button(action: {
                        showSettings = true
                    }) {
                        VStack {
                            Image(systemName: "gear")
                                .font(.title)
                                .padding()
                                .background(Circle().fill(Color.gray))
                                .foregroundColor(.white)
                            Text("设置")
                                .font(.caption)
                        }
                    }
                }
            }
        }
        .sheet(isPresented: $showImportSheet) {
            ImportView(nameModel: nameModel)
        }
        .sheet(isPresented: $showSettings) {
            SettingsView()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView()
    }
}
