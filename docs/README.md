# AWS Monitor Platform Documentation

This documentation provides details about the AWS Monitor platform, its architecture, components, and how each part of the system works, with special focus on the alert system.

## Table of Contents

1. [Platform Overview](#platform-overview)
2. [Alert System](./alert-system.md)
3. [Dashboard Components](./dashboard-components.md)
4. [IAM Security Management](./iam-security.md)
5. [Credential Rotation](./credential-rotation.md)
6. [Security Scanning](./security-scanning.md)

## Platform Overview

AWS Monitor is a comprehensive platform for monitoring and securing AWS resources. It provides:

- Real-time security alerts and vulnerability detection
- IAM access and credential management
- Security compliance scanning
- Dashboard for monitoring AWS resources
- Automated security scanning and reporting

The platform is built with Next.js and uses a Prisma database to store alerts, user data, and AWS credentials.

## Documentation Structure

Our documentation is organized into the following sections:

- [**Alert System**](./alert-system.md): Details about how alerts are created, managed, and displayed
- [**Dashboard Components**](./dashboard-components.md): Information about the main dashboard components
- [**IAM Security Management**](./iam-security.md): Documentation about IAM security monitoring and management
- [**Credential Rotation**](./credential-rotation.md): Guide to the credential rotation system
- [**Security Scanning**](./security-scanning.md): Information about the vulnerability scanning system

## Technical Architecture

The AWS Monitor platform is built on the following key technologies:

- **Frontend**: Next.js, React, TailwindCSS
- **Backend**: Next.js API routes, Node.js
- **Database**: SQLite with Prisma ORM
- **AWS Integration**: AWS SDK for JavaScript

The platform uses a modular architecture with specialized services for different AWS resource types, allowing for extensibility and focused security scanning. 