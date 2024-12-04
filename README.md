# QLDT App

## Stack
- React Native
- Expo
- React Navigation
- Firebase Cloud Messaging
- SockJs, StompJs
- NativeWind

## Usage
```bash
git clone github.com/ducvu0907/qldt
cd qldt && npm install

# mv /path/to/firebase-credential.json /path/to/qldt
# mv /path/to/google-services.json /path/to/qldt
# setup eas
npm install -g eas-cli
eas credentials

# build and run
eas build --platform android --profile development
npm start
```
