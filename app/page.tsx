import { PortfolioShell } from "@/components/portfolio-shell";
import { navigationItems, projects } from "@/lib/mainData";

export default function HomePage() {
  return (
    <PortfolioShell
      navigationItems={navigationItems}
      projects={projects}
    />
  );
}
