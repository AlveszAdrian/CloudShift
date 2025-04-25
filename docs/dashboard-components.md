# Dashboard Components

The AWS Monitor platform provides a comprehensive dashboard with multiple components for monitoring and managing AWS resources. This document details the main dashboard components and their functionality.

## Main Dashboard

The main dashboard provides an overview of the AWS environment with key metrics and status indicators:

- **Security Score**: Overall security rating of the AWS environment
- **Alert Summary**: Count of active alerts by severity
- **Resource Utilization**: Overview of AWS resource usage
- **Recent Activity**: Timeline of recent security events

## Security Dashboard

The Security dashboard is the central hub for monitoring and managing security alerts:

- **Alert Categories**: Filter alerts by category (IAM, EC2, S3, etc.)
- **Alert Filters**: Filter alerts by severity, status, and resource type
- **Alert List**: Interactive list of security alerts with sorting and filtering
- **Alert Details**: Modal with detailed information about selected alerts
- **Security Scan Controls**: Buttons to initiate security scans of AWS resources

### Alert Visualization

The Security dashboard includes several components for visualizing alerts:

- **Alert Severity Distribution**: Chart showing the distribution of alerts by severity
- **Alert Timeline**: Timeline showing alert creation over time
- **Resource Type Distribution**: Chart showing alerts by AWS resource type

## IAM Dashboard

The IAM dashboard provides tools for managing AWS Identity and Access Management:

- **User Management**: View and manage IAM users
- **Access Key Management**: Monitor and rotate access keys
- **Credential Rotation**: Schedule and manage credential rotation
- **IAM Security Scans**: Scan IAM configurations for security issues

### Credential Rotation Manager

The Credential Rotation Manager component provides:

- **Key Age Monitoring**: Track the age of AWS access keys
- **Rotation Scheduling**: Schedule key rotations for IAM users
- **Rotation History**: View history of past key rotations
- **Rotation Alerts**: Alerts for keys approaching expiry

## EC2 Dashboard

The EC2 dashboard provides monitoring and management of EC2 instances:

- **Instance List**: View all EC2 instances with status and security information
- **Security Group Analysis**: Identify security group vulnerabilities
- **EC2 Security Scans**: Scan EC2 configurations for security issues
- **Volume Management**: Manage EBS volumes and check for encryption

## S3 Dashboard

The S3 dashboard focuses on monitoring S3 bucket security:

- **Bucket List**: View all S3 buckets with security configuration
- **Public Access Checks**: Identify buckets with public access
- **Encryption Status**: Check bucket encryption settings
- **S3 Security Scans**: Scan S3 configurations for security issues

## Compliance Dashboard

The Compliance dashboard provides compliance monitoring:

- **Compliance Frameworks**: View compliance status for major frameworks
- **Compliance Reports**: Generate compliance reports
- **Remediation Tasks**: Track remediation of compliance issues
- **Compliance Scans**: Scan AWS resources for compliance issues 