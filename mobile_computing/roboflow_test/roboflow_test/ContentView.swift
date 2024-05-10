import SwiftUI
import AVFoundation
import UIKit

struct ContentView: View {
    @StateObject private var cameraViewModel = CameraViewModel()
    
    var body: some View {
        ZStack {
            CameraView(cameraViewModel: cameraViewModel)
            
            VStack {
                ForEach(cameraViewModel.detections, id: \.id) { detection in
                    if let className = detection.className,
                       let confidence = detection.confidence,
                       let x = detection.x,
                       let y = detection.y {
                        Text("\(className): \(confidence), x: \(x), y: \(y)")
                            .foregroundColor(.white)
                            .padding()
                            .background(Color.blue)
                            .cornerRadius(10)
                    }
                }
                
                Spacer()
                
                Button(action: cameraViewModel.capturePhoto) {
                    Text("Capture Photo")
                        .foregroundColor(.white)
                        .padding()
                        .background(Color.blue)
                        .cornerRadius(10)
                }
            }
            .padding()
        }
        .onAppear {
            cameraViewModel.setupCamera()
        }
    }
}

class CameraViewModel: NSObject, ObservableObject, AVCapturePhotoCaptureDelegate {
    @Published var detections: [Detection] = []
    
    public let captureSession = AVCaptureSession()
    private let apiKey = "mbDpagHG5W1A2JwZKYfR"
    private let modelId = "playing-cards-ow27d/4"
    private let photoOutput = AVCapturePhotoOutput()
    
    func setupCamera() {
        guard let captureDevice = AVCaptureDevice.default(for: .video) else { return }
        guard let input = try? AVCaptureDeviceInput(device: captureDevice) else { return }
        
        captureSession.addInput(input)
        
        photoOutput.setPreparedPhotoSettingsArray([AVCapturePhotoSettings(format: [AVVideoCodecKey: AVVideoCodecType.jpeg])], completionHandler: nil)
        captureSession.addOutput(photoOutput)
        
        captureSession.startRunning()
    }
    
    func capturePhoto() {
        let settings = AVCapturePhotoSettings()
        photoOutput.capturePhoto(with: settings, delegate: self)
    }
    
    func photoOutput(_ output: AVCapturePhotoOutput, didFinishProcessingPhoto photo: AVCapturePhoto, error: Error?) {
        guard let imageData = photo.fileDataRepresentation() else { return }
        uploadImage(imageData: imageData)
    }
    
    private func uploadImage(imageData: Data) {
        let fileContent = imageData.base64EncodedString()
        let postData = fileContent.data(using: .utf8)
        
        var request = URLRequest(url: URL(string: "https://detect.roboflow.com/\(modelId)?api_key=\(apiKey)&name=YOUR_IMAGE.jpg")!)
        request.addValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        request.httpMethod = "POST"
        request.httpBody = postData
        
        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Error: \(error)")
                return
            }
            
            guard let httpResponse = response as? HTTPURLResponse, (200...299).contains(httpResponse.statusCode) else {
                print("Server responded with an error")
                return
            }
            
            guard let data = data else {
                print("No data received from the server")
                return
            }
            
            do {
                let response = try JSONDecoder().decode(Response.self, from: data)
                DispatchQueue.main.async {
                    self.detections = response.predictions
                }
            } catch {
                print("Error decoding JSON: \(error)")
            }
        }.resume()
    }
}

struct Response: Codable {
    let time: Double
    let image: Image
    let predictions: [Detection]
    
    struct Image: Codable {
        let width, height: Int
    }
}

struct Detection: Codable, Identifiable {
    let id = UUID()
    let className: String?
    let confidence: Float?
    let x, y, width, height: Float?
    
    enum CodingKeys: String, CodingKey {
        case className = "class"
        case confidence
        case x, y, width, height
    }
}

struct CameraView: UIViewRepresentable {
    @ObservedObject var cameraViewModel: CameraViewModel
    
    func makeUIView(context: Context) -> UIView {
        let view = UIView(frame: UIScreen.main.bounds)
        let previewLayer = AVCaptureVideoPreviewLayer(session: cameraViewModel.captureSession)
        previewLayer.frame = view.bounds
        previewLayer.videoGravity = AVLayerVideoGravity.resizeAspectFill
        view.layer.addSublayer(previewLayer)
        return view
    }
    
    func updateUIView(_ uiView: UIView, context: Context) {}
}
