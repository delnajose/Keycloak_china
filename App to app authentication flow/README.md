# App-to-App Authentication Flows in Keycloak

This document explains three major **app-to-app authentication flows** in Keycloak:

1. Client Credentials
2. Token Exchange
3. JWT Assertion (JWT Bearer Flow)

Each flow includes **Postman examples and step-by-step instructions**.

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

## 2. Token Exchange Flow

**Purpose:** Allows one client (Client A) to exchange its token for a token scoped for another client (Client B).

### **Request Token Exchange**

**POST** `http://localhost:8080/realms/<realm>/protocol/openid-connect/token`

**Body (x-www-form-urlencoded):**
```
grant_type=urn:ietf:params:oauth:grant-type:token-exchange
subject_token=<access_token_from_Client_A>
subject_token_type=urn:ietf:params:oauth:token-type:access_token
requested_token_type=urn:ietf:params:oauth:token-type:access_token
audience=client-b
client_id=client-a
client_secret=<client-a-secret>
scope=openid email profile
```

- Returns a **new access token** for Client B.  
- Use it to call Client B’s APIs:  
```
Authorization: Bearer <new_access_token>
```

> Make sure Client A has the **required roles** in Client B:  
> Keycloak → Clients → Client B → Service Account Roles → Assign roles to Client A.

---

## 3. JWT Assertion (JWT Bearer Flow)

**Purpose:** Allows Client A to authenticate using a **signed JWT** instead of a client secret.

### **Step 1: Create a JWT**

Claims example:
```json
{
  "iss": "client-a",
  "sub": "client-a",
  "aud": "http://localhost:8080/realms/<realm>/protocol/openid-connect/token",
  "exp": <future timestamp>,
  "iat": <current timestamp>
}
```

- Sign using **RS256** with Client A’s private key.  

### **Step 2: Request Access Token**

**POST** `http://localhost:8080/realms/<realm>/protocol/openid-connect/token`

**Body (x-www-form-urlencoded):**
```
grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer
assertion=<signed_JWT_here>
requested_token_type=urn:ietf:params:oauth:token-type:access_token
audience=client-b
scope=openid email profile
```

- Keycloak validates JWT → issues an **access token for Client B**.

### **Step 3: Call Client B API**

**GET** `http://localhost:8081/api/resource`  
**Headers:**  
```
Authorization: Bearer <access_token_from_JWT_assertion>
```

- Ensure roles assigned to Client A allow access on Client B.

---

## **Diagram**

```
+----------------+                      +-----------------+                     +----------------+
|                |                      |                 |                     |                |
|   Client A     |                      |    Keycloak     |                     |   Client B /   |
| (Service App)  |                      |  (Auth Server)  |                     |     API        |
|                |                      |                 |                     |                |
+----------------+                      +-----------------+                     +----------------+
        |                                       |                                        |
        |----(1) Client Credentials------------>|                                        |
        |        grant_type=client_credentials  |                                        |
        |        client_id / secret             |                                        |
        |                                       |                                        |
        |<---- Access Token (Client A) --------|                                        |
        |                                       |                                        |
        |----(2) Token Exchange ---------------->                                        |
        |        grant_type=token-exchange     |                                        |
        |        subject_token=Client A Token  |                                        |
        |        audience=Client B             |                                        |
        |                                       |                                        |
        |<---- Access Token (Client B) --------|                                        |
        |                                       |                                        |
        |----(3) JWT Assertion ----------------->                                        |
        |        JWT signed with private key    |                                        |
        |        audience=Keycloak token endpoint|                                       |
        |                                       |                                        |
        |<---- Access Token (Client B) --------|                                        |
        |                                       |                                        |
        |---- API Call ------------------------>|---- Validate Token ------------------->|
        | Authorization: Bearer <token>        |                                        |
        |                                       |                                        |
        |<----------------- Response ----------|<----------------------------------------|
```

---

## **Notes**

- `openid` scope is required for OIDC endpoints like `/userinfo`.  
- Tokens must have correct **audience** and **roles** for API access.  
- JWT Assertion flow avoids client secrets if using asymmetric keys.  
- Token Exchange enables **delegation between clients**.

