import { useState } from 'react';

import Container from './Container';
import Search from './Search';
import useBooks from '../hooks/useBook';
import Loading from '../loader/Loading';

const Page = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { error, filteredBooks, loading } = useBooks(searchQuery);

  const handleCategorySelect = (category) => {
    setSearchQuery(category);
  };

  return (
    <div className="flex flex-col">
      {!loading && !error && (
        <div className="mx-14 flex flex-col items-end">
          <Search
            searchQuery={searchQuery}
            onSearch={setSearchQuery}
          />
        </div>
      )}
      <div className="flex flex-grow items-center justify-center">
        {loading ? (
          <Loading />
        ) : error ? (
          <div className="flex h-full min-h-[650px] items-center justify-center">
            <div className="text-center text-xl font-bold text-red-600">{error}</div>
          </div>
        ) : (
          <Container
            books={filteredBooks}
            query={searchQuery}
            onCategorySelect={handleCategorySelect}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
