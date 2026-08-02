import { HomePage } from "./HomeSections";
import { HomeReveal } from "./HomeReveal";

export function HomePageFidelity() {
  return (
    <div className="home-page">
      <HomeReveal />
      <HomePage />
    </div>
  );
}
