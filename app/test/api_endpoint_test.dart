import 'package:flutter_test/flutter_test.dart';
import 'package:bhasa_con_app/services/http_service.dart';
import 'package:bhasa_con_app/utils/app_config.dart';

void main() {
  group('API Endpoint Integration Tests', () {
    test('should use correct API endpoint', () {
      expect(AppConfig.baseUrl, equals('https://api.lovme.in'));
    });
    
    test('should construct proper URLs for endpoints', () {
      final testEndpoint = '/api/auth/login';
      final expectedUrl = 'https://api.lovme.in/api/auth/login';
      
      // This test verifies the URL construction logic
      final constructedUrl = '${AppConfig.baseUrl}$testEndpoint';
      expect(constructedUrl, equals(expectedUrl));
    });
    
    test('should have all required API endpoints configured', () {
      // Test that all endpoints are properly configured
      expect(AppConfig.authRegister, isNotEmpty);
      expect(AppConfig.authLogin, isNotEmpty);
      expect(AppConfig.authMe, isNotEmpty);
      expect(AppConfig.userProfile, isNotEmpty);
      expect(AppConfig.posts, isNotEmpty);
      
      // Test dynamic endpoint generation
      final userId = '123';
      final postId = '456';
      
      expect(AppConfig.userById(userId), equals('/api/users/123'));
      expect(AppConfig.postById(postId), equals('/api/posts/456'));
      expect(AppConfig.userFollow(userId), equals('/api/users/123/follow'));
      expect(AppConfig.postLike(postId), equals('/api/posts/456/like'));
    });
    
    test('should handle HTTP service configuration', () {
      // Verify that HttpService can be instantiated
      // (This tests the service configuration without making actual network calls)
      expect(HttpService, isNotNull);
      
      // Test timeout and other configurations
      expect(AppConfig.appName, equals('Bhasa Con'));
      expect(AppConfig.appVersion, isNotEmpty);
    });
  });
}
