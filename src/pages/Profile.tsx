import { useAuth } from "../hooks/useAuth";
const Profile = () => {
  const { user } = useAuth();
  return (
    <div className="container mx-auto px-6 py-4">
      <h1 className="text-3xl font-bold mb-4">Profile</h1>
      {user ? (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p><strong>ID:</strong> {user.id}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Created At:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      ) : (
        <p className="text-gray-500">No user data available.</p>
      )}
    </div>
  )
  
};

export default Profile;