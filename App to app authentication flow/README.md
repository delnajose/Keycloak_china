# App-to-App Authentication Flow in Keycloak

This document explains **clent credentials** app to app authentication flow in Keycloak:



---

## 1. Client Credentials Flow

**Purpose:** Allows one client to obtain an access token directly from Keycloak to access its own resources.

### **Request Access Token**

**POST** `http://localhost:8080/realms/<realm>/protocol/openid-connect/token`

**Headers:**  
```
Content-Type: application/x-www-form-urlencoded
```

**Body (x-www-form-urlencoded):**
```
grant_type=client_credentials
client_id=client-a
client_secret=<client-a-secret>
scope=openid email profile
```

- Response includes an **access token** representing Client A.  
- Use it to call APIs owned by Client A:  
```
Authorization: Bearer <access_token>
```

---

