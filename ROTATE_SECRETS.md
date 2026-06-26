# JWT Secret Rotation (zero-downtime)

This procedure allows rotating the JWT signing key without logging out any users or causing downtime.

## Procedure

### Step 1 — Generate a new secret

```bash
openssl rand -hex 32
```

Copy the output.

### Step 2 — Update environment variables

In your deployment environment:

```
JWT_SECRET_PREVIOUS = <current JWT_SECRET value>
JWT_SECRET          = <new secret from step 1>
```

### Step 3 — Deploy

Deploy the service. Both old and new tokens are now valid simultaneously thanks to dual-key verification (`_verify_token_with_rotation`).

### Step 4 — Wait

Wait **15 minutes** (beyond the access token expiry). All active users will have silently received new tokens signed with the current key (via `X-Refreshed-Token` response header).

### Step 5 — Clean up

Remove `JWT_SECRET_PREVIOUS` from the environment.

### Step 6 — Redeploy

Deploy again. Only the new key is now accepted.

## Notes

- `token_version` is unaffected by this procedure. Users stay logged in throughout.
- The frontend automatically updates its cookie when it receives an `X-Refreshed-Token` header.
- If a client is offline during the rotation window and hasn't refreshed, their old token will fail after `JWT_SECRET_PREVIOUS` is removed. They'll need to log in again.
