# GuitarBox

This repository contains an app for guitar enthusiasts with a metronome, tuner, and song sheet collection.

## Project Dependencies
- p5.js
- m5.js
- svguitar
- html-chords

## Getting Started
1. Install the necessary dependencies by running:
```
npm install
```

2. Add the Android platform to the project:
```
ionic cap add android
ionic cap open android
```

3. Modify the `AndroidManifest.xml` file:
- Inside the `<activity>` tag, add:
    ```
    android:screenOrientation="portrait"
    ```

- Inside the `<manifest>` tag, add:
    ```
    <uses-permission android:name="android.permission.RECORD_AUDIO" />
    <uses-permission android:name="android.permission.MODIFY_AUDIO_SETTINGS" />
    ```

## Usage
Once the app is installed on your Android device, you can launch it and access the various features such as the metronome, tuner, and song sheet collection. Enjoy playing your guitar with this handy app!

## License
This project is licensed under the MIT License. Feel free to modify and distribute it according to the terms of the license.
