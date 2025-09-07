// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility in the flutter_test package. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:flutter_test/flutter_test.dart';

import 'package:bhasa_con_app/main.dart';

void main() {
  testWidgets('App starts with splash screen', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(const BhasaConApp());

    // Verify that our app shows the splash screen initially
    expect(find.text('Bhasa Con'), findsOneWidget);
    expect(find.text('Connect Through Language'), findsOneWidget);
    // Splash screens don't show loading indicators
    
    // Pump and settle to handle any pending timers from the splash screen
    await tester.pumpAndSettle(const Duration(seconds: 2));
  });
}
