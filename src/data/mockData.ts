import type { Experience, Volunteering, TravelLocation, HomeData, Project } from '../types';
import experiencesData from './experiences.json';
import volunteeringData from './volunteering.json';
import travelData from './travel.json';
import homeData from './home.json';
import projectsData from './projects.json';

// Helper to load data from localStorage or fallback to static JSON
const loadLocalData = <T>(key: string, fallback: T): T => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        return JSON.parse(saved) as T;
      } catch (e) {
        console.error(`Error parsing localStorage key "${key}"`, e);
      }
    }
  }
  return fallback;
};

export const experiences: Experience[] = loadLocalData('portfolio_experiences', experiencesData as Experience[]);
export const volunteerRoles: Volunteering[] = loadLocalData('portfolio_volunteering', volunteeringData as Volunteering[]);
const rawTravelLocations = loadLocalData('portfolio_travel', travelData as TravelLocation[]);
export const travelLocations: TravelLocation[] = rawTravelLocations.map(loc => {
  const match = String(loc.dates).match(/\b\d{4}\b/);
  return {
    ...loc,
    dates: match ? match[0] : loc.dates
  };
});
export const home: HomeData = loadLocalData('portfolio_home', homeData as HomeData);
export const projects: Project[] = loadLocalData('portfolio_projects', projectsData as Project[]);
