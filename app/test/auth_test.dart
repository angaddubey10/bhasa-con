import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';

import 'package:bhasa_con_app/main.dart';
import 'package:bhasa_con_app/screens/auth/register_screen.dart';

void main() {
  group('Authentication UI Tests', () {
    testWidgets('App starts with splash screen', (WidgetTester tester) async {
      await tester.pumpWidget(const BhasaConApp());

      // Since app now starts with splash screen, verify it shows
      expect(find.text('Bhasa Con'), findsOneWidget);
      expect(find.text('Connect Through Language'), findsOneWidget);
      
      // Wait for splash screen navigation to complete
      await tester.pumpAndSettle(const Duration(seconds: 2));
    });

    testWidgets('Registration screen displays properly', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: RegisterScreen()));

      // Verify registration screen elements are present
      expect(find.text('Join Bhasa Con'), findsOneWidget);
      expect(find.byType(TextFormField), findsWidgets); // Should find multiple form fields
      
      // Verify form fields by their hint text or labels
      expect(find.text('First Name'), findsOneWidget);
      expect(find.text('Last Name'), findsOneWidget);
      expect(find.text('Email'), findsOneWidget);
      expect(find.text('Password'), findsOneWidget);
    });

    testWidgets('Registration form validation shows errors for empty fields', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: RegisterScreen()));

      // Find the submit button by its type instead of text to avoid ambiguity
      final submitButtons = find.byType(ElevatedButton);
      expect(submitButtons, findsAtLeastNWidgets(1));
      
      // Tap the first ElevatedButton (should be the submit button)
      await tester.tap(submitButtons.first);
      await tester.pumpAndSettle();

      // Verify validation messages appear (these depend on your actual validation logic)
      // Note: Update these expectations based on your actual validation messages
      expect(find.textContaining('required'), findsAtLeastNWidgets(1));
    });

    testWidgets('Email field accepts text input', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: RegisterScreen()));

      // Find email field by looking for TextFormField near Email text
      final emailFields = find.byType(TextFormField);
      expect(emailFields, findsAtLeastNWidgets(1));

      // Enter text in what should be the email field (typically the 3rd field: firstName, lastName, email)
      if (emailFields.evaluate().length >= 3) {
        await tester.enterText(emailFields.at(2), 'test@example.com');
        await tester.pump();

        // Verify text was entered
        expect(find.text('test@example.com'), findsOneWidget);
      }
    });

    testWidgets('Password fields can be filled', (WidgetTester tester) async {
      await tester.pumpWidget(const MaterialApp(home: RegisterScreen()));

      final passwordFields = find.byType(TextFormField);
      expect(passwordFields, findsAtLeastNWidgets(1));

      // If we have enough fields, test password entry
      if (passwordFields.evaluate().length >= 4) {
        await tester.enterText(passwordFields.at(3), 'testPassword123');
        await tester.pump();

        // Password fields typically obscure text, so we can't check the actual text
        // Instead, check that the field accepted the input by verifying controller state
        final passwordField = tester.widget<TextFormField>(passwordFields.at(3));
        expect(passwordField.controller?.text, equals('testPassword123'));
      }
    });
  });
}
