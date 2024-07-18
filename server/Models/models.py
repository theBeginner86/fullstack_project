from typing import List, Optional, Union
from pydantic import BaseModel

class StudentBase(BaseModel):
    ID: Optional[int]
    Name: Optional[str]
    eMail: Optional[str]
    Mobile: Optional[str]
    College: Optional[str] = None
    Yr_Start: Optional[int] 
    Yr_End: Optional[int] 
    Degree: Optional[str] = None
    Branch: Optional[str] = None
    Electives: Optional[str] = None
    Interests: Optional[str] = None
    MentorID: Optional[int] 

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    pass

class Student(StudentBase):
    ID: int

    class Config:
        orm_mode = True

class MentorBase(BaseModel):
    MentorID: Optional[int]
    Name: Optional[str]
    eMail: Optional[str]
    Mobile: Optional[str]
    Specialization: Optional[str]
    Availability: Optional[str]
    LinkedIn: Optional[str]
    OrganizationID: Optional[int]

class MentorCreate(MentorBase):
    pass

class MentorUpdate(MentorBase):
    pass

class Mentor(MentorBase):
    MentorID: int

    class Config:
        orm_mode = True

class ProjectBase(BaseModel):
    ProjectID: Optional[int]
    Title: Optional[str]
    Description: Optional[str]
    Approach: Optional[str]
    Skills: Optional[str]
    HW_Needed: Optional[str]
    Milestones: Optional[str]

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(ProjectBase):
    pass

class Project(ProjectBase):
    ProjectID: int

    class Config:
        orm_mode = True

class OrganizationBase(BaseModel):
    OrganizationID: Optional[int]
    Name: str
    Description: Optional[str]
    Website: Optional[str]

class OrganizationCreate(OrganizationBase):
    pass

class OrganizationUpdate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    OrganizationID: int

    class Config:
        orm_mode = True

EntityResponse = Union[List[Student], List[Mentor], List[Project], List[Organization]]
