import React from 'react';
import { Input, Button } from 'antd';

const SearchCriteria = ({ searchTerm, onSearchChange, onSearch, onReset }) => {
  return (
    <div className="flex space-x-2 mb-4">
      <Input
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search Criteria"
        className="flex-grow"
      />
      <Button type="primary" onClick={onSearch}>Search</Button>
      <Button onClick={onReset}>Reset</Button>
    </div>
  );
};

export default SearchCriteria;
