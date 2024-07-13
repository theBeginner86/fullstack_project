import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from 'antd';
import { fetchEntityColumns } from '../api';

const AddEditPopup = ({ isOpen, data, onSave, onClose, entity }) => {
  const [formData, setFormData] = useState({});
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

  useEffect(() => {
    if (data) {
      setFormData(data);
    } else {
      setFormData({});
    }
  }, [data]);

  useEffect(() => {
    if (!data) {
      setFormData({});
    }
  }, [isOpen, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <Modal
      title={data ? 'Edit Record' : 'Add Record'}
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>Close</Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>Save</Button>
      ]}
    >
      {columns.map(column => (
        <div key={column} className="mb-2">
          <label>{column}:</label>
          <Input
            name={column}
            value={formData[column] || ''}
            onChange={handleChange}
            placeholder={column}
          />
        </div>
      ))}
    </Modal>
  );
};

export default AddEditPopup;
