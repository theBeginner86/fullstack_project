import React from 'react';
import { Select, Button } from 'antd';

const { Option } = Select;

const SortFilter = ({ sortBy, sortType, onSortChange, onSortTypeChange, onAdd, onDelete }) => {
  return (
    <div className="flex items-center space-x-2 mb-4">
      <span>Sort By</span>
      <Select value={sortBy} onChange={onSortChange} className="w-40">
        <Option value="property1">Property #1</Option>
        <Option value="property2">Property #2</Option>
        {/* Add other options here */}
      </Select>
      <Select value={sortType} onChange={onSortTypeChange} className="w-40">
        <Option value="ascending">Ascending</Option>
        <Option value="descending">Descending</Option>
      </Select>
      <Button type="primary" onClick={onAdd}>Add</Button>
      <Button onClick={onDelete}>Delete</Button>
    </div>
  );
};

export default SortFilter;
