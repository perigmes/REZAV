# Setup Rémi

```
git clone https://github.com/apereo/cas-overlay-template.git
```

# Edit cas-overlay-template/build.gradle

Add after line `implementation "org.apereo.cas:cas-server-support-rest"` :

```
implementation "org.apereo.cas:cas-server-support-json-service-registry"
implementation "org.apereo.cas:cas-server-support-generic"
```

# Setup folders for build

Create directories in cas-overlay-template/etc/cas :

- services
- saml

# Build image

```
docker compose up
```

# Start service

```
docker compose up
```

# Test

Go to https://localhost:8443/cas
Attempt login with credentials rvenant / rvenant_pwd