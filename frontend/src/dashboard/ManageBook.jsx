import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import MySnackbar from '../components/MySnackbar';

const ManageBook = () => {
  const [allBooks, setAllBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteErrorAlert, setShowDeleteErrorAlert] = useState(false);

  const fetchBooks = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user-books`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to fetch books:', errorData.message);
        return;
      }
      const data = await response.json();
      setAllBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDeleteAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setShowDeleteAlert(false);
  };

  const handleDeleteErrorAlertClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setShowDeleteErrorAlert(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/book/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to delete book:', errorData.message);
        setShowDeleteErrorAlert(true);
        return;
      }
      const data = await response.json();
      if (data.deletedCount === 1) {
        setShowDeleteAlert(true);
        fetchBooks();
      } else {
        console.error('Failed to delete book:', data.message);
        setShowDeleteErrorAlert(true);
      }
    } catch (error) {
      console.error('Error deleting book:', error);
      setShowDeleteErrorAlert(true);
    }
  };

  const filteredBooks = allBooks.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="w-full p-4">
      <div className="mb-2 flex justify-between">
        <h2 className="ligature mb-2 text-3xl font-bold text-white">Manage Books</h2>
        <input
          className="max-w-xl rounded-md border-2 border-Indigo bg-Darkness tracking-wide text-White transition duration-500 ease-in-out focus:border-Blue focus:ring-0"
          placeholder="Search books..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        {filteredBooks.length > 0 ? (
          <table className="w-full table-fixed text-sm text-gray-400">
            <thead className="bg-softWhiteTransparent ligature items-center border-b-2 border-Indigo text-White">
              <tr className="h-12 justify-between text-center">
                <th scope="col">Book ID</th>
                <th scope="col">Book Title</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBooks.map((book) => (
                <tr
                  key={book._id}
                  className="h-20 justify-between break-words border-b-2 border-Indigo text-center text-White"
                >
                  <td>{book._id}</td>
                  <td>{book.title}</td>
                  <td className="space-x-4">
                    <Link
                      className="rounded-md bg-blue-600 px-2 py-2 text-white hover:bg-blue-700"
                      to={`/admin/dashboard/edit-books/${book._id}`}
                    >
                      Edit
                    </Link>
                    <button
                      className="rounded-md bg-red-600 px-2 py-2 text-white hover:bg-red-700"
                      onClick={() => handleDelete(book._id)}
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
            <h3 className="text-lg font-medium">No books found</h3>
            <p>Try adjusting your search query.</p>
          </div>
        )}
      </div>
      <MySnackbar
        message="Book deleted successfully!"
        open={showDeleteAlert}
        type="success"
        onClose={handleDeleteAlertClose}
      />
      <MySnackbar
        message="Failed to delete book. Please try again."
        open={showDeleteErrorAlert}
        type="error"
        onClose={handleDeleteErrorAlertClose}
      />
    </div>
  );
};

export default ManageBook;
