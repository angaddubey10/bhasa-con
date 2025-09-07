import 'package:flutter_test/flutter_test.dart';
import 'package:bhasa_con_app/services/app_initialization_service.dart';
import 'package:bhasa_con_app/models/user.dart';

void main() {
  setUpAll(() {
    TestWidgetsFlutterBinding.ensureInitialized();
  });

  group('AppInitializationService', () {
    setUp(() {
      // Reset service state before each test
      AppInitializationService.reset();
    });

    test('initial state after reset is unauthenticated', () {
      expect(AppInitializationService.currentState, InitializationState.unauthenticated);
    });

    test('initialize returns false when no auth token exists', () async {
      // Note: In real implementation, this would need proper mocking
      // For now, this is a basic test structure that tests unauthenticated flow
      
      final result = await AppInitializationService.initialize();
      expect(result, false);
      expect(AppInitializationService.currentState, InitializationState.unauthenticated);
    });

    test('markAsAuthenticated updates state correctly', () {
      final user = User(
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        bio: 'Test bio',
        createdAt: DateTime.now(),
      );

      AppInitializationService.markAsAuthenticated(user);
      
      expect(AppInitializationService.currentState, InitializationState.authenticated);
      expect(AppInitializationService.currentUser, user);
      expect(AppInitializationService.errorMessage, null);
    });

    test('reset clears state correctly', () {
      final user = User(
        id: '1',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        bio: 'Test bio',
        createdAt: DateTime.now(),
      );

      AppInitializationService.markAsAuthenticated(user);
      AppInitializationService.reset();
      
      expect(AppInitializationService.currentState, InitializationState.unauthenticated);
      expect(AppInitializationService.currentUser, null);
      expect(AppInitializationService.errorMessage, null);
    });
  });
}
