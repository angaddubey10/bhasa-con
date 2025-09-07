import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:bhasa_con_app/main.dart';
import 'package:bhasa_con_app/screens/auth/register_screen.dart';
import 'package:bhasa_con_app/utils/app_theme.dart';

void main() {
  group('Authentication UI Tests', () {
    testWidgets('Login screen displays correctly', (WidgetTester tester) async {
      await tester.pumpWidget(const BhasaConApp());

      // Verify login screen is shown
      expect(find.text('Welcome to Bhasa Con'), findsOneWidget);
      expect(find.text('Connect through languages'), findsOneWidget);
      expect(find.text('Sign In'), findsOneWidget);
    });

    testWidgets('Can navigate to registration screen', (WidgetTester tester) async {
      await tester.pumpWidget(const BhasaConApp());

      // Find the TextButton with "Create Account" text (not the AppBar)
      final createAccountButton = find.widgetWithText(TextButton, 'Create Account');
      expect(createAccountButton, findsOneWidget);
      await tester.tap(createAccountButton);
      await tester.pumpAndSettle();

      // Verify registration screen is shown
      expect(find.text('Join Bhasa Con'), findsOneWidget);
      expect(find.text('First Name'), findsOneWidget);
      expect(find.text('Last Name'), findsOneWidget);
      expect(find.text('Email'), findsOneWidget);
      expect(find.text('Password'), findsOneWidget);
      expect(find.text('Confirm Password'), findsOneWidget);
    });

    testWidgets('Registration form validation works', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(
        home: const RegisterScreen(),
        theme: AppTheme.lightTheme,
      ));

      // Try to submit empty form - find the ElevatedButton with "Create Account"
      final submitButton = find.widgetWithText(ElevatedButton, 'Create Account');
      expect(submitButton, findsOneWidget);
      await tester.tap(submitButton);
      await tester.pumpAndSettle();

      // Verify validation messages appear
      expect(find.text('First name is required'), findsOneWidget);
      expect(find.text('Last name is required'), findsOneWidget);
      expect(find.text('Email is required'), findsOneWidget);
      expect(find.text('Password is required'), findsOneWidget);
    });

    testWidgets('Email validation works correctly', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(
        home: const RegisterScreen(),
        theme: AppTheme.lightTheme,
      ));

      // Fill form with invalid email
      await tester.enterText(find.widgetWithText(TextFormField, 'First Name'), 'John');
      await tester.enterText(find.widgetWithText(TextFormField, 'Last Name'), 'Doe');
      await tester.enterText(find.widgetWithText(TextFormField, 'Email'), 'invalid-email');
      await tester.enterText(find.widgetWithText(TextFormField, 'Password'), 'ValidPassword123!');
      await tester.enterText(find.widgetWithText(TextFormField, 'Confirm Password'), 'ValidPassword123!');

      // Submit form
      final submitButton = find.widgetWithText(ElevatedButton, 'Create Account');
      await tester.tap(submitButton);
      await tester.pumpAndSettle();

      // Verify email validation message appears
      expect(find.text('Please enter a valid email address'), findsOneWidget);
    });

    testWidgets('Password validation works correctly', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(
        home: const RegisterScreen(),
        theme: AppTheme.lightTheme,
      ));

      // Fill form with weak password
      await tester.enterText(find.widgetWithText(TextFormField, 'First Name'), 'John');
      await tester.enterText(find.widgetWithText(TextFormField, 'Last Name'), 'Doe');
      await tester.enterText(find.widgetWithText(TextFormField, 'Email'), 'john@example.com');
      await tester.enterText(find.widgetWithText(TextFormField, 'Password'), '123');
      await tester.enterText(find.widgetWithText(TextFormField, 'Confirm Password'), '123');

      // Submit form
      final submitButton = find.widgetWithText(ElevatedButton, 'Create Account');
      await tester.tap(submitButton);
      await tester.pumpAndSettle();

      // Verify password validation message appears
      expect(find.textContaining('at least 8 characters'), findsOneWidget);
    });

    testWidgets('Password confirmation validation works', (WidgetTester tester) async {
      await tester.pumpWidget(MaterialApp(
        home: const RegisterScreen(),
        theme: AppTheme.lightTheme,
      ));

      // Fill form with mismatched passwords
      await tester.enterText(find.widgetWithText(TextFormField, 'First Name'), 'John');
      await tester.enterText(find.widgetWithText(TextFormField, 'Last Name'), 'Doe');
      await tester.enterText(find.widgetWithText(TextFormField, 'Email'), 'john@example.com');
      await tester.enterText(find.widgetWithText(TextFormField, 'Password'), 'ValidPassword123!');
      await tester.enterText(find.widgetWithText(TextFormField, 'Confirm Password'), 'DifferentPassword123!');

      // Submit form
      final submitButton = find.widgetWithText(ElevatedButton, 'Create Account');
      await tester.tap(submitButton);
      await tester.pumpAndSettle();

      // Verify password confirmation validation message appears
      expect(find.text('Passwords do not match'), findsOneWidget);
    });
  });
}
