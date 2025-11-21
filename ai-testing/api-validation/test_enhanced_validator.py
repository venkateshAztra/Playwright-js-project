import pytest
from validator import APIValidator as EnhancedAPIValidator

class TestEnhancedAPIValidator:
    def setup_method(self):
        """Setup test fixtures"""
        self.validator = EnhancedAPIValidator('enhanced_requirements.json')
    
    # INDEPENDENT REQUIREMENTS TESTS
    def test_independent_valid_data(self):
        """Test independent requirements with valid data"""
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'age': 25,
            'deviceID': 'DEV12345',
            'userType': 'GUEST'
        }
        
        errors = self.validator.validate_independent_requirements(data)
        assert len(errors) == 0
    
    def test_independent_missing_required(self):
        """Test independent requirements with missing required fields"""
        data = {'username': 'testuser'}  # Missing other required fields
        
        errors = self.validator.validate_independent_requirements(data)
        assert len(errors) > 0
        
        error_fields = [error['field'] for error in errors]
        assert 'email' in error_fields
        assert 'age' in error_fields
        assert 'userType' in error_fields
    
    def test_independent_invalid_enum(self):
        """Test independent requirements with invalid enum value"""
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'age': 25,
            'deviceID': 'DEV12345',
            'userType': 'INVALID_TYPE'  # Invalid enum value
        }
        
        errors = self.validator.validate_independent_requirements(data)
        assert len(errors) == 1
        assert errors[0]['field'] == 'userType'
        assert 'must be one of' in errors[0]['message']
    
    # DEPENDENT REQUIREMENTS TESTS
    def test_minor_requires_parental_consent(self):
        """Test that minors require parental consent (dependent requirement)"""
        minor_data = {
            'username': 'teen123',
            'email': 'teen@example.com',
            'age': 16,  # Minor
            'deviceID': 'REGULAR123',
            'userType': 'STUDENT'
            # Missing parental_consent
        }
        
        result = self.validator.validate_request(minor_data)
        assert not result['valid']
        assert len(result['dependent_errors']) > 0
        
        # Check for parental consent error
        consent_errors = [e for e in result['dependent_errors'] if e['field'] == 'parental_consent']
        assert len(consent_errors) > 0
    
    def test_minor_with_valid_consent(self):
        """Test minor with valid parental consent and proper deviceID"""
        minor_data = {
            'username': 'teen123',
            'email': 'teen@example.com',
            'age': 16,
            'deviceID': 'TEENABCD',  # Proper pattern for minor
            'userType': 'STUDENT',
            'parental_consent': True,
            'student_id': 'STU123456',
            'university_email': 'teen@university.edu'
        }
        
        result = self.validator.validate_request(minor_data)
        # Should have no dependent errors related to age
        age_related_errors = [e for e in result['dependent_errors'] 
                             if 'parental_consent' in e['field'] or 'deviceID' in e['field']]
        assert len(age_related_errors) == 0
    
    def test_student_requires_student_fields(self):
        """Test that STUDENT userType requires student-specific fields"""
        student_data = {
            'username': 'student123',
            'email': 'student@example.com',
            'age': 20,
            'deviceID': 'STUD12345',
            'userType': 'STUDENT'
            # Missing student_id and university_email
        }
        
        result = self.validator.validate_request(student_data)
        assert not result['valid']
        
        # Check for student-specific field errors
        student_errors = [e for e in result['dependent_errors'] 
                         if e['field'] in ['student_id', 'university_email']]
        assert len(student_errors) == 2
    
    def test_employee_requires_employee_fields(self):
        """Test that EMPLOYEE userType requires employee-specific fields"""
        employee_data = {
            'username': 'emp123',
            'email': 'emp@example.com',
            'age': 30,
            'deviceID': 'EMP12345',
            'userType': 'EMPLOYEE'
            # Missing employee_id and department
        }
        
        result = self.validator.validate_request(employee_data)
        assert not result['valid']
        
        # Check for employee-specific field errors
        emp_errors = [e for e in result['dependent_errors'] 
                     if e['field'] in ['employee_id', 'department']]
        assert len(emp_errors) == 2
    
    def test_admin_requires_admin_fields(self):
        """Test that ADMIN userType requires admin-specific fields"""
        admin_data = {
            'username': 'admin123',
            'email': 'admin@example.com',
            'age': 35,
            'deviceID': 'ADM12345',
            'userType': 'ADMIN'
            # Missing admin_code and security_clearance
        }
        
        result = self.validator.validate_request(admin_data)
        assert not result['valid']
        
        # Check for admin-specific field errors
        admin_errors = [e for e in result['dependent_errors'] 
                       if e['field'] in ['admin_code', 'security_clearance']]
        assert len(admin_errors) == 2
    
    def test_corporate_email_requires_strong_security(self):
        """Test that corporate email domains require enhanced security"""
        corporate_data = {
            'username': 'corp123',
            'email': 'user@company.com',  # Corporate domain
            'age': 30,
            'deviceID': 'CORP12345',
            'userType': 'EMPLOYEE',
            'employee_id': 'EMP12345',
            'department': 'IT',
            'password': 'weak123',  # Too weak for corporate
            # Missing two_factor_auth
        }
        
        result = self.validator.validate_request(corporate_data)
        assert not result['valid']
        
        # Check for corporate security errors
        security_errors = [e for e in result['dependent_errors'] 
                          if e['field'] in ['password', 'two_factor_auth']]
        assert len(security_errors) == 2
    
    # RESPONSE GENERATION TESTS
    def test_student_response_format(self):
        """Test that student users get student-specific response format"""
        student_data = {
            'username': 'student123',
            'email': 'student@university.edu',
            'age': 20,
            'deviceID': 'STUD12345',
            'userType': 'STUDENT',
            'student_id': 'STU123456',
            'university_email': 'student@university.edu'
        }
        
        result = self.validator.validate_request(student_data)
        response = self.validator.generate_response(result, student_data)
        
        assert response['statusCode'] == 200
        assert response['data']['userId'].startswith('STU')
        assert response['data']['access_level'] == 'BASIC'
        assert 'expires_at' in response['data']
        assert 'student_portal_access' in response['data']
    
    def test_employee_response_format(self):
        """Test that employee users get employee-specific response format"""
        employee_data = {
            'username': 'emp123',
            'email': 'emp@example.com',
            'age': 30,
            'deviceID': 'EMP12345',
            'userType': 'EMPLOYEE',
            'employee_id': 'EMP12345',
            'department': 'IT'
        }
        
        result = self.validator.validate_request(employee_data)
        response = self.validator.generate_response(result, employee_data)
        
        assert response['statusCode'] == 200
        assert response['data']['userId'].startswith('EMP')
        assert response['data']['access_level'] == 'STANDARD'
        assert response['data']['department_access'] == True
        assert response['data']['department'] == 'IT'
    
    def test_admin_response_format(self):
        """Test that admin users get admin-specific response format"""
        admin_data = {
            'username': 'admin123',
            'email': 'admin@example.com',
            'age': 35,
            'deviceID': 'ADM12345',
            'userType': 'ADMIN',
            'admin_code': 'ADMXYZ123',
            'security_clearance': 'HIGH'
        }
        
        result = self.validator.validate_request(admin_data)
        response = self.validator.generate_response(result, admin_data)
        
        assert response['statusCode'] == 200
        assert response['data']['userId'].startswith('ADM')
        assert response['data']['access_level'] == 'FULL'
        assert response['data']['admin_privileges'] == True
        assert response['data']['security_clearance'] == 'HIGH'
    
    def test_error_breakdown_in_response(self):
        """Test that error responses include breakdown of independent vs dependent errors"""
        invalid_data = {
            'username': 'usr',  # Too short (independent error)
            'age': 16,  # Minor without consent (dependent error)
            'userType': 'STUDENT'  # Missing student fields (dependent error)
        }
        
        result = self.validator.validate_request(invalid_data)
        response = self.validator.generate_response(result, invalid_data)
        
        assert response['statusCode'] == 400
        assert 'error_breakdown' in response
        assert response['error_breakdown']['independent_errors'] > 0
        assert response['error_breakdown']['dependent_errors'] > 0

if __name__ == "__main__":
    # Run tests
    pytest.main([__file__, '-v'])