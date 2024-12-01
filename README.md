# QLDT App

```bash
git clone github.com/ducvu0907/qldt
cd qldt && npm install

# rnfb doesn't work with expo go so have to build
# mv firebase-credential.json and google-services.json to the root project
# setup eas and build
eas credentials
eas build --platform android --profile development

npm start
```