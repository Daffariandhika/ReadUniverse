import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';

import MyModal from '../components/MyModal';
import MySnackbar from '../components/MySnackbar';
import app from '../firebase/firebase.config';

const ManageUser = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteErrorAlert, setShowDeleteErrorAlert] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const auth = getAuth(app);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/all-users`);
      const data = await response.json();
      setAllUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setShowDeleteAlert(false);
  };

  const handleDeleteErrorAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setShowDeleteErrorAlert(false);
  };

  const handleDelete = async (id, uid) => {
    try {
      const token = await auth.currentUser.getIdToken();
      const firebaseResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/firebase-user/${uid}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        },
      );
      if (!firebaseResponse.ok) {
        const errorData = await firebaseResponse.json();
        console.error('Failed to delete user from Firebase:', errorData.message);
        setShowDeleteErrorAlert(true);
        return;
      }
      const mongoResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/delete/users/${id}`,
        {
          method: 'DELETE',
        },
      );
      if (!mongoResponse.ok) {
        const errorData = await mongoResponse.json();
        console.error('Failed to delete user from MongoDB:', errorData.message);
        setShowDeleteErrorAlert(true);
        return;
      }
      setShowDeleteAlert(true);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setShowDeleteErrorAlert(true);
    }
  };

  const handleDetailClick = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const filteredUsers = allUsers.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full p-4">
      <div className="mb-2 flex justify-between">
        <h2 className="ligature mb-2 text-3xl font-bold text-white">Manage Users</h2>
        <input
          className="max-w-xl rounded-md border-2 border-Indigo bg-Darkness tracking-wide text-White transition duration-500 ease-in-out focus:border-Blue focus:ring-0"
          placeholder="Search users..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto break-words rounded-lg shadow-lg">
        {filteredUsers.length > 0 ? (
          <table className="w-full table-fixed text-sm text-White">
            <thead className="bg-softWhiteTransparent ligature border-b-2 border-Indigo">
              <tr className="h-12 justify-between text-center">
                <th scope="col">Username</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="bg-softWhiteTransparent h-20 justify-between border-b-2 border-Indigo text-center"
                >
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td
                    className={`font-medium ${user.role === 'admin' ? 'text-amber-500' : 'text-lime-500'}`}
                  >
                    {user.role}
                  </td>
                  <td className="space-x-2">
                    <button
                      className="rounded-md bg-green-600 px-2 py-2 text-white hover:bg-green-700"
                      onClick={() => handleDetailClick(user)}
                    >
                      Details
                    </button>
                    <button
                      className="rounded-md bg-red-600 px-2 py-2 text-white hover:bg-red-700"
                      onClick={() => handleDelete(user._id, user.uid)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="items-center py-6 text-center text-gray-400">
            <h3 className="text-lg font-medium">No users found</h3>
            <p>Try adjusting your search query.</p>
          </div>
        )}
      </div>
      <MyModal
        additionalContent={
          selectedUser && (
            <div className="space-y-4 p-4">
              <hr className="h-[2px] rounded-full border-Indigo bg-Indigo"></hr>
              <div className="flex flex-col items-center space-y-3">
                <img
                  alt={`${selectedUser.username}'s profile`}
                  className="h-28 w-28 rounded-full border-2 border-Blue shadow-xl"
                  src={selectedUser.profileImage}
                />
                <h3 className="bg-gradient-to-t from-Purple to-Sky bg-clip-text font-mono text-2xl font-semibold text-transparent">
                  {selectedUser.username}
                </h3>
                <span className="ligature bg-gradient-to-t from-Purple to-Sky bg-clip-text text-sm text-transparent">
                  {selectedUser.role}
                </span>
              </div>
              <hr className="h-[2px] rounded-full border-Indigo bg-Indigo" />
              <div className="grid-row grid gap-4 text-center font-mono text-sm font-semibold tracking-wider text-White">
                <h3>{selectedUser.email}</h3>
                <h3>{new Date(selectedUser.createdAt).toLocaleString()}</h3>
              </div>
            </div>
          )
        }
        open={isModalOpen}
        size="sm"
        title="User Detail"
        onClose={closeModal}
      />
      <MySnackbar
        message="User deleted successfully!"
        open={showDeleteAlert}
        type="success"
        onClose={handleDeleteAlertClose}
      />
      <MySnackbar
        message="Failed to delete user, please try again"
        open={showDeleteErrorAlert}
        type="error"
        onClose={handleDeleteErrorAlertClose}
      />
    </div>
  );
};

export default ManageUser;
