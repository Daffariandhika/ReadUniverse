import EmailIcon from '@mui/icons-material/Email';
import { CircularProgress } from '@mui/material';
import { send } from 'emailjs-com';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';

import Logo from '../assets/Image/logo.png';
import ButtonPrimary from '../components/ButtonPrimary';
import MyDecoration from '../components/MyDecoration';
import MyInput from '../components/MyInput';
import MyModal from '../components/MyModal';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    open: false,
    title: '',
    description: '',
    success: false,
  });

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        name: user.displayName || '',
        email: user.email || '',
      }));
    }
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const emailTemplateParams = {
        from_name: formData.name,
        reply_to: formData.email,
        message: formData.message,
      };

      await send(
        'service_yr8usro',
        'template_m51s1r3',
        emailTemplateParams,
        'C1XUFzq7j0wkPmce4',
      );

      setModalInfo({
        open: true,
        title: 'Success!',
        description:
          'Your message has been sent successfully. We’ll get back to you shortly.',
        success: true,
      });
      setFormData({ message: '' });
    } catch (error) {
      console.error('Email failed:', error);
      setModalInfo({
        open: true,
        title: 'Error',
        description: 'Failed to send your message. Please try again later.',
        success: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalInfo({ ...modalInfo, open: false });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-Darkness pb-8 pt-28 text-white">
      <MyDecoration />
      <div className="relative z-10 grid h-full md:grid-cols-2">
        <div className="flex flex-col items-center justify-center px-10">
          <h1 className="flex items-center bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 bg-clip-text font-sans text-4xl font-bold text-transparent">
            <img
              alt="ReadUniverse Logo"
              className="mr-2 h-12 w-12"
              src={Logo}
            />
            ReadUniverse
          </h1>
          <p className="my-1 mb-2 text-center text-white">
            Connect with us for queries or assistance.
          </p>
          <ButtonPrimary to="/">Home</ButtonPrimary>
        </div>
        <div className="flex items-center justify-center px-6">
          <form
            aria-labelledby="contact-us-form"
            className="w-full max-w-md rounded-2xl bg-Darkness bg-opacity-90 p-6"
            onSubmit={handleSubmit}
          >
            <h1
              className="text-2xl font-bold"
              id="contact-us-form"
            >
              Contact Us
            </h1>
            <p className="mb-4 text-sm tracking-wide">
              Fill in the details below, and we’ll respond shortly.
            </p>
            <MyInput
              required
              aria-label="Your Name"
              name="name"
              placeholder="Your Name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
            <MyInput
              required
              aria-label="Your Email Address"
              name="email"
              placeholder="Your Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            <textarea
              required
              aria-label="Your Message"
              className="shadow-form-shadow relative mt-4 flex h-32 w-full resize-none items-center rounded-2xl border-2 border-Indigo bg-Darkness pl-5 pt-3 text-White outline-none transition-all duration-1000 focus:border-Indigo focus:ring-0"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
            />
            <div className="mt-4">
              <ButtonPrimary
                disabled={isLoading}
                isLoading={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <CircularProgress
                    color="inherit"
                    size={24}
                  />
                ) : (
                  <>
                    <EmailIcon className="mr-2" /> Send Message
                  </>
                )}
              </ButtonPrimary>
            </div>
          </form>
        </div>
      </div>
      <MyModal
        actionButtons={[
          {
            label: 'Close',
            onClick: handleCloseModal,
          },
        ]}
        aria-live="assertive"
        description={modalInfo.description}
        open={modalInfo.open}
        title={modalInfo.title}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ContactUs;
