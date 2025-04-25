# IAM Security Management

The IAM (Identity and Access Management) security module is a critical component of the AWS Monitor platform that provides comprehensive monitoring, alerting, and management of AWS IAM resources. This document explains how IAM security is implemented in the platform.

## IAM Security Scanning

The platform performs comprehensive IAM security scanning to identify security issues and compliance violations:

### Scanning Process

1. User initiates an IAM scan from the Security dashboard or IAM dashboard
2. The `IAMSecurityService` connects to AWS using the selected credentials
3. The service scans several IAM components:
   - IAM users and their access keys
   - IAM roles and their trust policies
   - IAM policies and their permissions
   - Password policies and MFA configurations
4. Security issues are identified based on AWS best practices and compliance standards
5. Issues are converted to alerts with appropriate severity levels
6. Alerts are stored in the database and displayed in the dashboard

### IAM Security Checks

The platform performs the following security checks for IAM:

- **Access Key Age**: Identifies access keys older than 90 days
- **Inactive Users**: Finds IAM users without recent activity
- **MFA Enforcement**: Ensures MFA is enabled for all IAM users
- **Password Policy Strength**: Checks password policy configuration
- **Permission Boundaries**: Verifies proper use of permission boundaries
- **Privilege Escalation**: Identifies potential privilege escalation paths
- **Unused Credentials**: Identifies credentials not used in the last 90 days
- **Root Account Usage**: Monitors use of the root account
- **Excessive Permissions**: Identifies over-privileged users and roles

## IAM Alert Categories

IAM security alerts are categorized by resource type and severity:

- **IAMUser**: Alerts related to IAM user configuration
- **IAMAccessKey**: Alerts related to access key age and usage
- **IAMPolicy**: Alerts related to policy configuration and permissions
- **IAMGroup**: Alerts related to IAM group configuration
- **IAMPasswordPolicy**: Alerts related to password policy configuration

## IAM Management Features

The platform provides several features for managing IAM security:

### Credential Rotation

The Credential Rotation Manager allows users to:

- Monitor the age of access keys
- Schedule automatic rotation of access keys
- Track the history of key rotations
- Receive alerts for keys approaching expiration

### IAM User Management

The IAM User Management component allows users to:

- View all IAM users and their security status
- Monitor last activity and access key age
- Check MFA status for each user
- Review permissions and group memberships

### IAM Policy Analysis

The IAM Policy Analysis component allows users to:

- Review IAM policies for security issues
- Identify overly permissive policies
- Check for compliance with least privilege principle
- Visualize policy relationships and dependencies

## IAM Security API Endpoints

The platform includes several API endpoints for IAM security:

- `POST /api/alerts/iam`: Trigger an IAM security scan
- `GET /api/aws/iam/users`: Retrieve IAM user information
- `GET /api/aws/iam/policies`: Retrieve IAM policy information
- `POST /api/aws/iam/rotate-key`: Rotate an IAM user's access key 