import SwiftUI
import UniformTypeIdentifiers

struct ImportView: View {
    @ObservedObject var nameModel: NameModel
    @Environment(\.presentationMode) var presentationMode
    @State private var nameText: String = ""
    
    var body: some View {
        NavigationView {
            Form {
                Section(header: Text("文本导入")) {
                    TextEditor(text: $nameText)
                        .frame(height: 200)
                        .overlay(
                            RoundedRectangle(cornerRadius: 8)
                                .stroke(Color.gray, lineWidth: 1)
                        )
                    
                    Button("导入名单") {
                        nameModel.importNames(from: nameText)
                        presentationMode.wrappedValue.dismiss()
                    }
                    .disabled(nameText.isEmpty)
                }
                
                Section(header: Text("文件导入")) {
                    Button("从文件导入") {
                        let picker = DocumentPickerViewController(
                            supportedTypes: [.commaSeparatedText, .spreadsheet],
                            onPick: { urls in
                                if let url = urls.first {
                                    if let text = try? String(contentsOf: url) {
                                        nameModel.importNames(from: text)
                                    }
                                }
                                presentationMode.wrappedValue.dismiss()
                            }
                        )
                        UIApplication.shared.windows.first?.rootViewController?.present(picker, animated: true)
                    }
                }
            }
            .navigationTitle("导入名单")
            .navigationBarItems(trailing: Button("取消") {
                presentationMode.wrappedValue.dismiss()
            })
            .onAppear {
                nameModel.loadSavedNames()
                nameText = nameModel.names.joined(separator: "\n")
            }
        }
    }
}

class DocumentPickerViewController: UIDocumentPickerViewController {
    private let onPick: ([URL]) -> Void
    
    init(supportedTypes: [UTType], onPick: @escaping ([URL]) -> Void) {
        self.onPick = onPick
        super.init(forOpeningContentTypes: supportedTypes, asCopy: true)
        allowsMultipleSelection = false
        delegate = self
    }
    
    required init?(coder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
}

extension DocumentPickerViewController: UIDocumentPickerDelegate {
    func documentPicker(_ controller: UIDocumentPickerViewController, didPickDocumentsAt urls: [URL]) {
        onPick(urls)
    }
    
    func documentPickerWasCancelled(_ controller: UIDocumentPickerViewController) {
        onPick([])
    }
}
