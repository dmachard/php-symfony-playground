#!/bin/bash

KEYCLOAK_URL="https://localhost:8443/"
REALM_FILE="./realm-export.json"
REALM="playground"
CLIENT_NAME="api_symfony"

declare -A USERS
USERS["alice"]="ROLE_USER:Alice:Dupont"
USERS["bob"]="ROLE_USER:Bob:Martin"
USERS["god"]="ROLE_ADMIN:God:Almighty"

# Admin authentication
TOKEN_RESPONSE=$(curl -k -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=admin" \
    -d "password=admin" \
    -d "grant_type=password" \
    -d "client_id=admin-cli")
TOKEN=$(echo $TOKEN_RESPONSE | jq -r '.access_token')
if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "error: Unable to obtain access token."
    echo "response: $TOKEN_RESPONSE"
    exit 1
fi

# Import the realm (skip if already exists)
IMPORT_RESPONSE=$(curl -k -s -w "\n%{http_code}" -X POST "${KEYCLOAK_URL}/admin/realms" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  -d @"${REALM_FILE}")
IMPORT_HTTP_CODE=$(echo "$IMPORT_RESPONSE" | tail -n1)
if [ "$IMPORT_HTTP_CODE" = "201" ]; then
  echo "Realm imported successfully."
else
  echo "Realm import returned HTTP $IMPORT_HTTP_CODE (it may already exist)."
fi

# Get client UUID for clientId = api_symfony
CLIENTS_RESPONSE=$(curl -k -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM}/clients?clientId=${CLIENT_NAME}" \
  -H "Authorization: Bearer ${TOKEN}")
CLIENT_UUID=$(echo "$CLIENTS_RESPONSE" | jq -r '.[0].id // empty')

if [ -z "${CLIENT_UUID}" ]; then
  echo "Error: client '${CLIENT_NAME}' not found in realm '${REALM}'."
  echo "Response: $CLIENTS_RESPONSE"
  exit 1
fi
echo "Found client '${CLIENT_NAME}' with id: ${CLIENT_UUID}"

# Create users and assign client roles
for USERNAME in "${!USERS[@]}"; do
  IFS=':' read -r CLIENT_ROLE FIRSTNAME LASTNAME <<< "${USERS[$USERNAME]}"
  echo "Creating user '$USERNAME' ($FIRSTNAME $LASTNAME) with role '$CLIENT_ROLE'..."

  curl -k -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM}/users" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
          \"username\": \"${USERNAME}\",
          \"enabled\": true,
          \"email\": \"${USERNAME}@example.com\",
          \"firstName\": \"${FIRSTNAME}\",
          \"lastName\": \"${LASTNAME}\",
          \"credentials\": [{\"type\":\"password\",\"value\":\"${USERNAME}\",\"temporary\":false}]
        }"

  # Get the user ID of the newly created user
  USER_ID=$(curl -k -s -X GET "${KEYCLOAK_URL}admin/realms/${REALM}/users?username=${USERNAME}" \
    -H "Authorization: Bearer ${TOKEN}" | jq -r '.[0].id')

  # Get client role JSON
  ROLE_JSON=$(curl -k -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM}/clients/${CLIENT_UUID}/roles/${CLIENT_ROLE}" \
    -H "Authorization: Bearer ${TOKEN}")
  ROLE_ID=$(echo "$ROLE_JSON" | jq -r '.id // empty')
  if [ -z "${ROLE_ID}" ]; then
    echo "Client role '${CLIENT_ROLE}' not found on client '${CLIENT_NAME}'. Response:"
    echo "$ROLE_JSON"
    continue
  fi

  # Assign client role to user
  ASSIGN_RESPONSE=$(curl -k -s -w "\n%{http_code}" -X POST "${KEYCLOAK_URL}/admin/realms/${REALM}/users/${USER_ID}/role-mappings/clients/${CLIENT_UUID}" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "[${ROLE_JSON}]")
  ASSIGN_HTTP_CODE=$(echo "$ASSIGN_RESPONSE" | tail -n1)
  if [ "$ASSIGN_HTTP_CODE" = "204" ]; then
    echo "Assigned client role '${CLIENT_ROLE}' to user '${USERNAME}'."
  else
    echo "Failed to assign role (HTTP ${ASSIGN_HTTP_CODE}). Response:"
    echo "$ASSIGN_RESPONSE"
  fi

  echo "User '$USERNAME' created and role '$ROLE' assigned."
done