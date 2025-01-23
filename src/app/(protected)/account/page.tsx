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
import UserProfile from "@/components/UserProfile"; // Import the UserProfile component

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    // Simulate fetching fake users data (Doctor and Secretary)
    const fakeUsers = [
      {
        firstName: "John",
        lastName: "Doe",
        profilePhoto: "https://img.freepik.com/premium-vector/doctor-profile-with-medical-service-icon_617655-48.jpg",
        role: "Doctor"
      },
      {
        firstName: "Jane",
        lastName: "Smith",
        profilePhoto: "https://img.freepik.com/premium-vector/female-portrait-medical-doctor-profile-flat-design-vector_617655-23.jpg",
        role: "Secretary"
      }
    ];
    setUsers(fakeUsers);
  }, []);

  return (
    <ContentLayout title="Account">
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
            <BreadcrumbPage>Account</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        {/* Render each user using the UserProfile component */}
        {users.map((user, index) => (
          <UserProfile key={index} user={user} />
        ))}
      </div>
    </ContentLayout>
  );
}
