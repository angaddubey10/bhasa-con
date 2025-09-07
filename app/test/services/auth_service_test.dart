import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:mockito/annotations.dart';
import 'package:bhasa_con_app/services/auth_service.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

// Generate mocks
@GenerateMocks([FlutterSecureStorage])
import 'auth_service_test.mocks.dart';

void main() {
  setUpAll(() {
    TestWidgetsFlutterBinding.ensureInitialized();
  });

  group('AuthService Enhanced Tests', () {
    late MockFlutterSecureStorage mockStorage;

    setUp(() {
      mockStorage = MockFlutterSecureStorage();
    });

    test('isAuthenticated returns false when no token exists', () async {
      // Mock storage to return null for auth token
      when(mockStorage.read(key: anyNamed('key'))).thenAnswer((_) async => null);
      
      final result = await AuthService.isAuthenticated();
      expect(result, isFalse);
    });

    test('isAuthenticated returns true when valid token exists', () async {
      // Mock storage to return a valid token
      when(mockStorage.read(key: anyNamed('key'))).thenAnswer((_) async => 'valid_token');
      
      final result = await AuthService.isAuthenticated();
      expect(result, isTrue);
    });

    test('isTokenExpired returns true for empty token', () {
      expect(AuthService.isTokenExpired(null), isTrue);
      expect(AuthService.isTokenExpired(''), isTrue);
    });

    test('isTokenExpired returns true for invalid JWT format', () {
      expect(AuthService.isTokenExpired('not-a-jwt-token'), isTrue);
      expect(AuthService.isTokenExpired('invalid.jwt'), isTrue);
    });

    test('isTokenExpired returns false for valid JWT structure', () {
      // Valid JWT structure (header.payload.signature)
      const validJwtStructure = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      expect(AuthService.isTokenExpired(validJwtStructure), isFalse);
    });

    test('clearAllData can be called without error', () async {
      // Mock storage deleteAll to succeed
      when(mockStorage.deleteAll()).thenAnswer((_) async {});
      
      await expectLater(AuthService.clearAllData(), completes);
    });

    test('clearAllData handles storage errors gracefully', () async {
      // Mock storage deleteAll to throw an exception
      when(mockStorage.deleteAll()).thenThrow(Exception('Storage error'));
      
      // Should not throw despite storage error
      await expectLater(AuthService.clearAllData(), completes);
    });
  });

  group('AuthService Token Handling', () {
    late MockFlutterSecureStorage mockStorage;

    setUp(() {
      mockStorage = MockFlutterSecureStorage();
    });

    test('getAuthToken handles storage errors gracefully', () async {
      // Mock storage to throw an exception
      when(mockStorage.read(key: anyNamed('key'))).thenThrow(Exception('Storage error'));
      
      final token = await AuthService.getAuthToken();
      expect(token, isNull);
    });

    test('getAuthToken returns stored token successfully', () async {
      const expectedToken = 'stored_auth_token';
      when(mockStorage.read(key: anyNamed('key'))).thenAnswer((_) async => expectedToken);
      
      final token = await AuthService.getAuthToken();
      expect(token, equals(expectedToken));
    });
  });
}
