import type { PortfolioProject } from "../../voiceAssistantData";

export const smartIotChristmasLedStarProject: PortfolioProject = {

    "name": "Smart IoT-Based Christmas LED Star",
    "summary": "An ESP32-powered LED decoration with real-time WiFi control using WLED.",
    "description_long": "This project is a smart IoT lighting system built around an ESP32 microcontroller and WS2812 addressable LEDs. The hardware consists of a custom-designed star structure with an extended LED tail, where each LED can be individually controlled. The ESP32 runs WLED firmware, enabling WiFi-based communication and real-time control through a web interface. Users can select and customize lighting effects, animations, and colors dynamically. The system integrates embedded programming, power management, and network-based control to create an interactive decorative device.",
    "role": "Designed and assembled the hardware using ESP32 and WS2812 LEDs, configured WLED firmware for lighting control, managed power distribution, and integrated the full IoT system.",
    "technologies": ["ESP32", "WS2812 LEDs", "WLED", "WiFi"],
    "challenges": [
        "Ensuring stable power distribution for multiple LEDs",
        "Integrating WLED firmware with custom hardware design",
        "Maintaining reliable WiFi-based control for real-time interaction"
    ],
    "optimizations": [
        "Configured WLED settings for efficient LED control",
        "Structured hardware layout for consistent LED performance",
        "Optimized power management to prevent instability"
    ],
    "outcomes": [
        "Successfully built a functional IoT-based LED decoration system",
        "Achieved real-time lighting control through WiFi interface",
        "Demonstrated integration of embedded systems with software control"
    ],
    "demo_story": "This is a smart LED decoration I built using an ESP32 and addressable LEDs. The star and tail structure are fully programmable, and I used WLED firmware to control everything over WiFi. You can change colors, effects, and animations in real time from a web interface. It’s a combination of embedded systems, IoT, and hardware design working together.",
    "keywords": [
        "ESP32",
        "WS2812",
        "WLED",
        "IoT",
        "Embedded Systems",
        "LED Control",
        "WiFi Control",
        "Real-time Systems",
        "Microcontroller",
        "Smart Lighting"
    ],
    "pipeline": "User interacts with WLED web interface → ESP32 receives commands over WiFi → WLED processes lighting instructions → Signals sent to WS2812 LEDs → LEDs display configured effects",
    "faqs": [
        {
            "question": "How are the LEDs controlled in this system?",
            "answer": "The LEDs are controlled using WLED firmware running on the ESP32, which sends signals to WS2812 addressable LEDs."
        },
        {
            "question": "Can the lighting effects be changed in real time?",
            "answer": "Yes, lighting effects and animations can be changed in real time through a WiFi-based web interface."
        },
        {
            "question": "What is the role of ESP32 in this project?",
            "answer": "The ESP32 acts as the main controller, handling WiFi communication and controlling the LED data signals."
        },
        {
            "question": "What type of LEDs are used?",
            "answer": "WS2812 individually addressable RGB LEDs are used in this project."
        }
    ]


};
