# Requirements Document

## Introduction

This feature addresses performance and reliability issues with the "Copy Public URL" functionality in the testimonials application. Currently, users experience a 4+ second delay when copying URLs from the groups page and testimonial detail page, and the copied URLs contain "undefined" instead of the proper domain. The settings page works correctly, so we need to align the other components with that implementation.

## Requirements

### Requirement 1

**User Story:** As a user viewing the groups page, I want to copy the public URL instantly, so that I can share testimonials without waiting.

#### Acceptance Criteria

1. WHEN I click the "Share Public URL" option in the export dropdown on the groups page THEN the URL SHALL be copied to clipboard within 200ms
2. WHEN the URL is copied THEN the system SHALL display a success toast message immediately
3. WHEN public sharing is disabled THEN the system SHALL show an appropriate message directing users to enable it in settings

### Requirement 2

**User Story:** As a user viewing a single testimonial, I want to copy the public URL instantly, so that I can share specific testimonials without delay.

#### Acceptance Criteria

1. WHEN I click the "Share Public URL" option in the export dropdown on the testimonial detail page THEN the URL SHALL be copied to clipboard within 200ms
2. WHEN the URL is copied THEN the system SHALL display a success toast message immediately
3. WHEN public sharing is disabled THEN the system SHALL show an appropriate message directing users to enable it in settings

### Requirement 3

**User Story:** As a user, I want the copied URLs to contain the correct domain, so that the links work properly when shared.

#### Acceptance Criteria

1. WHEN a public URL is copied THEN it SHALL contain the proper domain instead of "undefined"
2. WHEN the environment variable NEXT_PUBLIC_APP_URL is not set THEN the system SHALL use window.location.origin as fallback
3. WHEN the URL is generated THEN it SHALL follow the format: {domain}/p/{publicSlug}

### Requirement 4

**User Story:** As a user, I want consistent behavior across all pages, so that the copy URL functionality works the same everywhere.

#### Acceptance Criteria

1. WHEN I copy URLs from any page (settings, groups, testimonial detail) THEN the behavior SHALL be consistent
2. WHEN public sharing is enabled THEN all pages SHALL generate the same URL format
3. WHEN public sharing is disabled THEN all pages SHALL show the same guidance message