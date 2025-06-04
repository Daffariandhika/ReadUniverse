import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';

import MyModal from '../components/MyModal';
import MySnackbar from '../components/MySnackbar';

const ManageOrder = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showApproveAlert, setShowApproveAlert] = useState(false);
  const [showApproveErrorAlert, setShowApproveErrorAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showDeleteErrorAlert, setShowDeleteErrorAlert] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [bookDetails, setBookDetails] = useState({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/all-orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const fetchBookDetails = async (bookId) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/book/${bookId}`);
      const data = await response.json();
      setBookDetails((prevDetails) => ({
        ...prevDetails,
        [bookId]: data,
      }));
    } catch (error) {
      console.error('Failed to fetch book details:', error);
    }
  };

  const approveOrder = async (orderId) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No authenticated user found.');
        setShowApproveErrorAlert(true);
        return;
      }
      const token = await currentUser.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/approve-order/${orderId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId ? { ...order, status: 'approved' } : order,
          ),
        );
        setShowApproveAlert(true);
      } else {
        console.error('Failed to approve order');
        setShowApproveErrorAlert(true);
      }
    } catch (error) {
      console.error('Error approving order:', error);
      setShowApproveErrorAlert(true);
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (!currentUser) {
        console.error('No authenticated user found.');
        setShowDeleteErrorAlert(true);
        return;
      }
      const token = await currentUser.getIdToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/delete-order/${orderId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (response.ok) {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.orderId !== orderId),
        );
        setShowDeleteAlert(true);
      } else {
        console.error('Failed to delete order');
        setShowDeleteErrorAlert(true);
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      setShowDeleteErrorAlert(true);
    }
  };

  const handleAlertClose = (alertSetter) => (event, reason) => {
    if (reason === 'clickaway') return;
    alertSetter(false);
  };

  const handleDetailClick = (order) => {
    setSelectedOrder(order);
    order.items.forEach((item) => {
      if (!bookDetails[item.bookId]) {
        fetchBookDetails(item.bookId);
      }
    });
  };

  const handleCloseDetail = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="w-full p-4">
      <div className="mb-2 flex justify-between">
        <h2 className="ligature text-3xl font-bold text-white">Manage Orders</h2>
        <input
          className="max-w-xl rounded-md border-2 border-Indigo bg-Darkness tracking-wide text-White transition duration-500 ease-in-out focus:border-Blue focus:ring-0"
          placeholder="Search by username..."
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <p className="text-center text-Gray">Loading orders</p>
      ) : orders.length === 0 ? (
        <div className="py-6 text-center text-Gray">
          <h3 className="text-lg font-medium">No orders found</h3>
          <p>Try refreshing the page or come back later.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="py-6 text-center text-Gray">
          <h3 className="text-lg font-medium">No matching orders</h3>
          <p>Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full table-fixed text-sm text-White">
            <thead className="bg-softWhiteTransparent border-b-2 border-Indigo text-White">
              <tr className="ligature h-12 justify-between text-center">
                <th scope="col">Order ID</th>
                <th scope="col">Username</th>
                <th scope="col">Order Date</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order.orderId}
                  className="h-20 justify-between border-b-2 border-Indigo text-center"
                >
                  <td>{order.orderId}</td>
                  <td>{order.username}</td>
                  <td>{new Date(order.orderDate).toLocaleDateString('id-ID')}</td>
                  <td
                    className={`font-bold ${order.status === 'approved' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {order.status}
                  </td>
                  <td className="space-x-2">
                    <button
                      className={`rounded-md px-2 py-2 text-white ${order.status === 'approved' ? 'cursor-not-allowed bg-gray-500' : 'bg-green-600 hover:bg-green-700'}`}
                      disabled={order.status === 'approved'}
                      onClick={() => approveOrder(order.orderId)}
                    >
                      Approve
                    </button>
                    <button
                      className="rounded-md bg-blue-600 px-2 py-2 text-white hover:bg-blue-700"
                      onClick={() => handleDetailClick(order)}
                    >
                      Detail
                    </button>
                    <button
                      className="rounded-md bg-red-600 px-2 py-2 text-white hover:bg-red-700"
                      onClick={() => deleteOrder(order.orderId)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <MyModal
        additionalContent={
          selectedOrder && (
            <div className="space-y-4 rounded-lg border-2 border-Indigo p-6">
              <div className="space-y-4 text-center text-white">
                <p className="text-lg font-semibold">{selectedOrder.orderId}</p>
                <hr className="border-Indigo" />
              </div>
              <div className="grid grid-cols-1 gap-6 text-sm text-white md:grid-cols-2">
                <div>
                  <p>
                    <span className="text-Gray">Username :</span>
                    {selectedOrder.username}
                  </p>
                  <p>
                    <span className="text-Gray">Phone :</span>
                    {selectedOrder.address.phone}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="text-Gray">Order Date :</span>
                    {new Date(selectedOrder.orderDate).toLocaleDateString('id-ID')}
                  </p>
                  <p>
                    <span className="text-Gray">Status :</span>
                    {selectedOrder.status}
                  </p>
                </div>
              </div>
              <hr className="border-Indigo" />
              <div>
                <h4 className="text-lg font-semibold text-Gray">Items :</h4>
                <div className="scrollbar-thin scrollbar-thumb scrollbar-track max-h-16 overflow-y-auto rounded-lg border border-Darkness p-1">
                  <ul className="list-inside list-disc space-y-2 pl-2 text-sm text-White">
                    {selectedOrder.items.map((item, index) => {
                      const book = bookDetails[item.bookId];
                      return (
                        <li
                          key={index}
                          className="truncate"
                        >
                          {book ? book.title : 'Loading...'}
                          <strong> : {item.quantity}</strong>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <hr className="border-Indigo" />
              <div className="grid grid-cols-1 gap-6 text-sm text-white md:grid-cols-2">
                <div>
                  <h4 className="text-lg font-semibold text-Gray">Address :</h4>
                  <p>
                    {selectedOrder.address.address}, {selectedOrder.address.city},{' '}
                    {selectedOrder.address.postalCode}
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-Gray">Payment Details :</h4>
                  <p>
                    {selectedOrder.paymentDetails.method}:{' '}
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                    }).format(selectedOrder.paymentDetails.totalPrice)}
                  </p>
                </div>
              </div>
            </div>
          )
        }
        open={Boolean(selectedOrder)}
        size="lg"
        title="Order Detail"
        onClose={handleCloseDetail}
      />
      <MySnackbar
        message="Order approved successfully!"
        open={showApproveAlert}
        type="success"
        onClose={handleAlertClose(setShowApproveAlert)}
      />
      <MySnackbar
        message="Failed to approve order. Please try again."
        open={showApproveErrorAlert}
        type="error"
        onClose={handleAlertClose(setShowApproveErrorAlert)}
      />
      <MySnackbar
        message="Order deleted successfully"
        open={showDeleteAlert}
        type="success"
        onClose={handleAlertClose(setShowDeleteAlert)}
      />
      <MySnackbar
        message="Failed to delete order. Please try again."
        open={showDeleteErrorAlert}
        type="error"
        onClose={handleAlertClose(setShowDeleteErrorAlert)}
      />
    </div>
  );
};

export default ManageOrder;
