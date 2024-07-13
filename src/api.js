// src/api.js

const BASE_URL = 'http://localhost:8000';

// Fetch all columns in the student table
export const fetchStudentColumns = async () => {
  const response = await fetch(`${BASE_URL}/students/columns`);
  if (!response.ok) {
    throw new Error('Failed to fetch student columns');
  }
  return response.json();
};

// Fetch records based on a particular column's value
export const searchStudents = async (column, value) => {
  const response = await fetch(`${BASE_URL}/students/search?column=${column}&value=${value}`);
  if (!response.ok) {
    throw new Error('Failed to search students');
  }
  return response.json();
};

// Sort by a particular column and order
export const sortStudents = async (column, order) => {
  const response = await fetch(`${BASE_URL}/students/sort?column=${column}&order=${order}`);
  if (!response.ok) {
    throw new Error('Failed to sort students');
  }
  return response.json();
};

// Select all records in the student table
export const selectAllStudents = async () => {
  const response = await fetch(`${BASE_URL}/students/all`);
  if (!response.ok) {
    throw new Error('Failed to fetch all students');
  }
  return response.json();
};

// Insert a new student record
export const insertStudent = async (student) => {
  const response = await fetch(`${BASE_URL}/students`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  });
  if (!response.ok) {
    throw new Error('Failed to insert student');
  }
  return response.json();
};

// Delete a record based on index
export const deleteStudents = async (studentIds) => {
    const response = await fetch(`${BASE_URL}/students`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentIds),
    });
    if (!response.ok) {
      throw new Error('Failed to delete students');
    }
    return response.json();
  };
  

// Fetch all column values for a particular record
export const fetchStudentById = async (studentId) => {
  const response = await fetch(`${BASE_URL}/students/${studentId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch student by ID');
  }
  return response.json();
};

// Update a record
export const updateStudent = async (studentId, student) => {
  const response = await fetch(`${BASE_URL}/students/${studentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(student),
  });
  if (!response.ok) {
    throw new Error('Failed to update student');
  }
  return response.json();
};
