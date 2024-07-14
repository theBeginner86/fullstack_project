import React, { useState, useEffect } from 'react';
import { Drawer, Input, Button } from 'antd';
import { fetchEntityColumns } from '../api';
import { entityConfig } from '../config/entityConfig';

const AddEditDrawer = ({ isOpen, data, onSave, onClose, entity }) => {
  const [formData, setFormData] = useState({});
  const [columns, setColumns] = useState([]);
  const [requiredFields, setRequiredFields] = useState([]);

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
  }, [entity]);

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

  useEffect(() => {
    const entityConfigForCurrentEntity = entityConfig[entity];
    if (entityConfigForCurrentEntity) {
      setRequiredFields(entityConfigForCurrentEntity.requiredFields || []);
    }
  }, [entity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    const missingRequiredFields = requiredFields.filter(
      (field) => !formData[field]
    );
    if (missingRequiredFields.length > 0) {
      alert(`Please fill in the required fields: ${missingRequiredFields.join(', ')}`);
      return;
    }
    onSave(formData);
  };

  return (
    <Drawer
      title={data ? 'Edit Record' : 'Add Record'}
      placement="right"
      closable={true}
      onClose={onClose}
      visible={isOpen}
      width={400}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={onClose} style={{ marginRight: 8 }}>Close</Button>
          <Button onClick={handleSubmit} type="primary">Save</Button>
        </div>
      }
    >
      {columns.map(column => (
        <div key={column} className="mb-2">
          <label>
            {column}:
            {requiredFields.includes(column) && <span style={{ color: 'red' }}> *</span>}
          </label>
          <Input
            name={column}
            value={formData[column] || ''}
            onChange={handleChange}
            placeholder={column}
            required={requiredFields.includes(column)}
          />
        </div>
      ))}
    </Drawer>
  );
};

export default AddEditDrawer;
