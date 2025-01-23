interface User {
  firstName: string;
  lastName: string;
  profilePhoto: string;
  role: string;
}

export default function UserProfile({ user }: { user: User }) {
  return (
    <div className="flex items-center justify-between p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 bg-white dark:bg-gray-800 dark:border-gray-700">
      {/* Left Section: Profile Picture and User Info */}
      <div className="flex items-center space-x-4">
        {/* Profile Picture */}
        <div className="relative">
          <img
            src={user.profilePhoto}
            alt={`${user.firstName} ${user.lastName}'s Profile`}
            className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-md"
          />
          {/* Optional: Add a status indicator (e.g., online/offline) */}
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></span>
        </div>

        {/* Name and Role */}
        <div>
          <p className="text-xl font-bold text-gray-800 dark:text-gray-100">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{user.role}</p>
        </div>
      </div>

      {/* Right Section: View Profile Button */}
      <button className="px-4 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 transition-colors duration-300 dark:bg-orange-600 dark:hover:bg-orange-700">
        View Profile
      </button>
    </div>
  );
}