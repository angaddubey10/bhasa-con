@echo off
echo Getting Flutter dependencies...
flutter pub get

echo Launching emulator...
flutter emulators --launch Medium_Phone_API_36.0

echo Waiting for emulator to start...
timeout /t 10 /nobreak > nul

echo Running the app...
flutter run -d emulator-5554


@REM Clean up old builds
flutter clean

@REM Release APK
flutter build apk --release