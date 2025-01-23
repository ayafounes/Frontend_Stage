import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  CalendarPlus,
  UserPlus,
  Stethoscope,
  Pill,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active: boolean;
  icon?: LucideIcon; // Optional icon for submenus
};

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
  submenus: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "", // Optional: Add a label like "General" if needed
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          active: pathname.includes("/dashboard"),
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "", // Update to a valid route if needed
          label: "Forms",
          active: pathname.includes("/posts"),
          icon: SquarePen,
          submenus: [
            {
              href: "/posts",
              label: "New Appointment",
              active: pathname.includes("/posts"), // Use includes for flexibility
              icon: CalendarPlus
            },
            {
              href: "/posts/new",
              label: "New Patient",
              active: pathname.includes("/posts/new"), // Use includes for flexibility
              icon: UserPlus
            }
          ]
        },
        {
          href: "/categories",
          label: "Consultation",
          active: pathname.includes("/categories"),
          icon: Stethoscope,
          submenus: []
        },
        {
          href: "/tags",
          label: "Prescription",
          active: pathname.includes("/tags"),
          icon: Pill,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/users",
          label: "Users",
          active: pathname.includes("/users"),
          icon: Users,
          submenus: []
        },
        {
          href: "/account",
          label: "Account",
          active: pathname.includes("/account"),
          icon: Settings,
          submenus: []
        }
      ]
    }
  ];
}