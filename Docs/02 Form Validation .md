# Form Validation with YUP in Strapi

This document explains how to implement robust form validation using YUP in Strapi controllers, based on the implementation in `yonga-contact-form` controller.

## Overview

YUP is a JavaScript schema validation library that provides a clean API for data validation. In Strapi controllers, it's used to validate incoming form data before processing and database insertion.

## Basic Setup

### 1. Install YUP

```bash
npm install yup
```

### 2. Import YUP in Controller

```javascript
const yup = require('yup');
```

## Schema Definition

### Basic Schema Structure

```javascript
const contactFormSchema = yup.object().shape({
  // Required fields with validation
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  message: yup.string().required('Message is required'),
  phone: yup.string().required('Phone is required'),
  
  // Boolean fields for checkboxes
  privacy_check: yup.boolean().required('Privacy check is required'),
  campaign_check: yup.boolean().required('Campaign check is required'),
  
  // Optional fields
  customer_no: yup.string().optional(),
  city: yup.string().optional(),
  topic: yup.string().optional(),
  
  // System fields (optional)
  leadSalesforceID: yup.string().optional(),
  leadSalesforceResponse: yup.string().optional(),
}).noUnknown(false); // Allow extra fields not defined in schema
```

### Key Schema Options

- **`.required(message)`**: Makes field mandatory with custom error message
- **`.email(message)`**: Validates email format
- **`.optional()`**: Makes field optional
- **`.noUnknown(false)`**: Allows extra fields not defined in schema (security consideration)

## Field Filtering for Security

### Allowed Fields List

Define which fields are permitted in the database to prevent injection of unwanted data:

```javascript
const allowedFields = [
  'name',
  'email', 
  'phone',
  'customer_no',
  'city',
  'topic',
  'message',
  'privacy_check',
  'campaign_check',
  'leadSalesforceID',
  'leadSalesforceResponse'
];
```

### Data Filtering Implementation

```javascript
// Filter data to only include fields that exist in the database schema
const filteredData = Object.keys(data)
  .filter(key => allowedFields.includes(key))
  .reduce((obj, key) => {
    obj[key] = data[key];
    return obj;
  }, {});
```

## Validation Implementation in Controller

### Complete Validation Flow

```javascript
async create(ctx) {
  try {
    // 1. Extract data from request
    const { data } = ctx.request.body || {};
    
    // 2. Validate against YUP schema
    await contactFormSchema.validate(data, { 
      abortEarly: false,     // Collect all validation errors
      stripUnknown: false    // Don't strip unknown fields yet
    });
    
    // 3. Filter data for security
    const filteredData = Object.keys(data)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {});
    
    // 4. Log extra fields for debugging
    const extraFields = Object.keys(data).filter(key => !allowedFields.includes(key));
    if (extraFields.length > 0) {
      strapi.log.debug(`[Contact Form] Received extra fields (ignored): ${extraFields.join(', ')}`);
    }
    
    // 5. Override request body with filtered data
    ctx.request.body = { data: filteredData };
    
    // 6. Process with parent controller
    await super.create(ctx);
    
    // 7. Return custom success response
    return {
      success: true,
      message: "Form submitted successfully",
      timestamp: new Date().toISOString(),
      formType: "zirveyazilim-contact"
    };
    
  } catch (error) {
    // Handle validation errors
    ctx.response.status = 400;
    return {
      success: false,
      message: "Form submission failed",
      timestamp: new Date().toISOString(),
      error: {
        status: 400,
        name: 'ValidationError',
        message: 'Validation failed',
        details: error.errors || [error.message]
      }
    };
  }
}
```

## Validation Options

### Key Validation Parameters

- **`abortEarly: false`**: Collects all validation errors instead of stopping at first error
- **`stripUnknown: false`**: Preserves unknown fields for manual filtering (security)

## Error Handling Best Practices

### Structured Error Response

```javascript
{
  success: false,
  message: "Form submission failed",
  timestamp: new Date().toISOString(),
  error: {
    status: 400,
    name: 'ValidationError',
    message: 'Validation failed',
    details: error.errors || [error.message]
  }
}
```

### Error Types Handled

1. **Validation Errors**: Field-specific validation failures
2. **Required Field Errors**: Missing mandatory fields
3. **Format Errors**: Invalid email, phone, etc.
4. **Type Errors**: Boolean/string type mismatches

## Security Considerations

### 1. Field Whitelisting

Always use an allowed fields list to prevent:
- SQL injection attempts
- Database schema pollution
- Unauthorized field modifications

### 2. Extra Field Logging

Log unexpected fields for security monitoring:

```javascript
const extraFields = Object.keys(data).filter(key => !allowedFields.includes(key));
if (extraFields.length > 0) {
  strapi.log.debug(`[Contact Form] Received extra fields (ignored): ${extraFields.join(', ')}`);
}
```

### 3. Data Sanitization

Filter data before database insertion to ensure only expected fields are processed.

## Advanced Validation Patterns

### Custom Validation Rules

```javascript
const schema = yup.object().shape({
  phone: yup.string()
    .required('Phone is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/, 'Invalid phone format'),
  
  email: yup.string()
    .email('Invalid email format')
    .required('Email is required')
    .lowercase(),
    
  age: yup.number()
    .positive('Age must be positive')
    .integer('Age must be an integer')
    .min(18, 'Must be at least 18 years old')
});
```

### Conditional Validation

```javascript
const schema = yup.object().shape({
  hasCompany: yup.boolean(),
  companyName: yup.string().when('hasCompany', {
    is: true,
    then: yup.string().required('Company name is required when "Has Company" is checked'),
    otherwise: yup.string().nullable()
  })
});
```

## Testing Validation

### Unit Test Example

```javascript
describe('Contact Form Validation', () => {
  test('should validate required fields', async () => {
    const invalidData = { name: '', email: 'invalid-email' };
    
    try {
      await contactFormSchema.validate(invalidData);
    } catch (error) {
      expect(error.errors).toContain('Name is required');
      expect(error.errors).toContain('Invalid email');
    }
  });
  
  test('should allow optional fields', async () => {
    const validData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Test message',
      phone: '+1234567890',
      privacy_check: true,
      campaign_check: false,
      city: 'New York' // optional field
    };
    
    const result = await contactFormSchema.validate(validData);
    expect(result).toBeDefined();
  });
});
```

## Common YUP Validation Methods

### String Validations
- `.required(message)` - Field is mandatory
- `.email(message)` - Valid email format
- `.min(limit, message)` - Minimum length
- `.max(limit, message)` - Maximum length
- `.matches(regex, message)` - Pattern matching
- `.lowercase()` - Convert to lowercase
- `.uppercase()` - Convert to uppercase
- `.trim()` - Remove whitespace

### Number Validations
- `.positive(message)` - Positive numbers only
- `.negative(message)` - Negative numbers only
- `.integer(message)` - Integer values only
- `.min(limit, message)` - Minimum value
- `.max(limit, message)` - Maximum value

### Boolean Validations
- `.required(message)` - Must be true/false
- `.oneOf([true], message)` - Must be true (for checkboxes)

### Array Validations
- `.of(schema)` - Validate array items
- `.min(limit, message)` - Minimum array length
- `.max(limit, message)` - Maximum array length

## Best Practices

1. **Always validate on server side** - Client-side validation is for UX only
2. **Use descriptive error messages** - Help users understand what went wrong
3. **Filter unknown fields** - Prevent database pollution and security issues
4. **Log validation attempts** - Monitor for potential security threats
5. **Return consistent error format** - Standardize API responses
6. **Test validation thoroughly** - Cover edge cases and invalid inputs
7. **Keep validation schemas maintainable** - Document complex validation rules

## Integration with Strapi Content Types

Ensure your YUP schema matches your Strapi content type schema:

1. Required fields in YUP should match required fields in content type
2. Field types should be compatible (string, boolean, number)
3. Validation rules should align with content type constraints
4. Consider using YUP schema to generate content type schemas for consistency
