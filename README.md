# Aha! MCP Server (Railway)

MCP (Model Context Protocol) server for Aha! product management - deployed on Railway.

## Version

**v1.5.1** - Custom fields and relationship linking fixes

## Deployment

This repo is connected to Railway for automatic deployment.

### Environment Variables (set in Railway)

| Variable | Description |
|----------|-------------|
| `AHA_API_KEY` | Your Aha! API key |
| `AHA_COMPANY` | Your Aha! company subdomain (e.g., `fe-fundinfo`) |
| `TRANSPORT_MODE` | Set to `http` for Railway |

## Files

```
├── src/
│   ├── index.js          # Main MCP server
│   ├── aha-client.js     # Aha! API client
│   ├── audit-logger.js   # Audit logging
│   └── preferences.js    # User preferences
├── package.json
├── Procfile
└── README.md
```

## Endpoints

- `POST /mcp` - MCP messages
- `GET /sse` - Server-sent events
- `GET /health` - Health check

## Changelog

### v1.5.1
- Fixed custom fields format (object instead of array)
- Fixed `value_score` → `score` (standard field)
- Epic-initiative linking working
- Feature-epic linking working
- All workflow_status updates working

### v1.5.0
- Added transforms for all entity types
- Added governance field support for initiatives

### v1.4.0
- Added root cause analysis for health audit
- Added initiative features retrieval
