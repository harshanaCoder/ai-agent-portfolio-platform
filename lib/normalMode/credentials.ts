import type { CredentialData } from "../mainData";

const ibmLogo = "/issuerLogos/IBM_logo.svg";
const ibmColor = "#0F62FE";
const nvidiaLogo = "/issuerLogos/NVIDIA_logo.svg";
const nvidiaColor = "#76B900";
const metaLogo = "/issuerLogos/Meta_logo.svg";
const metaColor = "#1877F2";
const googleCloudLogo = "/issuerLogos/Google_Cloud_logo.svg";
const googleCloudColor = "#1A73E8";
const universityOfLondonLogo = "/issuerLogos/University_of_London_logo.svg";
const universityOfLondonColor = "#c90852ff";


export const credentials: CredentialData[] = [

  {
    slug: "version-control",
    title: "Version Control",
    issuer: "Meta",
    issuerColor: metaColor,
    issuerLogo: metaLogo,
    issueDate: "January 30, 2026",
    credentialUrl: "https://coursera.org/share/d1e7b9aafd379fa9e6aa456b2e95e449",
    certificateImage: "/credentialImages/version-control.png",
    category: "Certificate",
    skills: ["Git (Version Control System)", "Software Versioning", "GitHub", "Version Control", "File Management"]
  },
  {
    slug: "introduction-to-networking",
    title: "Introduction to Networking",
    issuer: "NVIDIA",
    issuerColor: nvidiaColor,
    issuerLogo: nvidiaLogo,
    issueDate: "January 4, 2026",
    credentialUrl: "https://coursera.org/share/8324a7aea7eea8adc74a5f4c0904e2f4",
    certificateImage: "/credentialImages/introduction-to-networking.png",
    category: "Certificate",
    skills: ["Computer Networking", "Network Switches", "TCP/IP", "Network Infrastructure", "Network Protocols"]
  },
  {
    slug: "what-is-data-science",
    title: "What is Data Science?",
    issuer: "IBM",
    issuerColor: ibmColor,
    issuerLogo: ibmLogo,
    issueDate: "January 4, 2026",
    credentialUrl: "https://coursera.org/share/e4132e1ff6d75d9f9bf2fabb9715fd6e",
    certificateImage: "/credentialImages/what-is-data-science.png",
    category: "Certificate",
    skills: ["Cloud Computing", "Data Analysis", "Data Mining", "Data-Driven Decision-Making", "Data Science"]
  },
  {
    slug: "introduction-to-containers-w-docker-kubernetes-openshift",
    title: "Introduction to Containers w/ Docker, Kubernetes & OpenShift",
    issuer: "IBM",
    issuerColor: ibmColor,
    issuerLogo: ibmLogo,
    issueDate: "November 14, 2025",
    credentialUrl: "https://coursera.org/share/464ef7517e1bc1ea786442f7459dd447",
    certificateImage: "/credentialImages/introduction_to_container.png",
    category: "Certificate",
    skills: ["Cloud-Native Computing", "Microservices", "Containerization", "Docker (Software)"]
  },
  {
    slug: "getting-started-with-flutter-development",
    title: "Getting started with Flutter Development",
    issuer: "Google Cloud",
    issuerColor: googleCloudColor,
    issuerLogo: googleCloudLogo,
    issueDate: "October 26, 2025",
    credentialUrl: "https://coursera.org/share/2611d05ef42aba902b27cbb984ae7646",
    certificateImage: "/credentialImages/getting-started-with-flutter-development.png",
    category: "Project Certificate",
    skills: ["Flutter (Software)", "Google Cloud Platform", "Cross Platform Development", "Mobile Development"]
  },
  {
    slug: "understanding-research-methods",
    title: "Understanding Research Methods",
    issuer: "University of London",
    issuerColor: universityOfLondonColor,
    issuerLogo: universityOfLondonLogo,
    issueDate: "October 21, 2025",
    credentialUrl: "https://coursera.org/share/24d759f492d457c4acbbc220d82c412e",
    certificateImage: "/credentialImages/understanding_research_methods.png",
    category: "Certificate",
    skills: ["Data Collection", "Qualitative Research", "Research Design", "Research Methodologies"]
  },
  {
    slug: "generative-ai-prompt-engineering-basics",
    title: "Generative AI: Prompt Engineering Basics",
    issuer: "IBM",
    issuerColor: ibmColor,
    issuerLogo: ibmLogo,
    issueDate: "October 14, 2025",
    credentialUrl: "https://coursera.org/share/5a085de9e50140477b31738c5657318c",
    certificateImage: "/credentialImages/generative_ai_prompt_engineering.png",
    category: "Certificate",
    skills: ["Prompt Engineering", "Prompt Patterns", "Decision-Making"]
  },
];
