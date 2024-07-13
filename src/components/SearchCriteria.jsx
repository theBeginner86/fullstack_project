import React, { useState, useEffect } from 'react';
import { Input, Button, Select } from 'antd';
import { fetchEntityColumns } from '../api'; // Update to your actual API function

const { Option } = Select;

const SearchCriteria = ({ entity, onSearch, onReset }) => {
  const [columns, setColumns] = useState([]);
  const [selectedColumn, setSelectedColumn] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const cols = await fetchEntityColumns(entity); // Fetch columns based on entity
        setColumns(cols);
      } catch (error) {
        console.error('Failed to fetch columns:', error);
      }
    };

    fetchColumns();
  }, [entity]);

  const handleSearch = () => {
    if (!selectedColumn || !searchTerm) {
      console.error('Column and search term must be selected.');
      return;
    }

    onSearch(entity, selectedColumn, searchTerm);
  };

  return (
    <div className="flex space-x-2 mb-4">
      <Select
        value={selectedColumn}
        onChange={value => setSelectedColumn(value)}
        placeholder="Select Column"
        className="w-40"
      >
        {columns.map(column => (
          <Option key={column} value={column}>{column}</Option>
        ))}
      </Select>
      <Input
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        placeholder="Enter Search Term"
        className="flex-grow"
      />
      <Button type="primary" onClick={handleSearch}>Search</Button>
      <Button onClick={onReset}>Reset</Button>
    </div>
  );
};

export default SearchCriteria;
