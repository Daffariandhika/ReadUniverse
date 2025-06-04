import { useState } from 'react';

import ButtonPrimary from '../components/ButtonPrimary';
import DropdownCategory from '../components/DropdownCategory';
import MyDecoration from '../components/MyDecoration';
import MyInput from '../components/MyInput';
import MySnackbar from '../components/MySnackbar';
import { useAuth } from '../contexts/AuthContext';
import bookCategory from '../utils/BookCategory';

const UploadBook = () => {
  const { user } = useAuth();
  const [formState, setFormState] = useState({
    title: '',
    authorName: '',
    imageURL: '',
    description: '',
  });
  const [selectedBookCategory, setSelectedBookCategory] = useState([]);
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [showUploadAlert, setShowUploadAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumericChange = (setter) => (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleBookSubmit = (event) => {
    event.preventDefault();

    if (!user) {
      alert('You must be logged in to upload a book.');
      return;
    }

    const bookObj = {
      ...formState,
      category: selectedBookCategory,
      price: Number(price),
      likes: 0,
      stock: Number(stock),
      averageRating: 0.0,
      owner: user._id,
    };

    fetch(`${import.meta.env.VITE_API_URL}/upload-book`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(bookObj),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to upload book');
        return res.json();
      })
      .then(() => {
        setShowUploadAlert(true);
        setFormState({
          title: '',
          authorName: '',
          imageURL: '',
          description: '',
        });
        setSelectedBookCategory([]);
        setPrice('');
        setStock('');
      })
      .catch((error) => {
        console.error('Error uploading book:', error);
        setShowErrorAlert(true);
      });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <MyDecoration />
      <div className="relative z-20 flex min-h-screen items-center justify-center p-4">
        <form
          className="flex w-full flex-col flex-wrap gap-2 rounded-lg bg-Darkness bg-opacity-90 p-5"
          onSubmit={handleBookSubmit}
        >
          <h2 className="ligature text-center text-3xl font-bold text-White">
            Upload a Book
          </h2>
          <div className="flex gap-8">
            <div className="w-full">
              <div className="mb-2 block">
                <label
                  className="text-White"
                  htmlFor="title"
                >
                  Book Title
                </label>
              </div>
              <MyInput
                required
                id="title"
                name="title"
                placeholder="Book Title"
                type="text"
                value={formState.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full">
              <div className="mb-2 block">
                <label
                  className="text-White"
                  htmlFor="authorName"
                >
                  Author Name
                </label>
              </div>
              <MyInput
                required
                className="w-full rounded-lg border-2 border-Indigo bg-Darkness px-4 py-2 tracking-wide text-White focus:border-Indigo focus:ring-0"
                id="authorName"
                name="authorName"
                placeholder="Author Name"
                type="text"
                value={formState.authorName}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="flex gap-8">
            <div className="w-full">
              <div className="mb-2 block">
                <label
                  className="text-White"
                  htmlFor="imageURL"
                >
                  Book Image URL
                </label>
              </div>
              <MyInput
                required
                className="w-full rounded-lg border-2 border-Indigo bg-Darkness px-4 py-2 tracking-wide text-White focus:border-Indigo focus:ring-0"
                id="imageURL"
                name="imageURL"
                placeholder="Book Image URL"
                type="text"
                value={formState.imageURL}
                onChange={handleInputChange}
              />
            </div>
            <div className="w-full">
              <div className="mb-2 block">
                <label
                  className="text-White"
                  htmlFor="category"
                >
                  Book Category
                </label>
              </div>
              <DropdownCategory
                id="category"
                maxSelection={3}
                options={bookCategory}
                selectedOption={selectedBookCategory}
                setSelectedOption={setSelectedBookCategory}
              />
            </div>
          </div>
          <div className="flex gap-8">
            <div className="w-full">
              <div className="mb-2 block">
                <label
                  className="text-White"
                  htmlFor="price"
                >
                  Book Price
                </label>
              </div>
              <MyInput
                required
                className="w-full rounded-lg border-2 border-Indigo bg-Darkness px-4 py-2 tracking-wide text-White focus:border-Indigo focus:ring-0"
                id="price"
                name="price"
                placeholder="Book Price"
                type="text"
                value={price}
                onChange={handleNumericChange(setPrice)}
              />
            </div>
            <div className="w-full">
              <div className="mb-2 block">
                <label
                  className="text-White"
                  htmlFor="stock"
                >
                  Book Stock
                </label>
              </div>
              <MyInput
                required
                className="w-full rounded-lg border-2 border-Indigo bg-Darkness px-4 py-2 tracking-wide text-White focus:border-Indigo focus:ring-0"
                id="stock"
                name="stock"
                placeholder="Book Stock"
                type="text"
                value={stock}
                onChange={handleNumericChange(setStock)}
              />
            </div>
          </div>
          <div>
            <div className="mb-2 block">
              <label
                className="text-White"
                htmlFor="description"
              >
                Book Description
              </label>
            </div>
            <textarea
              required
              className="w-full resize-none rounded-lg border-2 border-Indigo bg-Darkness px-4 py-2 tracking-wide text-White focus:border-Indigo focus:ring-0"
              id="description"
              name="description"
              placeholder="Write your book description..."
              rows={4}
              value={formState.description}
              onChange={handleInputChange}
            />
          </div>
          <MySnackbar
            message="Book uploaded successfully"
            open={showUploadAlert}
            type="success"
            onClose={() => setShowUploadAlert(false)}
          />
          <MySnackbar
            message="Failed to upload book, please try again"
            open={showErrorAlert}
            type="error"
            onClose={() => setShowErrorAlert(false)}
          />
          <div className="flex h-full items-center justify-center">
            <ButtonPrimary
              className="flex w-1/2 items-center justify-center"
              type="submit"
            >
              Upload Book
            </ButtonPrimary>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadBook;
