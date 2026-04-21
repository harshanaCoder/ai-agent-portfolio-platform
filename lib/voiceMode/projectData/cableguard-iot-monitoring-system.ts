import type { PortfolioProject } from "../../voiceAssistantData";

export const cableguardIotMonitoringSystemProject: PortfolioProject = {



    "name": "CableGuard",

    "summary": "CableGuard is a real-time IoT cable health monitoring system.\nIt estimates tension and fatigue from live vibration data and streams results to dashboards.",

    "description_long": "The system uses an ESP32 with an MPU6050 to sample tri-axial acceleration at a nominal 200 Hz and publish JSON packets over MQTT (with device_id and t_ms timestamp). A FastAPI backend ingests packets, maintains rolling buffers, computes resultant acceleration magnitude, removes baseline drift, applies a Butterworth bandpass stage, extracts dominant frequency with FFT and validation gates, smooths frequency, and converts frequency to tension using T = 4L^2*mu*f^2 with calibration support. Fatigue damage is computed using rainflow counting and Miner’s rule, then stored with device/history data in MongoDB while live metrics are pushed to Firebase. REST endpoints handle login and device CRUD/activation, and WebSocket streams expose sensor, frequency, and tension/fatigue data for web and Flutter monitoring views.",

    "role": "Built the end-to-end implementation: ESP32 MQTT sensing workflow, FastAPI ingestion and signal-processing pipeline, fatigue/tension computation modules, MongoDB/Firebase integrations, REST/WebSocket APIs, and Flutter pages for login, device management, dashboard, and monitor views.",

    "technologies": [

        "ESP32",

        "MPU6050",

        "Arduino",

        "Python",

        "FastAPI",

        "MQTT",

        "MongoDB",

        "Firebase Realtime Database",

        "Flutter",

        "NumPy",

        "SciPy",

        "Docker"

    ],

    "challenges": [

        "Estimating sampling rate from MQTT arrival timing was unreliable; backend behavior was updated to prefer device t_ms timestamps.",

        "Vibration noise and drift affected frequency stability; preprocessing and validation were required before tension conversion.",

        "Tension readings under fixed load were not sample-by-sample constant because the system is vibration-based, not a direct force sensor.",

        "Live monitoring depended on strict device_id matching and active-device selection across firmware and backend records."

    ],

    "optimizations": [

        "Used ESP32 t_ms timestamps for better timing consistency in backend processing.",

        "Applied resultant-magnitude calculation, baseline removal, Butterworth bandpass filtering, FFT peak gating, and median smoothing for stable frequency tracking.",

        "Added calibration workflow with TENSION_CALIBRATION_FACTOR and a calibration utility script using multiple trials.",

        "Kept OLED refresh slower than the sensor loop to reduce firmware timing jitter."

    ],

    "outcomes": [

        "Implemented a working pipeline from cable vibration sensing to live analytics dashboards.",

        "Delivered real-time outputs for frequency, tension, fatigue damage, and remaining life via WebSocket/Firebase.",

        "Implemented backend device lifecycle APIs (create, update, delete, activate, history) and Flutter monitoring workflow.",

        "Documented nominal runtime behavior including 200 Hz sampling and 0.05 s stream update loops."

    ],

    "demo_story": "CableGuard starts at the cable: an ESP32 reads MPU6050 acceleration and publishes samples over MQTT. The backend processes each stream in near real time, extracts dominant vibration frequency, converts it into estimated tension, and updates fatigue damage trends. On the app side, I can log in, register or select a device, set it active, load its history, and watch live tension, frequency, damage, and remaining-life values update continuously.",

    "keywords": [

        "IoT",

        "ESP32",

        "MPU6050",

        "FastAPI",

        "MQTT",

        "FFT",

        "Butterworth Filter",

        "Rainflow Counting",

        "Miner Rule",

        "Cable Tension Estimation",

        "Flutter",

        "MongoDB",

        "Firebase Realtime Database",

        "WebSocket"

    ],

    "pipeline": "MPU6050 samples acceleration on ESP32 -> ESP32 publishes MQTT JSON (device_id, t_ms, ax, ay, az) -> FastAPI ingests and buffers data -> magnitude + baseline removal + bandpass filtering -> FFT dominant-frequency detection + smoothing -> tension calculation and fatigue update -> MongoDB history + Firebase live metrics -> REST/WebSocket delivery to Flutter and web dashboards.",

    "latency": "~50 ms (as stated in project README)",

    "faqs": [

        {

            "question": "How is cable tension computed in this project?",

            "answer": "The backend extracts dominant vibration frequency from filtered accelerometer data and applies T = 4L^2*mu*f^2, with optional calibration factor support."

        },

        {

            "question": "Why can tension fluctuate even with a fixed load?",

            "answer": "The system infers tension from vibration behavior, so readings depend on frequency stability after excitation rather than acting like a direct load-cell measurement."

        },

        {

            "question": "What data path powers live monitoring?",

            "answer": "ESP32 publishes MQTT data, FastAPI processes it, MongoDB stores history, Firebase/WebSocket streams provide live values to Flutter and web clients."

        },

        {

            "question": "How does the app switch monitored devices?",

            "answer": "The app calls POST /setActiveDevice/{deviceID}, which updates the backend active device and online/offline status tracking."

        },

        {

            "question": "What should be calibrated for better estimates?",

            "answer": "Device cable_length and mu must be correct, sensor mounting should be rigid, and TENSION_CALIBRATION_FACTOR should be derived from known-load frequency trials."

        }

    ]





};
