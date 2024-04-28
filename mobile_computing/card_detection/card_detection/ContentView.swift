import SwiftUI
import AVFoundation
import Roboflow

struct ContentView: View {
    @StateObject private var cameraViewModel = CameraViewModel()
    
    var body: some View {
        ZStack {
            CameraView(cameraViewModel: cameraViewModel)
            
            VStack {
                ForEach(cameraViewModel.detectionItems) { detectionItem in
                    if let className = detectionItem.detection.getValues()["className"] as? String,
                       let confidence = detectionItem.detection.getValues()["confidence"] as? Float {
                        Text("\(className): \(confidence)")
                            .foregroundColor(.white)
                            .padding()
                            .background(Color.blue)
                            .cornerRadius(10)
                    }
                }
                
                Spacer()
            }
            .padding()
        }
        .onAppear {
            cameraViewModel.setupCamera()
        }
    }
}

struct DetectionItem: Identifiable {
    let id = UUID()
    let detection: RFObjectDetectionPrediction
}

class CameraViewModel: NSObject, ObservableObject, AVCaptureVideoDataOutputSampleBufferDelegate {
    @Published var detections: [RFObjectDetectionPrediction] = []
    @Published var detectionItems: [DetectionItem] = []
    
    let captureSession = AVCaptureSession()
    private let rf = RoboflowMobile(apiKey: "mbDpagHG5W1A2JwZKYfR")
    private var mlModel: RFObjectDetectionModel?
    
    func setupCamera() {
        guard let captureDevice = AVCaptureDevice.default(for: .video) else { return }
        guard let input = try? AVCaptureDeviceInput(device: captureDevice) else { return }
        
        captureSession.addInput(input)
        
        let output = AVCaptureVideoDataOutput()
        output.setSampleBufferDelegate(self, queue: DispatchQueue(label: "videoQueue"))
        captureSession.addOutput(output)
        
        captureSession.startRunning()
        
        loadModel()
    }
    
    func loadModel() {
        rf.load(model: "playing-cards-ow27d", modelVersion: 4) { [weak self] model, error, modelName, modelType in
            guard let self = self else { return }
            
            if let error = error {
                print("Error loading model: \(error.localizedDescription)")
            } else {
                self.mlModel = model
                self.mlModel?.configure(threshold: 0.5, overlap: 0.5, maxObjects: 10)
            }
        }
    }
    
    func captureOutput(_ output: AVCaptureOutput, didOutput sampleBuffer: CMSampleBuffer, from connection: AVCaptureConnection) {
        guard let pixelBuffer = CMSampleBufferGetImageBuffer(sampleBuffer) else { return }
        
        mlModel?.detect(pixelBuffer: pixelBuffer) { [weak self] detections, error in
            guard let self = self else { return }
            
            if let detections = detections {
                DispatchQueue.main.async {
                    self.detections = detections
                    self.detectionItems = detections.map { DetectionItem(detection: $0) }
                }
            }
        }
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
