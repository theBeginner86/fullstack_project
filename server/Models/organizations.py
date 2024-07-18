from fastapi import HTTPException, Query, APIRouter
from prisma import Prisma
from Models.models import Organization, OrganizationCreate, OrganizationUpdate

router = APIRouter()
prisma = Prisma()

@router.on_event("startup")
async def startup():
    await prisma.connect()

###################### ORGANIZATION TABLE CRUD ###################

# Insert a new organization record
@router.post("/organizations", response_model=Organization)
async def insert_organization(organization: OrganizationCreate):
    try:
        new_organization = await prisma.organization.create(data=organization.dict())
        return new_organization
    except Exception as e:
        if "Unique constraint failed" in str(e):
            raise HTTPException(status_code=400, detail="Organization ID already exists")
        else:
            raise HTTPException(status_code=500, detail="Failed to insert organization")

# Update an organization record
@router.put("/organizations/{organization_id}", response_model=Organization)
async def update_organization(organization_id: int, organization: OrganizationUpdate):
    updated_organization = await prisma.organization.update(
        where={"OrganizationID": organization_id},
        data=organization.dict(exclude_unset=True)
    )
    if not updated_organization:
        raise HTTPException(status_code=404, detail="Organization not found")
    return updated_organization

# Delete an organization record based on index
@router.delete("/organizations", response_model=Organization)
async def delete_organization(organization_id: int = Query(...)):
    deleted_organization = await prisma.organization.delete(where={"OrganizationID": organization_id})
    if not deleted_organization:
        raise HTTPException(status_code=404, detail=f"Organization with ID {organization_id} not found")
    return deleted_organization