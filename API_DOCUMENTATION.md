Basic Start MBC API Documentation
Base URL: https://api.mybasiccrm.com
Authentication
Most endpoints in this API require a Bearer Token.
You must first obtain a token using the JWT Create endpoint and include it in the Authorization header of subsequent requests.
Header:
Authorization: Bearer <your_token>
1. Authentication Endpoint
Create JWT Token
Generates an access token using Basic Auth credentials.
Method: POST
Path: /api/jwt.php
Auth: Basic Auth (Username & Password)
2. Select APIs (Get Resources)
Retrieve specific resource details by ID.
General Request Format
Method: GET
Path: /api/resource.php
Resource	Parameters	Description
Select Contact	resource_type=contact <br> id={id}	Get contact details.
Select Task	resource_type=task <br> id={id}	Get task details.
Select Lead	resource_type=lead <br> id={id}	Get lead details.
Select Opp	resource_type=opp <br> id={id}	Get opportunity details.
Select Job	resource_type=job <br> id={id}	Get job details.
3. Form APIs (Form Metadata)
Retrieve form definitions and rendering logic.
Method: GET
Path: /api/resource.php
Common Parameter: resource_type=form
Name	Query Parameters	Description
Get Contact Form	id=contact <br> type=P (Person) or O (Company) <br> organization_type={id}	Render contact form.
Get Task Form	id=task <br> status={status} (e.g., Completed) <br> task_type={id}	Render task form.
Get Lead Form	id=lead <br> client_id={id} <br> statustype={id}	Render lead form.
Get Opportunity Form	id=opportunity <br> client_id={id} <br> statustype={id}	Render opportunity form.
Get Job Form	id=job <br> client_id={id} <br> jobstatustype={id}	Render job form.
4. List APIs
Retrieve lists of resources with sorting and filtering.
Method: GET
Path: /api/resource.php
Name	Parameters	Note
Contact List	resource_type=contact <br> sort_by=1 <br> filter={json_string}	Filter example: [{"val": "Architect", "ftype": 1...}]
Task List	resource_type=task	
Lead List	resource_type=lead	
Opp List	resource_type=opp <br> sort_by=1 <br> filter={json}	
Job List	resource_type=job <br> sort_by=1 <br> filter={json}	
5. Edit APIs
Retrieve data specifically formatted for editing an existing resource.
Method: GET
Path: /api/resource.php
Name	Parameters
Contact Edit	resource_type=contact/edit, id={id}
Task Edit	resource_type=task/edit, id={id}
Lead Edit	resource_type=lead/edit, id={id}, statustype={id}
Opp Edit	resource_type=opp/edit, id={id}, statustype={id}
Job Edit	resource_type=job/edit, id={id}, statustype={id}
6. Create APIs
Create new resources. The body format is a custom JSON array of field objects.
Method: POST
Path: /api/resource.php
Body Structure Example:
code
JSON
[
    { "fname": "name", "value": "John Doe" },
    { "fname": "email", "value": "john@example.com" },
    { "fid": "92", "value": "Custom Field Value" }
]
Name	Query Param	Body Highlights
Create Contact	resource_type=contact	Requires contacttype, organizationTypeId, name.
Create Task	resource_type=task	Requires typeTaskid, taskstatus, descrip, Datetimedue.
Create Lead	resource_type=lead	Requires oppName, typeStatusid, contactid.
Create Opp	resource_type=opp	Requires oppName, contactid, productdata (nested JSON).
Create Job	resource_type=job	Requires jname, oppid, productdata.
7. Update APIs
Update existing resources.
Method: POST
Path: /api/resource.php
Query Params: resource_type={type}, id={id}
Body: Same JSON Array structure as Create APIs.
Endpoints:
Update Contact
Update Task
Update Lead
Update Job
Update Opp
8. Product APIs
Manage products, price lists, and discounts.
Path: /api/resource.php
Endpoint	Method	Query Params	Description
Products Form	GET	resource_type=product/edit <br> currency={CUR}	Get product edit form/calculations. Body contains JSON list of items.
List Products	GET	resource_type=products	List available products.
Price List	GET	resource_type=pricelist <br> list={id}	Get a specific price list.
Create Price List	GET	resource_type=pricelist/create <br> value={name}	Create a new price list.
Edit Price List	GET	resource_type=pricelist/edit <br> type=update/delete <br> id={id}	Edit or delete a price list.
Products List (CRUD)	GET	resource_type=productlist <br> type=new/update/delete	Manage items within a product list. Body contains item details.
9. User & Department APIs
Manage system users and departments.
Path: /api/resource.php
Users
Action	Method	Query Params
List Users	GET	resource_type=users
Create User	GET	resource_type=user/create <br> fNameUser={name}, email={email}
Update User	GET	resource_type=user/update <br> edituser={id} (Body contains JSON details)
Update Password	GET	resource_type=user/password <br> edituser={id}, password={pass}
Delete User	GET	resource_type=user/delete <br> deluser={id}
User Permissions	GET	resource_type=user/permission <br> perid={id}
Create Account (No Auth)
Method: POST
Params: resource_type=account/create
Body (x-www-form-urlencoded): name, email, password.
Departments
Action	Method	Query Params
List	GET	resource_type=department <br> type=list
Create	GET	resource_type=department <br> type=create <br> name={name}
Update	GET	resource_type=department <br> type=update <br> id={id}, name={name}
Delete	GET	resource_type=department <br> type=delete <br> id={id}
10. Search & Utilities
General search and miscellaneous tools.
Path: /api/resource.php
Method: GET
Name	Query Params	Description
Calendar	resource_type=calendar <br> move=save/next/prev	Manage calendar views.
News Feed	resource_type=news/feed <br> limit={int}	Get activity feed.
Quick Search	resource_type=quick_search <br> s={term}	Global quick search.
Search Contact	resource_type=contact/search <br> s={term}	Search contacts.
Search Lead	resource_type=lead/search <br> s={term}	Search leads.
Search Job	resource_type=job/search <br> s={term}	Search jobs.
Search Proposal	resource_type=proposal/search <br> s={term}	Search proposals.
Search Product	resource_type=product/search <br> s={term}	Search products.
Search Cities	resource_type=city/search <br> s={term}	Search available cities.
Search Towns	resource_type=town/search <br> city={city_name}	Search towns within a city.
Search Countries	resource_type=country/search <br> s={term}	Search available countries.
