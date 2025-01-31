// app/page.tsx
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import DashboardMetrics from "@/components/DashboardMetrics";
import PatientsTable from "@/components/PatientsTable";
import { ListIcon, GridIcon, UsersIcon, ActivityIcon } from 'lucide-react';

export default function DashboardPage() {
  return (
    <ContentLayout title="Dashboard">
      <div className="px-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/" className="text-gray-500 hover:text-gray-700">Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Dashboard</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <DashboardMetrics />
      <div className="px-4">
        
      </div>
    </ContentLayout>
  );
}