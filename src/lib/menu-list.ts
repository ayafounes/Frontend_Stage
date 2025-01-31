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
          label: "Patients",
          active: pathname.includes("/posts"),
          icon:  UserPlus,
          submenus: [
            {
              href: "/posts",
              label: "Patients List",
              active: pathname.includes("/posts"), // Use includes for flexibility
              icon: CalendarPlus
            },
            {
              href: "/posts/new",
              label: "Add patient",
              active: pathname.includes("/posts/new"), // Use includes for flexibility
              icon: UserPlus
            }
          ]
        },
        {
          href: "", // Update to a valid route if needed
          label: "Appointments",
          active: pathname.includes("/Appointmentt"),
          icon:  CalendarPlus,
          submenus: [
            {
              href: "/Appointmentt",
              label: "Appointments List",
              active: pathname.includes("/Appointmentt"), // Use includes for flexibility
              icon: CalendarPlus
            },
            {
              href: "/Appointmentt/new",
              label: "Add Appointments",
              active: pathname.includes("/Appointmentt/new"), // Use includes for flexibility
              icon: UserPlus
            }
          ]
        },
        {
          href: "", // Update to a valid route if needed
          label: "Consultations",
          active: pathname.includes("/consultation"),
          icon: Stethoscope,
          submenus: [
            {
              href: "/consultation",
              label: "Consultations List",
              active: pathname.includes("/consultation"), // Use includes for flexibility
              icon: CalendarPlus
            },
            {
              href: "/consultation/new",
              label: "Add Consultations",
              active: pathname.includes("/consultation/new"), // Use includes for flexibility
              icon: UserPlus
            }
          ]
        },
        {
          href: "", // Update to a valid route if needed
          label: "Prescreptions",
          active: pathname.includes("/prescreption"),
          icon: Pill,
          submenus: [
            {
              href: "/prescreption",
              label: "Prescreptions List",
              active: pathname.includes("/prescreption"), // Use includes for flexibility
              icon: CalendarPlus
            },
            {
              href: "/prescreption/new",
              label: "Add Prescreptions",
              active: pathname.includes("/prescreption/new"), // Use includes for flexibility
              icon: UserPlus
            }
          ]
        },
        
        
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