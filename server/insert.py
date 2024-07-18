# import csv
# import requests
# import sys

# # Define the FastAPI base URL
# base_url = "http://localhost:8000"

# # Function to read CSV file and return list of records with correct data types
# def read_csv(file_path):
#     records = []
#     with open(file_path, mode='r') as file:
#         csv_reader = csv.DictReader(file)
#         for row in csv_reader:
#             # Strip leading and trailing whitespace from field names and values
#             row = {k.strip(): v.strip() for k, v in row.items()}
#             # Ensure OrganizationID is an integer
#             row['OrganizationID'] = int(row['OrganizationID'])
#             row['MentorID'] = int(row['MentorID'])

#             records.append(row)
#     return records

# # Function to insert records into the corresponding entity table
# def insert_records(entity, records):
#     endpoint = f"{base_url}/{entity}"
#     for record in records:
#         response = requests.post(endpoint, json=record)
#         if response.status_code == 200:
#             print(f"Record inserted successfully: {record}")
#         else:
#             print(f"Failed to insert record: {record}")
#             print(f"Error: {response.json()}")

# if __name__ == "__main__":
#     if len(sys.argv) != 3:
#         print("Usage: python client.py <entity> <csv_file_path>")
#         sys.exit(1)

#     entity = sys.argv[1]
#     csv_file_path = sys.argv[2]

#     # Read records from CSV file
#     records = read_csv(csv_file_path)
    
#     # Insert records into the specified entity table
#     insert_records(entity, records)


import csv
import requests
import sys

# Define the FastAPI base URL
base_url = "http://localhost:8000"

# Define the columns that need to be converted to integers
integer_columns = {
    "students": ["ID", "Yr_Start", "Yr_End", "MentorID"],
    "mentors": ["MentorID", "OrganizationID"],
    "projects": ["ProjectID"],
    "organizations": ["OrganizationID"]
}

# Function to read CSV file and return list of records with correct data types
def read_csv(file_path, entity):
    records = []
    with open(file_path, mode='r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            # Strip leading and trailing whitespace from field names and values
            row = {k.strip(): v.strip() for k, v in row.items()}
            # Convert necessary fields to integers
            for column in integer_columns.get(entity, []):
                if column in row:
                    row[column] = int(row[column])
            records.append(row)
    return records

# Function to insert records into the corresponding entity table
def insert_records(entity, records):
    endpoint = f"{base_url}/{entity}"
    for record in records:
        response = requests.post(endpoint, json=record)
        if response.status_code == 200:
            print(f"Record inserted successfully: {record}")
        else:
            print(f"Failed to insert record: {record}")
            print(f"Error: {response.json()}")

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python client.py <entity> <csv_file_path>")
        sys.exit(1)

    entity = sys.argv[1]
    csv_file_path = sys.argv[2]

    # Read records from CSV file
    records = read_csv(csv_file_path, entity)
    
    # Insert records into the specified entity table
    insert_records(entity, records)
