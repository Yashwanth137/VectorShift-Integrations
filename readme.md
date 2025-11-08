# VectorShift Integrations Technical Assessment

This repository contains my completed submission for the **VectorShift Integrations Technical Assessment**.  
It includes a full **HubSpot OAuth2 integration** implemented with **FastAPI (Python)** for the backend,  
and **React (JavaScript)** for the frontend — along with **Redis** for secure token persistence and caching.

---

## Features Implemented

### **Part 1 — HubSpot OAuth Integration**
- Implemented full OAuth2 authorization flow:
  - `/integrations/hubspot/authorize`
  - `/integrations/hubspot/oauth2callback`
  - `/integrations/hubspot/credentials`
- Used **Redis** to store and refresh access tokens securely.
- Implemented **token auto-refresh** for expired credentials.
- Added **graceful error handling** and **Redis cleanup** using `delete_key_redis`.

### **Part 2 — Loading HubSpot Items**
- Completed `/integrations/hubspot/load` endpoint to fetch contact data.
- Normalized retrieved data into **IntegrationItem**-style objects:
  ```json
  {
    "id": "123456789",
    "type": "Contact",
    "name": "John Doe",
    "parent_path_or_name": "HubSpot Contacts",
    "creation_time": "2025-11-08T14:35:00Z",
    "visibility": true
  }
