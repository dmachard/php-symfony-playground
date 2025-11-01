#!/bin/bash

KEYCLOAK_URL="https://localhost:8443/"
REALM_FILE="./realm-export.json"
REALM="playground"

declare -A USERS
USERS["alice"]="ROLE_USER"
USERS["bob"]="ROLE_USER"
USERS["god"]="ROLE_ADMIN"


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

IMPORT_RESPONSE=$(curl -k -s -w "\n%{http_code}" -X POST "${KEYCLOAK_URL}/admin/realms" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d @"${REALM_FILE}")

HTTP_CODE=$(echo "$IMPORT_RESPONSE" | tail -n1)
if [ "$HTTP_CODE" = "201" ]; then
    echo "Realm imported successfully."
else
    echo "Error importing realm. HTTP Status Code: $HTTP_CODE"
    echo "$IMPORT_RESPONSE"
    exit 1
fi

for USERNAME in "${!USERS[@]}"; do
  ROLE="${USERS[$USERNAME]}"

  echo "Creating user '$USERNAME' with role '$ROLE'..."
  curl -k -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM}/users" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{
          \"username\": \"${USERNAME}\",
          \"enabled\": true,
          \"email\": \"${USERNAME}@example.com\",
          \"credentials\": [{\"type\":\"password\",\"value\":\"changeme\",\"temporary\":false}]
        }"

  # Get the user ID of the newly created user
  USER_ID=$(curl -k -s -X GET "${KEYCLOAK_URL}admin/realms/${REALM}/users?username=${USERNAME}" \
    -H "Authorization: Bearer ${TOKEN}" | jq -r '.[0].id')

  # Get the role JSON
  ROLE_JSON=$(curl -k -s -X GET "${KEYCLOAK_URL}/admin/realms/${REALM}/roles/${ROLE}" \
    -H "Authorization: Bearer ${TOKEN}")

  # Assign the role to the user
  curl -k -s -X POST "${KEYCLOAK_URL}/admin/realms/${REALM}/users/${USER_ID}/role-mappings/realm" \
    -H "Authorization: Bearer ${TOKEN}" \
    -H "Content-Type: application/json" \
    -d "[${ROLE_JSON}]"

  echo "User '$USERNAME' created and role '$ROLE' assigned."
done