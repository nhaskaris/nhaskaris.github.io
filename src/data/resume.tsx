import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Kubernetes } from "@/components/ui/svgs/kubernetes";
import { Java } from "@/components/ui/svgs/java";
import { Csharp } from "@/components/ui/svgs/csharp";

export const DATA = {
  name: "Nick Haskaris",
  initials: "NH",
  url: "https://nhaskaris.github.io",
  location: "Athens, Greece",
  locationLink: "https://www.google.com/maps/place/Athens,+Greece",
  description:
    "PhD candidate in Informatics & Telematics at Harokopio University of Athens. I build cloud, backend and web systems.",
  summary:
    "I'm a web engineer and researcher based in Athens, Greece. I completed my BSc in Computer Science and my MSc in Cloud/Edge Systems and Applications at Harokopio University of Athens, and I'm now a PhD candidate there, researching network-oriented information systems and advanced e-services such as cloud/edge computing, e-government and telematics. Alongside my research, I spent over two years as a full stack developer building and maintaining the university's institutional portals. Check out [my projects](/#projects) or find me on [GitHub](https://github.com/nhaskaris).",
  avatarUrl: "",
  skills: [
    { name: "TypeScript", icon: Typescript },
    { name: "React", icon: ReactLight },
    { name: "Next.js", icon: NextjsIconDark },
    { name: "Node.js", icon: Nodejs },
    { name: "Python", icon: Python },
    { name: "Java", icon: Java },
    { name: "C#", icon: Csharp },
    { name: "PostgreSQL", icon: Postgresql },
    { name: "Docker", icon: Docker },
    { name: "Kubernetes", icon: Kubernetes },
  ],
  navbar: [{ href: "/", icon: HomeIcon, label: "Home" }],
  contact: {
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/nhaskaris",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/nhaskaris",
        icon: Icons.linkedin,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Harokopio University of Athens",
      href: "https://www.hua.gr",
      badges: [],
      location: "Athens, Greece",
      title: "Academic Researcher",
      logoUrl: "",
      start: "May 2026",
      end: "Present",
      description:
        "Research at the Department of Informatics and Telematics on network-oriented information systems and advanced e-services, including cloud/edge computing, e-government and telematics.",
    },
    {
      company: "Harokopio University of Athens",
      href: "https://www.hua.gr",
      badges: [],
      location: "Athens, Greece",
      title: "Full Stack Developer",
      logoUrl: "",
      start: "December 2023",
      end: "May 2026",
      description:
        "Built, modernized and maintained institutional portals and application systems for the university. Contributed to the core design and backend of the main HUA web portal, worked on the systems of the Special Account of Research Funds (ELKE), built web infrastructure for the Quality Assurance Unit (MODIP), and helped build the Erasmus+ portal.",
    },
    {
      company: "Harokopio University of Athens",
      href: "https://www.hua.gr",
      badges: [],
      location: "Athens, Greece",
      title: "Technical Support Engineer",
      logoUrl: "",
      start: "October 2023",
      end: "December 2023",
      description:
        "Infrastructure, hardware and network support at the university.",
    },
  ],
  education: [
    {
      school: "Harokopio University of Athens",
      href: "https://www.hua.gr",
      degree: "PhD, Informatics & Telematics",
      logoUrl: "",
      start: "2026",
      end: "Present",
    },
    {
      school: "Harokopio University of Athens",
      href: "https://www.hua.gr",
      degree: "MSc, Cloud/Edge Systems and Applications",
      logoUrl: "",
      start: "2024",
      end: "2026",
    },
    {
      school: "Harokopio University of Athens",
      href: "https://www.hua.gr",
      degree: "BSc, Computer Science",
      logoUrl: "",
      start: "2020",
      end: "2024",
    },
  ],
  projects: [
    {
      title: "Cloud PriceOps",
      href: "https://github.com/nhaskaris/cloud-priceops-thesis",
      dates: "Oct 2025 - Feb 2026",
      active: true,
      description:
        "Thesis project: a full-stack cloud pricing analytics platform with multi-provider data normalization, an ML model registry and price prediction APIs.",
      technologies: ["Python", "React", "Vite", "Nginx", "Docker"],
      links: [
        {
          type: "Source",
          href: "https://github.com/nhaskaris/cloud-priceops-thesis",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "PityLoot",
      href: "https://github.com/nhaskaris/PityLoot",
      dates: "Sep 2026",
      active: true,
      description:
        "A server mod for SPT 4.x, rewritten in C# from an earlier 3.x mod. The longer you go without a needed item, the more likely it is to drop, while loot stays random.",
      technologies: ["C#", "Game mod"],
      links: [
        {
          type: "Source",
          href: "https://github.com/nhaskaris/PityLoot",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Dockerized osTicket",
      href: "https://github.com/nhaskaris/dockerized-osticket",
      dates: "Jan 2026",
      active: true,
      description:
        "Run the osTicket support-ticket system in containers with Docker Compose, plus an update script for traditional LAMP/LEMP installs.",
      technologies: ["PHP", "Docker", "MariaDB", "Apache"],
      links: [
        {
          type: "Source",
          href: "https://github.com/nhaskaris/dockerized-osticket",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Divorce App DevOps",
      href: "https://github.com/nhaskaris/divorce_app_dev_ops",
      dates: "Jan 2023 - Jul 2023",
      active: true,
      description:
        "Deployment setups for a Java application using Docker, Ansible and Vagrant.",
      technologies: ["Java", "Docker", "Ansible", "Vagrant"],
      links: [
        {
          type: "Source",
          href: "https://github.com/nhaskaris/divorce_app_dev_ops",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "IoT Environmental Monitoring",
      href: "https://github.com/nhaskaris/IoT-Based-Environmental-Monitoring-itp24107-itp24109",
      dates: "Nov 2024 - Jan 2025",
      active: true,
      description:
        "University coursework on IoT-based environmental monitoring.",
      technologies: ["JavaScript", "IoT"],
      links: [
        {
          type: "Source",
          href: "https://github.com/nhaskaris/IoT-Based-Environmental-Monitoring-itp24107-itp24109",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
  ],
} as const;
