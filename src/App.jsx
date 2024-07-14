import React, { useState, useEffect } from 'react';
import SearchCriteria from './components/SearchCriteria';
import SortFilter from './components/SortFilter';
import DataList from './components/DataList';
import AddEditDrawer from './components/AddEditDrawer';
import {
  searchRecords,
  sortRecords,
  selectAllRecords,
  insertStudent,
  deleteStudent,
  updateStudent,
  insertMentor,
  updateMentor,
  deleteMentor,
  insertProject,
  updateProject,
  deleteProject,
  insertOrganization,
  updateOrganization,
  deleteOrganization
} from './api';

const App = ({ entity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('Name');
  const [sortType, setSortType] = useState('ascending');
  const [data, setData] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [popupOpen, setPopupOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  //////////////////////////////////////////////// COMMON METHODS ////////////////////////////////////////////////

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allRecords = await selectAllRecords(entity);
        setData(allRecords);
        setTotalRecords(allRecords.length);
      } catch (error) {
        console.error(`Failed to fetch ${entity}:`, error);
      }
    };

    fetchData();
  }, [entity]);

  const handleSearch = async (entity, column, searchTerm) => {
    try {
      const searchedRecords = await searchRecords(entity, column, searchTerm);
      setData(searchedRecords);
      setTotalRecords(searchedRecords.length);
    } catch (error) {
      console.error(`Failed to search ${entity}:`, error);
    }
  };

  const handleReset = async () => {
    setSearchTerm('');
    try {
      const allRecords = await selectAllRecords(entity);
      setData(allRecords);
      setTotalRecords(allRecords.length);
    } catch (error) {
      console.error('Failed to fetch records:', error);
    }
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handleSortTypeChange = (value) => {
    setSortType(value);
  };

  const handleSort = async () => {
    try {
      const sortedRecords = await sortRecords(entity, sortBy, sortType);
      setData(sortedRecords);
    } catch (error) {
      console.error(`Failed to sort records of ${entity}:`, error);
    }
  };

  const handleAdd = () => {
    setEditData(null);
    setPopupOpen(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setPopupOpen(true);
  };

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePageSizeChange = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleClose = () => setPopupOpen(false);

  //////////////////////////////////////////////// STUDENT METHODS ////////////////////////////////////////////////

  const handleDeleteStudent = async (studentId) => {
    const confirmed = window.confirm(`Are you sure you want to delete ID: ${studentId}`);
    if (confirmed) {
      try {
        await deleteStudent(studentId);
        const allRecords = await selectAllRecords(entity);
        setData(allRecords);
        setTotalRecords(allRecords.length);
      } catch (error) {
        console.error('Failed to delete record:', error);
      }
    }
  };

  const handleSaveStudent = async (formData) => {
    // Client-side validation
    if (!formData.Mobile || formData.Mobile.length !== 10 || isNaN(formData.Mobile)) {
      alert('Mobile must be exactly 10 digits');
      return;
    }
    if (formData.Yr_Start && (formData.Yr_Start < 1000 || formData.Yr_Start > 9999)) {
      alert('Yr_Start must be a 4-digit number');
      return;
    }
    if (formData.Yr_End && (formData.Yr_End < 1000 || formData.Yr_End > 9999)) {
      alert('Yr_End must be a 4-digit number');
      return;
    }
    if (formData.Yr_Start && formData.Yr_End && formData.Yr_End <= formData.Yr_Start) {
      alert('Yr_End must be greater than Yr_Start');
      return;
    }

    try {
      if (editData) {
        await updateStudent(editData.ID, formData);
      } else {
        await insertStudent(formData);
      }
      const allRecords = await selectAllRecords(entity);
      setData(allRecords);
      setTotalRecords(allRecords.length);
      setPopupOpen(false);
      setEditData(null);
    } catch (error) {
      console.error('Failed to save record:', error);
      if (error.message === 'Failed to insert student') {
        alert('Failed to insert student: Student ID already exists');
      } else {
        alert('Failed to save record. Please try again later.');
      }
    }
  };

  //////////////////////////////////////////////// MENTOR METHODS ////////////////////////////////////////////////

  const handleSaveMentor = async (formData) => {
    try {
      if (editData) {
        await updateMentor(editData.MentorID, formData);
      } else {
        await insertMentor(formData);
      }
      const allRecords = await selectAllRecords(entity);
      setData(allRecords);
      setTotalRecords(allRecords.length);
      setPopupOpen(false);
      setEditData(null);
    } catch (error) {
      console.error('Failed to save record:', error);
      if (error.message === 'Failed to insert mentor') {
        alert('Failed to insert mentor: Mentor ID already exists');
      } else {
        alert('Failed to save record. Please try again later.');
      }
    }
  };

  const handleDeleteMentor = async (mentorId) => {
    const confirmed = window.confirm(`Are you sure you want to delete ID: ${mentorId}?`);
    if (confirmed) {
      try {
        await deleteMentor(mentorId);
        const allRecords = await selectAllRecords(entity);
        setData(allRecords);
        setTotalRecords(allRecords.length);
      } catch (error) {
        console.error('Failed to delete record:', error);
      }
    }
  };

  //////////////////////////////////////////////// PROJECT METHODS ////////////////////////////////////////////////

  const handleSaveProject = async (formData) => {
    try {
      if (editData) {
        await updateProject(editData.ProjectID, formData);
      } else {
        await insertProject(formData);
      }
      const allRecords = await selectAllRecords(entity);
      setData(allRecords);
      setTotalRecords(allRecords.length);
      setPopupOpen(false);
      setEditData(null);
    } catch (error) {
      console.error('Failed to save record:', error);
      if (error.message === 'Failed to insert project') {
        alert('Failed to insert project: Project ID already exists');
      } else {
        alert('Failed to save record. Please try again later.');
      }
    }
  };

  const handleDeleteProject = async (projectId) => {
    const confirmed = window.confirm(`Are you sure you want to delete ID: ${projectId}?`);
    if (confirmed) {
      try {
        await deleteProject(projectId);
        const allRecords = await selectAllRecords(entity);
        setData(allRecords);
        setTotalRecords(allRecords.length);
      } catch (error) {
        console.error('Failed to delete record:', error);
      }
    }
  };

  //////////////////////////////////////////////// ORGANIZATION METHODS ////////////////////////////////////////////////

  const handleSaveOrganization = async (formData) => {
    try {
      if (editData) {
        await updateOrganization(editData.OrganizationID, formData);
      } else {
        await insertOrganization(formData);
      }
      const allRecords = await selectAllRecords(entity);
      setData(allRecords);
      setTotalRecords(allRecords.length);
      setPopupOpen(false);
      setEditData(null);
    } catch (error) {
      console.error('Failed to save record:', error);
      if (error.message === 'Failed to insert organization') {
        alert('Failed to insert organization: Organization ID already exists');
      } else {
        alert('Failed to save record. Please try again later.');
      }
    }
  };

  const handleDeleteOrganization = async (organizationId) => {
    const confirmed = window.confirm(`Are you sure you want to delete ID: ${organizationId}?`);
    if (confirmed) {
      try {
        await deleteOrganization(organizationId);
        const allRecords = await selectAllRecords(entity);
        setData(allRecords);
        setTotalRecords(allRecords.length);
      } catch (error) {
        console.error('Failed to delete record:', error);
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <SearchCriteria
        entity={entity}
        onSearch={handleSearch}
        onReset={handleReset}
      />
      <SortFilter
        entity={entity}
        sortBy={sortBy}
        sortType={sortType}
        onSortChange={handleSortChange}
        onSortTypeChange={handleSortTypeChange}
        onSort={handleSort}
        onAdd={handleAdd}
      />
      <DataList
        entity={entity}
        data={data}
        onEdit={handleEdit}
        onDelete={
          entity === 'students' ? handleDeleteStudent :
          entity === 'mentors' ? handleDeleteMentor :
          entity === 'projects' ? handleDeleteProject :
          handleDeleteOrganization
        }
      />
      <AddEditDrawer
        entity={entity}
        isOpen={popupOpen}
        data={editData}
        onSave={
          entity === 'students' ? handleSaveStudent :
          entity === 'mentors' ? handleSaveMentor :
          entity === 'projects' ? handleSaveProject :
          handleSaveOrganization
        }
        onClose={handleClose}
      />
    </div>
  );
};

export default App;