import SwiftUI

@main
struct iPadRandomNamePickerApp: App {
    @StateObject private var nameModel = NameModel()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(nameModel)
                .onAppear {
                    nameModel.loadSavedNames()
                }
        }
    }
}
