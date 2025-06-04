import { Label, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router-dom';

import ButtonPrimary from '../components/ButtonPrimary';
import DropdownCategory from '../components/DropdownCategory';
import MyDecoration from '../components/MyDecoration';
import MyInput from '../components/MyInput';
import MySnackbar from '../components/MySnackbar';
import bookCategory from '../utils/BookCategory';

const EditBook = () => {
  const { id } = useParams();
  const {
    authorName,
    category,
    description,
    imageURL,
    price: initialPrice,
    stock: initialStock,
    title,
  } = useLoaderData();
  const [formState, setFormState] = useState({
    title,
    authorName,
    imageURL,
    description,
  });
  const [selectedBookCategory, setSelectedBookCategory] = useState([]);
  const [price, setPrice] = useState(initialPrice);
  const [stock, setStock] = useState(initialStock);
  const [showUploadAlert, setShowUploadAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setSelectedBookCategory(category || []);
  }, [category]);

  const handleNumericChange = (setter) => (e) => {
    const { value } = e.target;
    if (/^\d*$/.test(value)) {
      setter(value);
    }
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    const updateBookObj = {
      ...formState,
      category: selectedBookCategory,
      price: Number(price),
      stock: Number(stock),
    };
    fetch(`${import.meta.env.VITE_API_URL}/book/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateBookObj),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update book');
        return res.json();
      })
      .then(() => setShowUploadAlert(true))
      .catch((error) => {
        console.error('Error updating book:', error);
        setShowErrorAlert(true);
      });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <MyDecoration />
      <div className="relative z-20 flex min-h-screen items-center justify-center p-4">
        <form
          className="flex w-full flex-col flex-wrap gap-2 rounded-lg bg-Darkness bg-opacity-90 p-5"
          onSubmit={handleUpdate}
        >
          <h2 className="ligature text-center text-3xl font-bold text-White">
            Update a Book
          </h2>
          <div className="flex gap-8">
            <div className="w-full">
              <div className="mb-2 block">
                <Label
                  className="text-White"
                  htmlFor="title"
                  value="Book Title"
                />
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
                <Label
                  className="text-White"
                  htmlFor="authorName"
                  value="Author Name"
                />
              </div>
              <MyInput
                required
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
                <Label
                  className="text-White"
                  htmlFor="imageURL"
                  value="Book Image URL"
                />
              </div>
              <MyInput
                required
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
                <Label
                  className="text-White"
                  htmlFor="category"
                  value="Book Category"
                />
              </div>
              <DropdownCategory
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
                <Label
                  className="text-White"
                  htmlFor="stock"
                  value="Book Stock"
                />
              </div>
              <MyInput
                required
                id="stock"
                name="stock"
                placeholder="Book Stock"
                type="text"
                value={stock}
                onChange={handleNumericChange(setStock)}
              />
            </div>
            <div className="w-full">
              <div className="mb-2 block">
                <Label
                  className="text-White"
                  htmlFor="price"
                  value="Book Price"
                />
              </div>
              <MyInput
                required
                id="price"
                name="price"
                placeholder="Book Price"
                type="text"
                value={price}
                onChange={handleNumericChange(setPrice)}
              />
            </div>
          </div>
          <div>
            <div className="mb-2 block">
              <Label
                className="text-White"
                htmlFor="description"
                value="Book Description"
              />
            </div>
            <Textarea
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
            message="Book uploaded successfully!"
            open={showUploadAlert}
            type="success"
            onClose={() => setShowUploadAlert(false)}
          />
          <MySnackbar
            message="Failed to update book. Please try again later."
            open={showErrorAlert}
            type="error"
            onClose={() => setShowErrorAlert(false)}
          />
          <div className="flex h-full items-center justify-center">
            <ButtonPrimary
              className="flex w-1/2 items-center justify-center"
              type="submit"
            >
              Update Book
            </ButtonPrimary>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBook;
