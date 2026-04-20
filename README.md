# Walmart Mock Microservices ג€” Port.io Demo

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
ג”ג”€ג”€ services/
ג”‚   ג”ג”€ג”€ checkout-service/
ג”‚   ג”‚   ג”ג”€ג”€ src/index.js
ג”‚   ג”‚   ג”ג”€ג”€ package.json
ג”‚   ג”‚   ג”ג”€ג”€ Dockerfile
ג”‚   ג”‚   ג””ג”€ג”€ k8s/deployment.yaml
ג”‚   ג”ג”€ג”€ payment-gateway/   (same structure)
ג”‚   ג”ג”€ג”€ inventory-api/     (same structure)
ג”‚   ג”ג”€ג”€ search-service/    (same structure)
ג”‚   ג”ג”€ג”€ auth-service/      (same structure)
ג”‚   ג””ג”€ג”€ recommendation-api/ (same structure)
ג”ג”€ג”€ .github/workflows/
ג”‚   ג”ג”€ג”€ ci.yml             ג€” Build & test all services on push
ג”‚   ג””ג”€ג”€ snyk-scan.yml      ג€” Triggered from Port self-service action
ג””ג”€ג”€ port/
    ג”ג”€ג”€ entities/services.json   ג€” Port catalog entity definitions
    ג””ג”€ג”€ push-entities.ps1        ג€” Script to register entities in Port
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


> Last CI trigger: 2026-04-20 21:22 UTC