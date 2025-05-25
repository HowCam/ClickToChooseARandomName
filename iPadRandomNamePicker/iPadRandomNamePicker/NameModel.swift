import SwiftUI
import AVFoundation

class NameModel: ObservableObject {
    @Published var names: [String] = []
    @Published var currentName: String?
    @Published var isRolling = false
    @Published var scrollNames: [String] = []
    private var audioPlayer: AVAudioPlayer?
    private var timer: Timer?
    private var speed: Double = 0.05
    private var acceleration: Double = 0.95
    private var minSpeed: Double = 0.005
    
    func startRolling() {
        guard !names.isEmpty else { return }
        isRolling = true
        speed = 0.05
        scrollNames = Array(repeating: names, count: 5).flatMap { $0 }
        startTimer()
    }
    
    func stopRolling() {
        isRolling = false
        timer?.invalidate()
        currentName = names.randomElement()
        playSound()
    }
    
    private func startTimer() {
        var index = 0
        timer = Timer.scheduledTimer(withTimeInterval: speed, repeats: true) { [weak self] timer in
            guard let self = self else { return }
            
            if index < self.scrollNames.count {
                self.currentName = self.scrollNames[index]
                if index % self.names.count == 0 {
                    self.playSound()
                }
                index += 1
                self.speed *= self.acceleration
                timer.tolerance = self.speed * 0.1
            } else {
                self.stopRolling()
            }
        }
    }
    
    private func playSound() {
        guard let soundURL = Bundle.main.url(forResource: "click", withExtension: "wav") else { return }
        do {
            audioPlayer = try AVAudioPlayer(contentsOf: soundURL)
            audioPlayer?.play()
        } catch {
            print("无法播放音效: \(error)")
        }
    }
    
    func pickRandomName() {
        guard !names.isEmpty else { return }
        currentName = names.randomElement()
        playSound()
    }

    func importNames(from text: String) {
        let importedNames = text
            .components(separatedBy: .newlines)
            .filter { !$0.isEmpty }
        
        names = importedNames
        saveNames()
        pickRandomName()
    }
    
    private func saveNames() {
        let text = names.joined(separator: "\n")
        if let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first?
            .appendingPathComponent("names.txt") {
            try? text.write(to: url, atomically: true, encoding: .utf8)
        }
    }
    
    func loadSavedNames() {
        if let url = FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first?
            .appendingPathComponent("names.txt"),
           let text = try? String(contentsOf: url) {
            names = text.components(separatedBy: .newlines).filter { !$0.isEmpty }
        }
    }
}
