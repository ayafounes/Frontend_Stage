import { Card, CardContent } from "@/components/ui/card";

// Define the User interface directly in this file
export interface User {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  birthDate: string;
  gender: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  role: string;
  hireDate?: string;
  employmentStatus?: string;
  profilePhoto?: string;
}

export default function UserInfo({ users }: { users: User[] }) {
  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-2xl font-bold text-center dark:text-gray-100">User Information</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {users.map((user, index) => (
          <Card
            key={index}
            className="relative rounded-lg border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white-50 to-purple-50 dark:from-gray-800 dark:to-gray-900"
          >
            <CardContent className="p-6">
              <div className="space-y-6">
                {/* Profile Photo */}
                {user.profilePhoto && (
                  <div className="flex justify-center mb-4">
                    <img
                      src={user.profilePhoto}
                      alt={`${user.firstName} ${user.lastName}'s Profile`}
                      className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
                    />
                  </div>
                )}

                {/* User Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 dark:text-gray-400">👤</span>
                    <p>
                      <strong>Name:</strong> {user.firstName} {user.lastName}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 dark:text-gray-400">📛</span>
                    <p>
                      <strong>Username:</strong> {user.username}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 dark:text-gray-400">📧</span>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 dark:text-gray-400">🎂</span>
                    <p>
                      <strong>Birth Date:</strong> {user.birthDate}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 dark:text-gray-400">🚻</span>
                    <p>
                      <strong>Gender:</strong> {user.gender}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 dark:text-gray-400">📞</span>
                    <p>
                      <strong>Phone:</strong> {user.phone}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 dark:text-gray-400">🏠</span>
                    <p>
                      <strong>Address:</strong> {user.address}, {user.city}, {user.country} - {user.postalCode}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-500 dark:text-gray-400">👔</span>
                    <p>
                      <strong>Role:</strong> {user.role}
                    </p>
                  </div>

                  {/* Show hireDate and employmentStatus only for the secretary */}
                  {user.role === "Secretary" && (
                    <>
                      {user.hireDate && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 dark:text-gray-400">📅</span>
                          <p>
                            <strong>Hire Date:</strong> {user.hireDate}
                          </p>
                        </div>
                      )}
                      {user.employmentStatus && (
                        <div className="flex items-center space-x-2">
                          <span className="text-gray-500 dark:text-gray-400">💼</span>
                          <p>
                            <strong>Employment Status:</strong> {user.employmentStatus}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}