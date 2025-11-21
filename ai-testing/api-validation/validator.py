import re
import json
from typing import Dict, List, Any
import uuid

class APIValidator:
    def __init__(self, requirements_file: str):
        with open(requirements_file, 'r') as f:
            self.requirements = json.load(f)
    
    def validate_request(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate request data against requirements"""
        errors = []
        
        for field, rules in self.requirements['request'].items():
            # Check if required field is present
            if rules.get('required', False) and field not in data:
                errors.append({
                    'field': field,
                    'message': f'{field} is required'
                })
                continue
            
            if field in data:
                value = data[field]
                
                # Type validation
                if rules['type'] == 'string' and not isinstance(value, str):
                    errors.append({
                        'field': field,
                        'message': f'{field} must be a string'
                    })
                    continue
                
                if rules['type'] == 'integer' and not isinstance(value, int):
                    errors.append({
                        'field': field,
                        'message': f'{field} must be an integer'
                    })
                    continue
                
                # Length validation for strings
                if isinstance(value, str):
                    if 'min_length' in rules and len(value) < rules['min_length']:
                        errors.append({
                            'field': field,
                            'message': f'{field} must be at least {rules["min_length"]} characters'
                        })
                    
                    if 'max_length' in rules and len(value) > rules['max_length']:
                        errors.append({
                            'field': field,
                            'message': f'{field} must be at most {rules["max_length"]} characters'
                        })
                
                # Range validation for integers
                if isinstance(value, int):
                    if 'min' in rules and value < rules['min']:
                        errors.append({
                            'field': field,
                            'message': f'{field} must be at least {rules["min"]}'
                        })
                    
                    if 'max' in rules and value > rules['max']:
                        errors.append({
                            'field': field,
                            'message': f'{field} must be at most {rules["max"]}'
                        })
                
                # Pattern validation
                if 'pattern' in rules and isinstance(value, str):
                    if rules['pattern'] == 'alphanumeric':
                        if not re.match(r'^[a-zA-Z0-9]+$', value):
                            errors.append({
                                'field': field,
                                'message': f'{field} must contain only alphanumeric characters'
                            })
                
                # Format validation
                if 'format' in rules and isinstance(value, str):
                    if rules['format'] == 'email':
                        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
                            errors.append({
                                'field': field,
                                'message': f'{field} must be a valid email address'
                            })
                    
                    if rules['format'] == 'uuid':
                        try:
                            uuid.UUID(value)
                        except ValueError:
                            errors.append({
                                'field': field,
                                'message': f'{field} must be a valid UUID'
                            })
        
        return {
            'valid': len(errors) == 0,
            'errors': errors
        }
    
    def generate_response(self, validation_result: Dict[str, Any], user_data: Dict[str, Any] = None) -> Dict[str, Any]:
        """Generate API response based on validation result"""
        if validation_result['valid']:
            return {
                'statusCode': 200,
                'status': 'success',
                'message': 'User registered successfully',
                'data': {
                    'userId': f"USR{str(hash(str(user_data)))[-6:].zfill(6)}"
                },
                'errors': []
            }
        else:
            return {
                'statusCode': 400,
                'status': 'Failed',
                'errors': validation_result['errors'],
                'message': 'Validation failed',
                'data': None
            }

# Test the validator
if __name__ == "__main__":
    # Test with valid data
    validator = APIValidator('requirements.json')
    
    valid_data = {
        'username': 'testuser123',
        'password': 'password123',
        'email': 'test@example.com',
        'age': 25,
        'deviceID': 'ABC1234567',
        'uuid': str(uuid.uuid4())
    }
    
    result = validator.validate_request(valid_data)
    response = validator.generate_response(result, valid_data)
    
    print("✅ Valid Data Test:")
    print(json.dumps(response, indent=2))
    
    # Test with invalid data
    invalid_data = {
        'username': 'usr',  # Too short
        'password': '123',  # Too short
        'email': 'invalid-email',  # Invalid format
        'age': 15,  # Too young
        'deviceID': '123'  # Too short
        # Missing uuid
    }
    
    result = validator.validate_request(invalid_data)
    response = validator.generate_response(result, invalid_data)
    
    print("\n❌ Invalid Data Test:")
    print(json.dumps(response, indent=2))