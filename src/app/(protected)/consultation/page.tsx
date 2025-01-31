import Link from 'next/link';
import AppointmentForm from '@/components/AppointmentForm';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import PatientsTable from '@/components/PatientsTable';
import PrescriptionSheet from '@/components/PrescreptionSheet';
import ConsultationSheet from '@/components/ConsultationSheet';
import ConsultationsTable from '@/components/ConsultationTable';

export default function AppointmenttPage() {
  return (
    <ContentLayout title="Appointment Form">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/appointment">Consultations List</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <ConsultationsTable />
    </ContentLayout>
  );
}
