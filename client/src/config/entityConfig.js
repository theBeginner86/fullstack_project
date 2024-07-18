// entityConfig.js
export const entityConfig = {
  students: {
    requiredFields: [
      'ID', 'Name', 'eMail', 'Mobile', 'College', 
      'Yr_Start', 'Yr_End', 'Degree', 'Branch', 
      'Electives', 'Interests', 'MentorID'
    ],
  },
  mentors: {
    requiredFields: [
      'MentorID', 'Name', 'eMail', 'Mobile', 
      'Specialization', 'Availability', 'LinkedIn', 
      'OrganizationID'
    ],
  },
  projects: {
    requiredFields: [
      'ProjectID', 'Title', 'Description', 'Approach', 
      'Skills', 'HW_Needed', 'Milestones'
    ]
  },
  organizations: {
    requiredFields: [
      'OrganizationID', 'Name', 'Description', 'Website'
    ]
  },
};
