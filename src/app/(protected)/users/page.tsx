"use client";
// src/app/users/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ContentLayout } from "@/components/admin-panel/content-layout";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import UserInfo from "@/components/UserInfo"; // Import the UserInfo component

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching fake users data (Doctor and Secretary)
    const fakeUsers = [
      {
        firstName: "John",
        lastName: "Doe",
        profilePhoto: "https://img.freepik.com/premium-vector/doctor-profile-with-medical-service-icon_617655-48.jpg",
        role: "Doctor",
        username: "johndoe",
        email: "johndoe@example.com",
        birthDate: "1990-01-01",
        gender: "Male",
        phone: "123-456-7890",
        address: "123 Fake Street",
        city: "Fake City",
        country: "Fakeland",
        postalCode: "12345",
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        profilePhoto: "https://img.freepik.com/premium-vector/female-portrait-medical-doctor-profile-flat-design-vector_617655-23.jpg",
        role: "Secretary",
        username: "janesmith",
        email: "janesmith@example.com",
        birthDate: "1992-02-02",
        gender: "Female",
        phone: "987-654-3210",
        address: "456 Real Street",
        city: "Real City",
        country: "Realand",
        postalCode: "54321",
      }
    ];
    setUsers(fakeUsers);
  }, []);

  return (
    <ContentLayout title="Users">
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
            <BreadcrumbPage>Users</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Pass the users array to the UserInfo component */}
      <UserInfo users={users} />
    </ContentLayout>
  );
}
