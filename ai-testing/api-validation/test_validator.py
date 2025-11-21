import pytest
import uuid
from validator import APIValidator

class TestAPIValidator:
    def setup_method(self):
        """Setup test fixtures"""
        self.validator = APIValidator('requirements.json')
    
    def test_valid_request(self):
        """Test with completely valid data"""
        valid_data = {
            'username': 'testuser123',
            'password': 'password123',
            'email': 'test@example.com',
            'age': 25,
            'deviceID': 'ABC1234567',
            'uuid': str(uuid.uuid4())
        }
        
        result = self.validator.validate_request(valid_data)
        assert result['valid'] == True
        assert len(result['errors']) == 0
    
    def test_missing_required_fields(self):
        """Test with missing required fields"""
        incomplete_data = {
            'username': 'testuser123',
            # Missing other required fields
        }
        
        result = self.validator.validate_request(incomplete_data)
        assert result['valid'] == False
        assert len(result['errors']) > 0
        
        # Check that all missing fields are reported
        error_fields = [error['field'] for error in result['errors']]
        assert 'password' in error_fields
        assert 'email' in error_fields
        assert 'age' in error_fields
    
    def test_username_validation(self):
        """Test username field validation"""
        # Too short
        data = {'username': 'usr'}
        result = self.validator.validate_request(data)
        assert not result['valid']
        
        # Too long
        data = {'username': 'a' * 20}
        result = self.validator.validate_request(data)
        assert not result['valid']
        
        # Non-alphanumeric
        data = {'username': 'user@123'}
        result = self.validator.validate_request(data)
        assert not result['valid']
    
    def test_email_validation(self):
        """Test email format validation"""
        invalid_emails = [
            'invalid-email',
            'test@',
            '@example.com',
            'test.example.com',
            'test@example'
        ]
        
        for email in invalid_emails:
            data = {'email': email}
            result = self.validator.validate_request(data)
            assert not result['valid']
            
        # Valid email
        data = {'email': 'test@example.com'}
        result = self.validator.validate_request(data)
        # Should not have email-related errors
        email_errors = [e for e in result['errors'] if e['field'] == 'email']
        assert len(email_errors) == 0
    
    def test_age_validation(self):
        """Test age range validation"""
        # Too young
        data = {'age': 15}
        result = self.validator.validate_request(data)
        assert not result['valid']
        
        # Too old
        data = {'age': 150}
        result = self.validator.validate_request(data)
        assert not result['valid']
        
        # Valid age
        data = {'age': 25}
        result = self.validator.validate_request(data)
        age_errors = [e for e in result['errors'] if e['field'] == 'age']
        assert len(age_errors) == 0
    
    def test_device_id_validation(self):
        """Test deviceID validation"""
        # Wrong length
        data = {'deviceID': '123'}
        result = self.validator.validate_request(data)
        assert not result['valid']
        
        # Valid deviceID
        data = {'deviceID': 'ABC1234567'}
        result = self.validator.validate_request(data)
        device_errors = [e for e in result['errors'] if e['field'] == 'deviceID']
        assert len(device_errors) == 0
    
    def test_uuid_validation(self):
        """Test UUID format validation"""
        # Invalid UUID
        data = {'uuid': 'invalid-uuid'}
        result = self.validator.validate_request(data)
        assert not result['valid']
        
        # Valid UUID
        data = {'uuid': str(uuid.uuid4())}
        result = self.validator.validate_request(data)
        uuid_errors = [e for e in result['errors'] if e['field'] == 'uuid']
        assert len(uuid_errors) == 0
    
    def test_response_generation_valid(self):
        """Test response generation for valid data"""
        valid_data = {
            'username': 'testuser123',
            'password': 'password123',
            'email': 'test@example.com',
            'age': 25,
            'deviceID': 'ABC1234567',
            'uuid': str(uuid.uuid4())
        }
        
        validation_result = self.validator.validate_request(valid_data)
        response = self.validator.generate_response(validation_result, valid_data)
        
        assert response['statusCode'] == 200
        assert response['status'] == 'success'
        assert 'userId' in response['data']
        assert response['data']['userId'].startswith('USR')
        assert len(response['errors']) == 0
    
    def test_response_generation_invalid(self):
        """Test response generation for invalid data"""
        invalid_data = {'username': 'usr'}  # Too short
        
        validation_result = self.validator.validate_request(invalid_data)
        response = self.validator.generate_response(validation_result, invalid_data)
        
        assert response['statusCode'] == 400
        assert response['status'] == 'Failed'
        assert len(response['errors']) > 0
        assert response['data'] is None

if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, '-v'])