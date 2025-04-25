# Alert System

The alert system is a core component of the AWS Monitor platform that detects, tracks, and manages security issues across AWS resources. This document explains how alerts are created, managed, and displayed in the platform.

## Alert Data Model

Alerts are stored in a database with the following structure:

- `id`: Unique identifier for the alert
- `title`: Alert title describing the issue
- `description`: Detailed description of the security issue
- `resourceId`: AWS resource identifier affected by the issue
- `resourceType`: Type of AWS resource (e.g., EC2Instance, IAMUser, SecurityGroup)
- `severity`: Severity level (CRITICAL, HIGH, MEDIUM, LOW)
- `status`: Current status (active, dismissed, resolved)
- `createdAt`: Timestamp when the alert was created
- `updatedAt`: Timestamp when the alert was last updated
- `credentialId`: Reference to the AWS credential used to discover the alert

## Alert Generation Process

Alerts are generated through several processes:

1. **Scheduled Scans**: Automated security scans run periodically to check AWS resources
2. **Manual Scans**: User-initiated scans from the Security dashboard
3. **Real-time Monitoring**: Continuous monitoring of AWS events through AWS APIs

### Scanning Process Flow

1. User selects an AWS credential profile for scanning
2. The platform connects to the AWS API using the selected credentials
3. Security services scan specific resource types for vulnerabilities:
   - `IAMSecurityService`: Scans IAM users, roles, and policies
   - `EC2SecurityService`: Scans EC2 instances, security groups, and volumes
   - `VulnerabilityService`: Comprehensive scanning across multiple AWS services
4. Security issues are identified based on best practices and compliance requirements
5. Each security issue is converted to an alert via the `createAlertFromSecurityIssue` function
6. Alerts are stored in the database and displayed in the dashboard

## Alert Management

The platform provides several ways to manage alerts:

- **Filtering**: Filter alerts by severity, status, resource type, and AWS credential
- **Dismissing**: Mark alerts as dismissed to acknowledge them without resolving
- **Resolving**: Mark alerts as resolved after addressing the security issue
- **Detailed View**: View detailed information about an alert by clicking on it

## Alert API Endpoints

The platform includes several API endpoints for alert management:

- `GET /api/alerts`: Retrieve alerts with optional filtering
- `PATCH /api/alerts`: Update alert status (dismiss or resolve)
- `POST /api/alerts/iam`: Trigger IAM security scan
- `POST /api/alerts/scan`: Trigger comprehensive security scan
- `GET /api/alerts/ec2`: Retrieve EC2-specific alerts

## Alert Display Components

Alerts are displayed in the Security dashboard with the following components:

- **Alert Summary Cards**: Display counts of alerts by severity
- **Alert List**: Filterable, sortable list of all alerts
- **Alert Detail Modal**: Detailed view of a specific alert
- **Alert Status Badges**: Visual indicators of alert severity and status 