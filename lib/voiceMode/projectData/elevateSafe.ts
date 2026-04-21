import type { PortfolioProject } from "../../voiceAssistantData";

export const elevateSafeProject: PortfolioProject = {
  name: "ElevateSafe",
  summary:
    "An AI-assisted elevator maintenance reporting and analytics platform with secure PHP workflows and Google Gemini integration.",
  technologies: [
    "PHP",
    "MySQL",
    "Google Gemini API",
    "Bootstrap 5",
    "Chart.js",
    "PhpSpreadsheet",
    "SweetAlert2",
    "JavaScript",
    "HTML5",
    "CSS3"
  ],
  challenges: [
    "Building a secure maintenance portal that technicians trust with accurate incident categorization.",
    "Integrating AI-assisted incident classification without overwhelming operators with false positives.",
    "Ensuring all input validation and sanitization prevent SQL injection and XSS attacks.",
    "Creating meaningful anomaly trending for executive summaries while maintaining operational transparency.",
    "Bridging the gap between raw maintenance reports and actionable intelligence."
  ],
  outcomes: [
    "Delivered a production-ready maintenance intelligence platform for elevator operations.",
    "Implemented secure authentication, session hardening, and login rate limiting.",
    "Successfully integrated Google Gemini for intelligent incident categorization into fixed maintenance taxonomies.",
    "Created admin dashboards showing top faulty units, maintenance trends, and cost analytics.",
    "Enabled Excel export for offline reporting and executive presentations.",
    "Established a foundation that could support future voice-based incident reporting."
  ],
  description_long:
    "ElevateSafe is a production-ready web platform for elevator and escalator maintenance operations built with PHP and MySQL. The system is designed for technicians who need to log breakdown incidents quickly and accurately, and for facility managers who need to understand patterns in equipment failures.\n\nOn the operational side, the platform handles authenticated technician login with rate limiting protection, structured breakdown incident submission, automatic validation of user input and SQL sanitization, and persistent storage of all maintenance records with timestamps.\n\nOn the intelligence side, when a technician submits a maintenance report, the backend forwards the incident description to the Google Gemini API with a specialized system prompt that categorizes the incident into predefined maintenance categories (e.g., electrical, hydraulic, mechanical, safety system). This AI-assisted classification happens transparently and logs the confidence level. The analytics layer then rolls up individual incidents into operational dashboards.\n\nKey features include a maintenance history search by unit ID or date range, admin analytics showing the top faulty units cluster, monthly maintenance cost trending, chart-based visualizations powered by Chart.js, and bulk export to Excel for reporting to corporate or insurance partners.\n\nThe most important architectural layer is security: all user inputs are validated server-side, all database queries use prepared statements to prevent injection attacks, and sessions are hardened with CSRF tokens. There is also fallback classification logic in case the Gemini API is unavailable—the system never breaks, it just downgrades to manual category selection.\n\nWhile the current implementation is text-driven (web form submission), the backend architecture is voice-ready. A future version could accept voice incident reports through a microphone input, transcribe them into text, and then route them through the same validated classification and analytics pipeline.",
  role:
    "Full-stack developer and security architect responsible for backend workflows, relational data modeling, Google Gemini integration, analytics dashboard design, and secure session management.",
  demo_story:
    "Picture this: it's 2am and an elevator breaks down in a high-rise. A technician logs into ElevateSafe from their phone, describes what they found, and submits the report. The backend instantly categorizes the fault using Gemini, logs it to the database, and alerts the maintenance manager. By morning, the analytics show this is the third hydraulic failure in that building this month—time to schedule a preventive inspection. All without the technician fumbling with dropdown menus or trying to remember the exact category codes. That's what ElevateSafe does.",
  keywords: [
    "maintenance portal",
    "elevator operations",
    "AI incident classification",
    "Google Gemini",
    "PHP backend",
    "secure authentication",
    "analytics dashboard",
    "incident trends",
    "operational intelligence",
    "hardware reliability",
    "predictive maintenance roadmap"
  ],
  faqs: [
    {
      question: "How does ElevateSafe use AI to categorize incidents?",
      answer:
        "When a technician submits a breakdown report, the backend sanitizes the text and sends it to the Google Gemini API with a specialized prompt that asks Gemini to classify the incident into maintenance categories like electrical, hydraulic, mechanical, or safety system. Gemini returns a category and confidence level, which the system logs. This happens in the background without slowing down the technician's workflow."
    },
    {
      question: "What if the AI categorization is wrong?",
      answer:
        "The system logs the AI confidence level. An admin can review incidents with low confidence and manually override. There's also a fallback so if Gemini is unavailable, the system prompts the technician to select a category manually. The system never breaks; it just degrades gracefully."
    },
    {
      question: "Why is security such a big deal here?",
      answer:
        "Because maintenance data can reveal operational vulnerabilities. If an attacker can inject SQL or tamper with incident records, they could hide failures or cause safety issues. ElevateSafe uses prepared statements, input validation, CSRF tokens, and session hardening to ensure only authorized technicians can log incidents."
    },
    {
      question: "How do facility managers use the analytics?",
      answer:
        "They can see which units fail most often, what kinds of failures they tend to have, and whether failures are trending up (sign of aging equipment) or down (sign that maintenance is working). They can also export all incidents to Excel for reports to insurance or corporate partners."
    },
    {
      question: "Could ElevateSafe support voice incident reporting in the future?",
      answer:
        "Absolutely. The backend is already built to handle text descriptions and route them through Gemini for classification. If you added speech-to-text transcription on the frontend, the rest of the pipeline would work unchanged. That's a future upgrade path."
    },
    {
      question: "What's the production readiness status?",
      answer:
        "The system is production-ready right now. It has been designed with real-world operational workflows in mind: authentication, audit trails, graceful fallbacks, and security hardening. It's deployed and can start collecting real maintenance data immediately."
    }
  ],
  pipeline:
    "Technician on-site encounters equipment failure -> Logs in to ElevateSafe web interface with secure session -> Submits narrative description of the breakdown and which unit failed -> Backend validates input, sanitizes for XSS/SQL injection, and prepares a Gemini API request -> Google Gemini receives the incident text plus a specialized system prompt asking for maintenance category classification (electrical, hydraulic, mechanical, safety system, other) -> Gemini returns structured category, confidence level, and brief explanation -> Backend logs the incident to MySQL with timestamp, technician ID, unit ID, original description, Gemini category, and confidence score -> Analytics engine aggregates incidents by category, unit, and date for dashboard display -> Facility manager views dashboard showing top failing units, monthly cost trends, and incident distribution -> Manager can export incidents to Excel or drill down into specific unit histories -> Optional fallback: if Gemini is down or slow, system presents manual category selection instead of blocking the workflow.",
  latency:
    "Incident submission latency is sub-second for the web form. Gemini API call adds 500ms to 2 seconds depending on network and Gemini load (this happens asynchronously so it doesn't block the technician's confirmation). Analytics queries run in real-time for small datasets (< 10k incidents). Large historical exports take 2-5 seconds to generate Excel files. Voice transcription (future feature) would add 500ms to 3 seconds depending on STT engine choice.",
  accuracy:
    "Gemini classification accuracy depends on incident description clarity. Well-written reports (e.g., 'Hydraulic fluid leak from left door actuator') yield > 95% category accuracy. Vague reports (e.g., 'It broke') require manual reviewer intervention. Fallback logic ensures no incident is ever lost if AI is unavailable. For future voice input, STT accuracy will depend on audio quality and background noise; typical STT engines achieve 90-98% accuracy in quiet environments.",
  optimizations: [
    "Implement voice-based incident submission using browser microphone + speech-to-text engine.",
    "Add real-time SMS/email alerts for high-priority incidents (safety system failures).",
    "Create predictive analytics that forecast which units are likely to fail based on historical patterns.",
    "Build a mobile app with offline incident capture that syncs when connectivity returns.",
    "Add technician performance dashboards (incident resolution time, categorization accuracy) to incentivize better reporting.",
    "Integrate with IoT sensors to auto-detect failures and trigger pre-populated incident forms.",
    "Implement incident severity scoring so managers can prioritize response.",
    "Create a voice-based API endpoint so remote technicians can phone in reports hands-free."
  ]
};
