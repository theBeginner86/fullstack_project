from fastapi import HTTPException, Query, APIRouter
from prisma import Prisma
from Models.models import Project, ProjectCreate, ProjectUpdate

router = APIRouter()
prisma = Prisma()

@router.on_event("startup")
async def startup():
    await prisma.connect()

###################### PROJECT TABLE CRUD ###################

# Insert a new mentor record
@router.post("/projects", response_model=Project)
async def insert_project(project: ProjectCreate):
    try:
        new_project = await prisma.project.create(data=project.dict())
        return new_project
    except Exception as e:
        if "Unique constraint failed" in str(e):
            raise HTTPException(status_code=400, detail="Project ID already exists")
        else:
            raise HTTPException(status_code=500, detail="Failed to insert project")

# Update a record
@router.put("/projects/{project_id}", response_model=Project)
async def update_project(project_id: int, project: ProjectUpdate):
    updated_project = await prisma.project.update(
        where={"ProjectID": project_id},
        data=project.dict(exclude_unset=True)
    )
    if not updated_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return updated_project

# Delete a record based on index
@router.delete("/projects", response_model=Project)
async def delete_students(project_id: int= Query(...)):
    deleted_project = await prisma.project.delete(where={"ProjectID": project_id})
    if not deleted_project:
        raise HTTPException(status_code=404, detail=f"Project with ID {project_id} not found")
    return deleted_project
