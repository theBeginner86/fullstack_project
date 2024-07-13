import React, { useState, useEffect } from 'react';
import { Select, Button } from 'antd';
import { fetchEntityColumns } from '../api';

const { Option } = Select;

const SortFilter = ({ sortBy, sortType, onSortChange, onSortTypeChange, onSort, onAdd, onDelete, entity }) => {
  const [columns, setColumns] = useState([]);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const cols = await fetchEntityColumns(entity);
        setColumns(cols);
      } catch (error) {
        console.error('Failed to fetch columns:', error);
      }
    };

    fetchColumns();
  }, []);

  return (
    <div className="flex items-center space-x-2 mb-4">
      <span>Sort By</span>
      <Select value={sortBy} onChange={onSortChange} className="w-40">
        {columns.map(column => (
          <Option key={column} value={column}>{column}</Option>
        ))}
      </Select>
      <Select value={sortType} onChange={onSortTypeChange} className="w-40">
        <Option value="ascending">Ascending</Option>
        <Option value="descending">Descending</Option>
      </Select>
      <Button type="primary" onClick={onSort}>Sort</Button>
      <Button type="primary" onClick={onAdd}>Add</Button>
      <Button onClick={onDelete}>Delete</Button>
    </div>
  );
};

export default SortFilter;
