import type { PortfolioProject } from "../voiceAssistantData";

import { elevateSafeProject } from "./projectData/elevateSafe";
import { dolphinGymManagementProject } from "./projectData/dolphinGymManagement";
import { smartIotChristmasLedStarProject } from "./projectData/smart-iot-christmas-led-star";
import { cableguardIotMonitoringSystemProject } from "./projectData/cableguard-iot-monitoring-system";
import { aiAgentPortfolioPlatformProject } from "./projectData/ai-agent-portfolio-platform";

export const portfolioProjects: PortfolioProject[] = [
  elevateSafeProject,
  dolphinGymManagementProject,
  smartIotChristmasLedStarProject,
  cableguardIotMonitoringSystemProject,
  aiAgentPortfolioPlatformProject
];
