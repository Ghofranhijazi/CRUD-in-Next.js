'use client';

import { useEffect, useState } from 'react';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState({ id: '', name: '', email: '' });

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setIsEditing(true);
    setEditUser({ id: user._id, name: user.name, email: user.email });
  };

  const handleUpdateUser = async () => {
    const res = await fetch('/api/users', {
      method: 'PUT',
      body: JSON.stringify(editUser),
      headers: { 'Content-Type': 'application/json' },
    });
    const updatedUser = await res.json();
    setUsers(users.map((user) => (user._id === updatedUser._id ? updatedUser : user)));
    setIsEditing(false); 
  };

  const handleDeleteUser = async (id) => {
    const res = await fetch('/api/users', {
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setUsers(users.filter((user) => user._id !== data._id));
  };

  const handleAddUser = async () => {
    const user = { name: 'New User', email: 'newuser@example.com' };
    const res = await fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    setUsers([...users, data]);
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Users</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-center text-sm font-medium text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t border-gray-200">
                <td className="px-4 py-2 text-sm text-gray-900">{user.name}</td>
                <td className="px-4 py-2 text-sm text-gray-900">{user.email}</td>
                <td className="px-4 py-2 text-center">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mr-2"
                    onClick={() => handleEditUser(user)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        className="mt-6 bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
        onClick={handleAddUser}
      >
        Add New User
      </button>

      {/* نموذج التحديث */}
      {isEditing && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <input
              type="text"
              value={editUser.name}
              onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              placeholder="Name"
            />
            <input
              type="email"
              value={editUser.email}
              onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
              className="w-full p-2 mb-4 border border-gray-300 rounded-md"
              placeholder="Email"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleUpdateUser}
            >
              Update User
            </button>
            <button
              className="ml-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
