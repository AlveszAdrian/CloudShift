# Security Scanning

The Security Scanning system is a comprehensive component of the AWS Monitor platform that automatically identifies security vulnerabilities and compliance issues across AWS resources. This document explains how the security scanning functionality works.

## Overview

The platform's security scanning capabilities include:

1. Comprehensive vulnerability detection across multiple AWS services
2. Compliance checking against AWS best practices and security standards
3. Automated periodic scanning and manual on-demand scanning
4. Severity-based categorization of security issues
5. Integration with the Alert system for tracking and resolving issues

## Scanning Components

The security scanning system is composed of several specialized services:

### VulnerabilityService

The `VulnerabilityService` is the core scanning component that:

1. Coordinates scanning across different AWS resources
2. Aggregates results from specialized security services
3. Standardizes and categorizes detected vulnerabilities
4. Converts vulnerabilities to alerts in the system

### EC2SecurityService

The `EC2SecurityService` focuses on EC2-related resources:

1. Security Groups: Analyzes ingress and egress rules
2. EC2 Instances: Checks for exposed ports, public IPs, and insecure configurations
3. EBS Volumes: Verifies encryption and proper attachment status
4. Network ACLs: Checks for overly permissive rules
5. VPC configurations: Analyzes for security misconfigurations

### IAMSecurityService

The `IAMSecurityService` focuses on identity and access management:

1. IAM Users: Checks for inactive users, password policy compliance, and MFA usage
2. Access Keys: Monitors key age and usage patterns
3. IAM Policies: Analyzes for overly permissive permissions
4. IAM Roles: Checks for secure trust relationships
5. Password Policies: Verifies compliance with security standards

## Scanning Process Flow

The security scanning process follows these steps:

1. User initiates a scan from the Security dashboard or a scan is triggered automatically
2. The platform connects to AWS using the selected credential profile
3. Based on the scan type, the appropriate security service is invoked
4. The security service performs detailed checks on the AWS resources
5. Security issues are identified and categorized by severity
6. Issues are converted to alerts and stored in the database
7. The dashboard is updated to show the scan results

## Scan Types

The platform supports different types of security scans:

### Comprehensive Scan

The comprehensive scan checks for vulnerabilities across all supported AWS services:

```javascript
const vulnerabilities = await vulnerabilityService.scanVulnerabilities();
```

### IAM Security Scan

The IAM security scan focuses specifically on IAM-related issues:

```javascript
const iamIssues = await iamSecurityService.scanIAMSecurity();
```

### EC2 Security Scan

The EC2 security scan focuses on EC2 and related network resources:

```javascript
const ec2SecurityData = await ec2SecurityService.checkEC2Security();
```

## Vulnerability Categories

The security scanning system categorizes vulnerabilities by:

### Severity

- **CRITICAL**: Issues that require immediate attention
- **HIGH**: Serious security issues that should be addressed promptly
- **MEDIUM**: Issues that should be fixed as part of regular maintenance
- **LOW**: Minor issues that represent best practice deviations

### Resource Type

- EC2 related: EC2Instance, SecurityGroup, Volume, VPC, NetworkACL
- IAM related: IAMUser, IAMAccessKey, IAMPolicy, IAMGroup, IAMPasswordPolicy
- S3 related: S3Bucket, S3Object
- Other AWS services: RDS, Lambda, CloudFront, etc.

## API Endpoints

The security scanning system uses the following API endpoints:

- `POST /api/alerts/scan`: Trigger a comprehensive security scan
- `POST /api/alerts/iam`: Trigger an IAM-focused security scan
- `POST /api/alerts/ec2`: Trigger an EC2-focused security scan
- `GET /api/alerts`: Retrieve the results of security scans 