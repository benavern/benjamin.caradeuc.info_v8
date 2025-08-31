export interface Experience {
  startDate: string;
  endDate?: string;
  title: string;
  company: string;
  description: string;
  location: string;
}

export interface Section {
  title: string;
  items: Experience[];
}

export const parcours: Section[] = [
  {
    title: "Expériences",
    items: [
      {
        startDate: "2022-01",
        title: "Développeur Fullstack",
        company: "Entreprise B",
        description: "Création d'une application Node + SolidJS.",
        location: "Lyon",
      },
      {
        startDate: "2021-06",
        endDate: "2022-01",
        title: "Développeur Frontend",
        company: "Entreprise A",
        description: "Travail sur un projet web en Vue/Nuxt.",
        location: "Paris",
      },
    ],
  },
  {
    title: "Formations",
    items: [
      {
        startDate: "2005-09",
        endDate: "2009-06",
        title: "Licence Informatique",
        company: "Université XYZ",
        description: "Spécialisation en développement web.",
        location: "Paris",
      },
    ],
  },
];