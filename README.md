# Aha! MCP Custom Server

A custom MCP (Model Context Protocol) server for Aha! with **full CRUD capabilities**, **complete audit trail logging**, and **proper response formatting**.

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🎯 Features

### Full CRUD Operations

| Entity | List | Get | Create | Update | Delete |
|--------|:----:|:---:|:------:|:------:|:------:|
| Products | ✅ | ✅ | - | - | - |
| Features | ✅ | ✅ | ✅ | ✅ | ✅ |
| Ideas | ✅ | ✅ | ✅ | ✅ | ✅ |
| Releases | ✅ | ✅ | ✅ | ✅ | ✅ |
| Epics | ✅ | ✅ | ✅ | ✅ | ✅ |
| Initiatives | ✅ | ✅ | ✅ | ✅ | - |
| Goals | ✅ | ✅ | ✅ | ✅ | - |
| Requirements | ✅ | ✅ | ✅ | ✅ | ✅ |
| Comments | ✅ | - | ✅ | - | - |
| Users | ✅ | ✅ | - | - | - |
| Workflow Statuses | ✅ | - | - | - | - |
| Tags | ✅ | - | - | - | - |

### ✨ v1.1.0 Improvements

**Proper Response Formatting:**
- All create operations return reference numbers and direct links
- Update operations show exactly what changed
- Delete operations confirm what was deleted
- Better error messages with troubleshooting guidance

**Complete Audit Trail:**
- Every CREATE, UPDATE, and DELETE operation is automatically logged
- Audit log includes: timestamp, operation, entity type, entity ID, changes
- Exportable to JSON or CSV
- Queryable by operation type, entity type, date range

**Example Response:**
```
✅ **Created Epic:** AI-E-123 - AI Document Processing
🔗 View at: https://fe-fundinfo.aha.io/epics/AI-E-123
```

### Governance & Workflow Tools

- **Onboarding Wizard**: Set up your workspace and default product
- **Health Audit**: Governance checks against FE fundinfo Playbook
- **Business Case Drafter**: Generate Initiative descriptions following best practices

## 📦 Installation

### Prerequisites

- Node.js 18.0.0 or higher
- Claude Desktop app
- Aha! API token

### Quick Start

1. **Clone the repository:**
```bash
git clone https://github.com/fefundinfoali/aha_mcp.git
cd aha_mcp
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure Claude Desktop:**

Add to your `claude_desktop_config.json`:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`  
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "aha": {
      "command": "node",
      "args": ["C:\\path\\to\\aha_mcp\\src\\index.js"],
      "env": {
        "AHA_COMPANY": "your-company",
        "AHA_TOKEN": "your-api-token"
      }
    }
  }
}
```

4. **Restart Claude Desktop**

## 🔑 Getting Your Aha! API Token

1. Go to your Aha! account settings
2. Navigate to **Settings → Account → Personal → Developer → API Key**
3. Generate a new API key if you don't have one

## 📚 Usage Examples

### CRUD Operations
```
"List all features in the AI Innovation product"
"Create a new epic called 'User Authentication' in AI"
"Update epic AI-E-123 to change status to 'Ready to Develop'"
"Delete feature AI-456"
"Add a comment to epic AI-E-123"
```

### Audit Trail
```
"Show me all changes made today"
"What epics have been created this week?"
"Show audit statistics"
"Export the audit log to CSV"
```

### Governance
```
"Run the onboarding wizard"
"Run a health audit on AI Innovation at the Scoped stage"
"Draft a business case for improving document processing"
```

## 🔍 Audit Log

### Location
By default, the audit log is stored at:
```
Windows: C:\Users\<username>\.aha-mcp-audit\audit-log.json
macOS/Linux: ~/.aha-mcp-audit/audit-log.json
```

Customise by setting the `AUDIT_LOG_PATH` environment variable.

### Audit Tools

| Tool | Description |
|------|-------------|
| `audit_get_entries` | View audit log with filters (operation, entity type, date range) |
| `audit_get_stats` | Get statistics summary (total operations, by type, success/error counts) |
| `audit_export` | Export audit log to JSON or CSV file |
| `audit_clear` | Clear audit log (creates backup first) |
| `audit_get_log_path` | Get the file path where audit log is stored |

### Audit Log Format

```json
{
  "id": "audit_1702900000000_abc123xyz",
  "timestamp": "2024-12-18T10:30:00.000Z",
  "operation": "CREATE",
  "entityType": "epic",
  "entityId": "AI-E-123",
  "entityName": "AI Document Processing",
  "productId": "AI",
  "changes": {
    "name": "AI Document Processing",
    "description": "..."
  },
  "result": {
    "success": true,
    "createdId": "AI-E-123"
  }
}
```

## 📖 Documentation

- **[DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md)** - Step-by-step deployment instructions
- **[IMPLEMENTATION-SUMMARY.md](IMPLEMENTATION-SUMMARY.md)** - Technical details of v1.1.0 changes
- **[aha-mcp-audit-findings.md](aha-mcp-audit-findings.md)** - Comprehensive audit findings and testing matrix
- **[product_manifest.md](product_manifest.md)** - FE fundinfo product context & governance rules

## 🐛 Troubleshooting

### MCP Not Connecting

1. Check logs: `%APPDATA%\Claude\logs\mcp-server-aha.log`
2. Test manually:
```bash
set AHA_COMPANY=your-company
set AHA_TOKEN=your-token
node src/index.js
```
3. Verify Node.js version: `node --version` (should be ≥18.0.0)

### Audit Log Issues

1. Check log path: Ask Claude to run `audit_get_log_path`
2. Ensure directory is writable
3. Check disk space

### API Errors

- Ensure your API token has necessary permissions
- Check product/feature IDs are correct
- Some operations require specific Aha! plan features

## 🔄 Upgrading from v1.0.0

If you're upgrading from v1.0.0:

1. **Backup your current installation**
2. **Pull latest changes:** `git pull origin main`
3. **No configuration changes needed** - fully backwards compatible
4. **Restart Claude Desktop**
5. **Verify:** Create an epic and confirm you see the reference number

See [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for detailed upgrade instructions.

## 🤝 Contributing

This is an internal FE fundinfo project. For questions or issues:

1. Check the troubleshooting section above
2. Review the MCP logs
3. Contact the Nexus AI team

## 📝 Changelog

### v1.1.0 (2026-01-26)

**Fixed:**
- Create operations now return reference numbers and links
- Update operations show specific changes made
- Delete operations confirm what was deleted
- All CRUD operations now logged to audit trail
- Better error messages with troubleshooting guidance

**Technical:**
- Replaced generic handlers with entity-specific implementations
- Added comprehensive error handling with try-catch blocks
- Added audit logging to all create/update/delete operations
- Improved response formatting for better user experience

### v1.0.0 (Initial Release)

- Full CRUD capabilities for all Aha! entities
- Audit trail logging
- Governance workflow tools
- Product context management

## 📄 Licence

MIT

## 🏢 About

Created by the Nexus AI team at FE fundinfo for streamlined product management workflows with Claude Desktop.

**Maintained by:** Ali Hussein  
**Organisation:** FE fundinfo  
**Product:** Nexus AI
