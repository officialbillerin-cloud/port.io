# Walmart Mock Microservices — Port.io Demo

This repository contains a mock Walmart microservices platform built for the Port.io TSM/TSE assignment demo.

## Services

| Service | Port | Team | Version |
|---|---|---|---|
| checkout-service | 3001 | payments | 1.4.2 |
| payment-gateway | 3002 | payments | 2.1.0 |
| inventory-api | 3003 | supply-chain | 3.0.1 |
| search-service | 3004 | discovery | 1.8.3 |
| auth-service | 3005 | platform | 4.2.1 |
| recommendation-api | 3006 | discovery | 2.3.0 |

## Structure

```
walmart-mock/
├── services/
│   ├── checkout-service/
│   │   ├── src/index.js
│   │   ├── package.json
│   │   ├── Dockerfile
│   │   └── k8s/deployment.yaml
│   ├── payment-gateway/   (same structure)
│   ├── inventory-api/     (same structure)
│   ├── search-service/    (same structure)
│   ├── auth-service/      (same structure)
│   └── recommendation-api/ (same structure)
├── .github/workflows/
│   ├── ci.yml             — Build & test all services on push
│   └── snyk-scan.yml      — Triggered from Port self-service action
└── port/
    ├── entities/services.json   — Port catalog entity definitions
    └── push-entities.ps1        — Script to register entities in Port
```

## Port.io Integration

Each service is registered as a `service` entity in Port with:
- Team ownership
- Environment relation (walmart-prod)
- Build status
- Change failure rate (for Gold scorecard rule)

## GitHub Actions

- **CI workflow**: Runs on every push, reports build status back to Port
- **Snyk scan**: Triggered via Port self-service action, reports vulnerability count back to Port run log
