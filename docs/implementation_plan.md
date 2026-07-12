# Optical Store Management System — Implementation Plan

## Tech Stack
- Backend: Laravel 13, PHP 8.3, PostgreSQL
- Frontend: React 19, TypeScript, Inertia.js v2, TailwindCSS 4
- Auth: Laravel Breeze

## 6 Phases

### Phase 1: Database Foundation & Models ← CURRENT
- 10 migrations (roles, branches, products, inventories, transfers, adjustments, opnames, movements, audit_logs)
- 12 new models + update User model
- Database seeder with sample data

### Phase 2: Backend Controllers, Services & Routes
- 5 service classes (StockService, TransferService, OpnameService, AuditService, ReportService)
- 10 controllers
- 6 form request validators
- 1 role middleware
- Route definitions

### Phase 3: Frontend — Shared Components & TypeScript Types
- TypeScript interfaces for all models
- 9 reusable admin components (DataTable, StatusBadge, FormModal, etc.)
- AdminLayout sidebar update

### Phase 4: Frontend — Master Data Pages
- Branch management pages (Index, Show)
- Product management pages (Index, Create, Edit, Show)

### Phase 5: Frontend — Inventory & Operations Pages
- Central Warehouse & Branch Inventory pages
- Stock Transfer pages (Index, Create, Show with workflow)
- Stock Adjustment pages (Index, Create)
- Stock Opname pages (Index, Create, Show with workflow)

### Phase 6: Dashboard, Reports & User Management
- Dashboard rewrite with real data + Recharts
- 6 report pages with export (Excel, PDF, Print)
- User management pages (Index, Create, Edit)

## Business Rules
1. Stock cannot be negative
2. Every stock change → StockMovement record
3. Transfers require approval
4. Receiving updates both sender/receiver inventories
5. No deleting stock history
6. Every transaction logged
7. Branch inventory separate from Central Warehouse
