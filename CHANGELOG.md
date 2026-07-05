# Changelog

All notable changes to this project will be documented in this file.


The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.67] - 2025-07-08

### Added
  - zirveyazilim-dealer-application s controller updated

## [1.0.66] - 2025-07-07

### Added
- Created comprehensive Zirveyazilim Landing Form API with modern Strapi v5 structure
- Implemented landing form controller with UTM tracking and campaign data support
- Added Salesforce sync functionality (`syncSalesforce()`) for landing form leads
- Created custom routes for landing form including sync endpoint
- Integrated landing form sync into automated cron job system
- Added activity field mapping (sirket, malimusavir, bagimsizmm, isortaklari) to business-friendly names
- Implemented comprehensive validation schema with YUP for all landing form fields
- Added phone number formatting with automatic Turkish country code handling

### Enhanced
- Landing form supports full UTM parameter tracking (source, medium, campaign, term, content)
- Added GCLID and FBID tracking for Google Ads and Facebook integration
- Implemented data import support with custom timestamp handling
- Added field filtering and validation for security compliance
- Enhanced error handling with structured responses and detailed logging
- Added real-time Salesforce integration during form submission

### Fixed
- Corrected environment variable access pattern from `strapi.config.get()` to `process.env`
- Fixed field name inconsistency: `salesfoceID` → `salesforceID` throughout codebase
- Updated Salesforce retry logic to use `process.env.SF_MAX_TRIES`
- Standardized environment variable checks to use `.toLowerCase()` comparison
- Fixed filter conditions in sync queries to use correct field names

### Changed
- Updated landing form controller to match mukellef form structural patterns
- Migrated from basic factory controller to full-featured modern implementation
- Enhanced cron job configuration to include landing form sync processing
- Standardized error handling and retry mechanisms across form types
- Updated routes configuration with proper auth scopes and endpoint descriptions

### Technical
- Added proper TypeScript typing for landing form data structures
- Implemented component-based validation with field whitelisting
- Created consistent logging patterns for debugging and monitoring
- Enhanced Salesforce integration with proper error recovery
- Added comprehensive field mapping for Salesforce APEX class compatibility

## [1.0.7] - 2025-07-07
 - Swagger Documentation plugin added  https://docs.strapi.io/cms/plugins/documentation
 - Strapi cloud removed 
 - Vite config domains added



## [1.0.6] - 2025-07-07

### Added
- Created comprehensive Zirveyazilim Mukellef Form API with full CRUD functionality
- Implemented mukellef (taxpayer) referral form with validation schema for multiple referrals
- Added Salesforce sync functionality (`syncSalesforce()`) for mukellef forms
- Created mukellef form schema with components for referral data structure
- Integrated mukellef form sync into automated cron job system
- Added `zirveyazilim-create-mukellef` endpoint support in global Salesforce service
- Created Postman collection generator from URL-encoded form data
- Added comprehensive data transformation for mukellef forms in Salesforce service

### Enhanced
- Mukellef form supports multiple referral entries with `mukellefler` array structure
- Each referral includes: `fullname`, `cari_unvan` (company), `phone` contact details
- Added VKN (tax number) validation and city/district location fields
- Integrated KVKK privacy and campaign consent tracking
- Added comprehensive UTM and tracking parameter support
- Implemented robust error handling for Salesforce empty responses
- Enhanced logging for debugging Salesforce API communication

### Fixed
- Resolved critical Salesforce environment variable issue (`SF_ACTIVE` vs `SF_ENABLED`)
- Fixed case sensitivity problem with environment variables (`TRUE` vs `true`)
- Updated global Salesforce service to use correct `process.env.SF_ENABLED` checks
- Fixed JSON parsing errors for empty Salesforce responses
- Corrected Salesforce field mapping (`LeadSalesforceId` vs `LeadSalesforceIds`)
- Enhanced error handling to properly update `salesforceResponse`, `salesforceID`, and `salesforceRetryCount`

### Changed
- Updated cron sync job to include zirveyazilim-mukellef-form processing
- Improved Salesforce response handling to accept empty successful responses
- Enhanced global Salesforce service with better error logging and debugging
- Updated mukellef controller to use global Salesforce service for consistency
- Modified sync logic to follow same pattern as contact and product forms

### Technical
- Added proper TypeScript typing for mukellef form data structures
- Implemented field filtering and validation for security compliance
- Created component-based schema for repeatable mukellef referral data
- Added comprehensive field mapping for Salesforce APEX class compatibility
- Enhanced phone number formatting and validation utilities

## [1.0.5] - 2024-12-19

### Added
- Created comprehensive Zirveyazilim Product Form API with full CRUD functionality
- Implemented product form validation schema with all product-specific fields
- Added Salesforce sync functionality (`syncSalesforce()`) for product forms
- Created product form schema with UTM tracking, activity types, and marketing fields
- Added comprehensive field filtering and validation for security

### Changed
- Modernized both contact form and product form controllers to use ES6 imports/exports
- Replaced CommonJS `require()`/`module.exports` with modern `import`/`export` syntax
- Updated TypeScript typing with proper type annotations for filtered data
- Standardized module system across entire project for consistency
- Renamed sync function from `syncZirveyazilimProductForm` to `syncSalesforce`

### Fixed
- Resolved TypeScript errors for filtered data type assignments
- Fixed string comparison issues in Salesforce configuration checks
- Added proper type casting for environment variable comparisons
- Improved type safety across both form controllers

### Enhanced
- Product form supports activity types: sirket, malimusavir, malimusavir_bagimli, egitim, bagimsizmm, isortaklari
- Added UTM tracking fields: utmSource, utmMedium, utmCampaign, utmTerm, utmContent
- Integrated Google Ads (GCLID) and Facebook (FBID) tracking capabilities
- Added comprehensive error handling and validation messaging
- Implemented data import support with custom timestamp handling

## [1.0.4] - 2025-06-30

### Added
- Implemented Strapi v5 cron jobs system with automated Salesforce sync
- Created `strapi-api/config/cron-tasks.ts` with named job structure
- Added `salesforceSyncJob` running every 10 minutes for failed lead synchronization
- Added `salesforceHealthCheck` running hourly for endpoint connectivity monitoring
- Implemented global Salesforce service at `strapi-api/src/api/global/services/salesforce.ts`
- Added multi-domain support (Zirve, Mikro) with different endpoints
- Created content-type specific endpoint mapping and data transformation
- Added Turkish phone number and email formatting utilities
- Implemented retry mechanisms with configurable `SF_MAX_TRIES` environment variable
- Added comprehensive form validation documentation in `Docs/02 Form Validation .md`
- Created `salesforceRetryCount` field for tracking sync attempts per lead

### Changed
- Migrated from Strapi v3 cron structure to v5 format (object-based named jobs)
- Updated controller to use Strapi v5 Document Service API instead of Entity Service
- Replaced `strapi.query().find()` with `strapi.documents().findMany()`
- Changed field references from `id` to `documentId` for v5 compatibility
- Restructured environment variables to domain-first naming convention:
  - `SF_AUTH_URL_ZIRVE` → `SF_ZIRVE_AUTH_URL`
  - `SF_LEAD_URL_CONTACT` → `SF_ZIRVE_CREATE_LEAD`
  - Added consistent `SF_ZIRVE_*` and `SF_MIKRO_*` prefixes
- Updated field names to match schema:
  - `leadSalesforceResponse` → `salesforceResponse`
  - `leadSalesforceID` → `salesforceID`
- Renamed controller function `syncZirveSalesforceCreateLead` → `syncZirveyazilimContactForm`
- Replaced `lastSyncAttempt` with `salesforceRetryCount` increment logic
- Added timezone support (`Europe/Istanbul`) for cron jobs
- Enabled cron jobs in server configuration with `CRON_ENABLED` environment variable

### Enhanced
- Improved error handling with structured responses and detailed logging
- Added authentication handling with embedded credentials in URLs
- Implemented health check functionality for all Salesforce endpoints
- Added data filtering to prevent unwanted field injection in form submissions
- Enhanced YUP validation with field whitelisting and security measures
- Added comprehensive logging for debugging and monitoring

### Fixed
- Resolved TypeScript declaration conflicts in Salesforce service
- Fixed Strapi v5 query API compatibility issues
- Corrected cron job context handling (removed unnecessary mockCtx)
- Updated filter syntax to use `$and` and `$or` operators properly
- Fixed retry count logic to prevent infinite sync loops

## [1.0.3] - 2025-03-05

### Added
- Implemented CSRF protection for the API
- Created CSRF token generation endpoint at `/api/csrf-token`
- Added CSRF validation middleware for all mutation requests
- Integrated CSRF protection with the contact form submission
- Added detailed documentation in `Docs/CSRF-Protection.md`

### Changed
- Updated contact form controller to validate CSRF tokens
- Modified routes configuration to support CSRF protection
- Enhanced error handling for token validation
- Updated CORS configuration to support secure cross-origin requests

### Fixed
- Fixed route configuration for contact form to use proper auth object format
- Improved error messages for CSRF validation failures
- Added debugging logs for CSRF token validation

## [1.0.2] - 2025-03-05

### Changed
- Migrated entire codebase from JavaScript to TypeScript
- Updated all API endpoints to use TypeScript syntax
- Converted controllers to use proper type definitions
- Updated plugin configurations to TypeScript format

### Added
- Created shared types file for API responses (api-responses.ts)
- Type definitions for form validations using Yup
- Proper error handling with TypeScript types
- Migration documentation in `.cursor/migrate-esm-ts.mdc`

### Updated
- Contact form API with TypeScript validation
- Subscribe form API with TypeScript implementation
- Redirect API with proper enumeration types
- Email plugin configuration with TypeScript interfaces

### Fixed
- Redirect enumeration values to comply with Strapi v5 requirements
- Error handling patterns to match Strapi v5 TypeScript conventions
- Response formats for consistency across all endpoints

## [1.0.1] - 2025-02-27

### Changed
- Migrated entire codebase from JavaScript to TypeScript
- Updated all API endpoints to use TypeScript syntax
- Converted controllers to use proper type definitions
- Updated plugin configurations to TypeScript format

### Added
- Created shared types file for API responses (api-responses.ts)
- Type definitions for form validations using Yup
- Proper error handling with TypeScript types
- Migration documentation in `.cursor/migrate-esm-ts.mdc`

### Updated
- Contact form API with TypeScript validation
- Subscribe form API with TypeScript implementation
- Redirect API with proper enumeration types
- Email plugin configuration with TypeScript interfaces

### Fixed
- Redirect enumeration values to comply with Strapi v5 requirements
- Error handling patterns to match Strapi v5 TypeScript conventions
- Response formats for consistency across all endpoints

## [1.0.0] - 2025-02-27

- Strapi V5 Installation