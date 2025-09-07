import 'package:flutter_test/flutter_test.dart';
import 'package:flutter/material.dart';
import 'package:bhasa_con_app/screens/splash_screen.dart';
import 'package:bhasa_con_app/utils/app_config.dart';

void main() {
  group('SplashScreen Widget Tests', () {
    testWidgets('displays app name and tagline', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: SplashScreen(),
        ),
      );

      // Verify the app name is displayed
      expect(find.text(AppConfig.appName), findsOneWidget);
      
      // Verify the tagline is displayed
      expect(find.text('Connect Through Language'), findsOneWidget);
      
      // Verify no loading indicator (minimal design)
      expect(find.text('Loading...'), findsNothing);
      expect(find.byType(CircularProgressIndicator), findsNothing);
      
      // Properly handle any pending timers
      await tester.pumpAndSettle();
    });

    testWidgets('has app icon', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: SplashScreen(),
        ),
      );

      // Verify app icon is present
      expect(find.byIcon(Icons.language), findsOneWidget);
      
      // Properly handle any pending timers
      await tester.pumpAndSettle();
    });

    testWidgets('has proper minimal structure', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: SplashScreen(),
        ),
      );

      // Verify it's a scaffold with centered content
      expect(find.byType(Scaffold), findsOneWidget);
      expect(find.byType(Column), findsOneWidget);
      
      // Verify minimal design - no complex loading states
      expect(find.text('Loading...'), findsNothing);
      expect(find.byType(CircularProgressIndicator), findsNothing);
      
      // Properly handle any pending timers
      await tester.pumpAndSettle();
    });

    testWidgets('renders UI immediately without blocking', (WidgetTester tester) async {
      await tester.pumpWidget(
        const MaterialApp(
          home: SplashScreen(),
        ),
      );

      // Should display immediately without waiting for async operations
      expect(find.text(AppConfig.appName), findsOneWidget);
      expect(find.text('Connect Through Language'), findsOneWidget);
      
      // Clean up any async operations
      await tester.pumpAndSettle();
    });
  });
}
