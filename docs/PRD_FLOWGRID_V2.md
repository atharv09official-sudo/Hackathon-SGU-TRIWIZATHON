# FlowGrid: AI-Powered Distribution Intelligence & Autonomous Dispatch

**PRD v2.0 — Hackathon Round 1 Final Submission**

Oct 24, 2026 · @Atharv

---

## 1. Executive Summary

FlowGrid is a decision-support and automation platform that tells FMCG supply-chain teams **what to move, from where, by whom, and when the plan must change** — and then coordinates the change safely.

The system is built around four tightly coupled capabilities:

1. **Demand intelligence.** A Random Forest model estimates store-level product demand from historical sales, lag features, and calendar signals. A seasonal-naive baseline is retained for comparison and automatic fallback if the ML model underperforms.
2. **Constraint-aware optimization.** Google OR-Tools evaluates every candidate shipment against stock availability, vehicle capacity, delivery windows, transport cost, agent availability, and batch-expiry constraints and selects the plan that minimises a configurable multi-component objective.
3. **Event-driven replanning.** Urgent orders, agent unavailability, verified route disruptions, and approved cost changes each trigger targeted re-evaluation of the *affected* plan segment — not a full recalculation — using a materiality threshold and cooldown to prevent route churn.
4. **Traceable workflow execution.** An n8n-coordinated workflow handles ingestion, validation, optimization dispatch, approval gates, map publishing, notification delivery, and audit writing. A visual execution graph shows judges and operators every step, its status, and any errors.

**Prototype dimensions:** 3 warehouses · 10 retail stores · 10–20 SKUs · 5–10 delivery agents · \~30 days of seeded sales history. These are demo constraints, not claims of production capacity.

**Core differentiator:** FlowGrid's novel contribution is its *decision guard with materiality-gated replanning* — a deterministic layer that sits between the optimizer and any commit, enforcing hard constraints, verifying data freshness, checking that the proposed plan improves the objective by at least a configured threshold, and routing the action to auto-commit or human approval based on explicit risk policy. No competitor component (map, chatbot, or workflow canvas) performs this function; it is what prevents the system from being assembled from off-the-shelf parts alone.

## 2. Problem Statement

FMCG distribution fails not from a single bottleneck but from the compounding effect of five interconnected gaps:

1. **Demand blindness.** Replenishment is driven by static par-levels or manual re-orders, not by store-level forecasts. A product that sells fast on weekends is replenished on the same cycle as one that sells steadily — leading to simultaneous overstock in one SKU and stockout in another at the same store.
2. **Disconnected constraints.** Stock levels, vehicle capacity, batch expiry, and agent availability live in separate records or spreadsheets. A planner cannot see all constraints at once, so shipments are dispatched that exceed capacity, expire before delivery, or rely on an unavailable driver.
3. **Reactive routing.** When a route is disrupted or an agent calls in sick, coordination happens over calls and messages. The revised plan is not checked for constraint compliance, is not recorded, and cannot be audited.
4. **Churn from over-replanning.** Systems that do attempt automated replanning often trigger a full network recalculation on every minor event — creating route oscillation, notification floods, and driver confusion.
5. **Invisible decisions.** Managers approve plans without seeing the trade-offs. When a delivery is late or a store runs out, there is no record of why the plan was what it was.

FlowGrid addresses all five gaps with a single closed-loop system: forecast demand, plan against hard constraints, respond to material changes with targeted replanning gated by a materiality threshold, and record every decision with full provenance.

### 2.1 User and business impact

The prototype will evaluate whether it can, on the defined demo dataset:

- Reduce modelled transportation cost versus a static-allocation baseline in at least 2 of 3 controlled scenarios.
- Reduce unmet demand and predicted stockout exposure.
- Improve delivery feasibility and on-time fulfilment.
- Reduce the risk of dispatching short-dated stock to destinations unlikely to consume it in time.
- Reassign urgent or unstarted deliveries when an agent becomes unavailable, within the p95 latency target.
- Reduce manual coordination by automating validated, low-risk updates and notifications.
- Make every recommendation auditable: trigger, inputs, constraints checked, alternatives considered, decision, and outcome.

All outcomes will be labelled **simulated** unless supported by operational data. No commercial savings are claimed.

## 3. Product Goals and Non-Goals

### 3.1 Goals

1. Produce a distribution plan that passes all declared hard constraints, or returns an explicit infeasibility report.
2. Forecast store-level demand and measure its performance against a documented seasonal-naive baseline on a chronological holdout.
3. Use real route-distance and travel-time data (Google Maps Routes API with documented fallback) to inform allocation and dispatch.
4. Re-evaluate only the affected plan segment when a material event occurs; suppress replanning when the improvement does not meet the configured threshold.
5. Route actions to auto-commit (low-risk policy) or human approval (high-impact or uncertain) using an explicit, logged decision policy.
6. Display live or latest-known operational state on a MapCN/MapLibre map with stale-data indicators and freshness timestamps on every cached value.
7. Deliver store-manager, dispatcher, and agent alerts through an SMS provider adapter (e.g. Twilio) or a clearly labelled demo mode — with idempotency, retry, and deduplication.
8. Capture offline agent events locally and reconcile them idempotently on reconnection.
9. Show a visual workflow execution trace — trigger → validation → optimization → decision guard → approval/commit → notification → audit — with per-run status and timestamps.
10. Demonstrate measurable improvement over a documented baseline on identical inputs across at least 3 reproducible scenarios.

### 3.2 Non-goals for the hackathon MVP

- Integration with private retailer ERP systems or real commercial stock databases.
- Autonomous purchasing, financial settlement, or irreversible business transactions.
- Unsupervised LLM control over inventory, route, agent, or database operations.
- Training a foundation model or a custom embedding model from scratch.
- A general-purpose drag-and-drop workflow editor that reproduces n8n's full capabilities.
- Guaranteed live traffic, fuel prices, or delivery outcomes when provider access or verification is unavailable.
- Production-grade offline basemap coverage for arbitrary geographic areas.
- Claims of business savings or model accuracy that have not been measured on the prototype dataset.

## 4. Target Users and Personas

### 4.1 Supply Chain Manager — Priya, 38, regional FMCG distributor

**Context:** Oversees stock movement across 3 warehouses and 40+ stores. Spends 2–3 hours per day reconciling allocation reports, chasing stockout alerts, and justifying routing decisions to her director.

**Pain:** Her current tool shows yesterday's stock but gives no demand forecast and no cost-ranked alternatives. When she approves a plan, she has no record of why it was the best option.

**Needs:** See forecast vs. on-hand stock, cost trade-offs, and the reason behind each recommendation in one view.

**Success condition:** Approves or overrides a plan in under 5 minutes with full context; every decision is auditable.

---

### 4.2 Dispatcher / Transport Supervisor — Ravi, 31, logistics ops

**Context:** Handles 20–40 deliveries per day. Manages reassignments over phone calls when a driver is sick or a road is blocked. Has no single view of current agent locations and workloads.

**Pain:** Re-assigning a delivery takes 15–20 minutes and sometimes double-assigns an agent. Notifications go out late or not at all.

**Needs:** See eligible alternatives ranked by feasibility, tap to reassign, and confirm that the store and agent have been notified.

**Success condition:** A revised plan reaches affected users within the p95 latency target without creating conflicts elsewhere.

---

### 4.3 Warehouse Manager — Sunita, 45, stock control

**Context:** Runs the receiving dock and pick operations at one warehouse. Her biggest risk is an allocation that dispatches stock that is damaged, unavailable, or about to expire.

**Pain:** Plans are sent to her team before she can flag stock that was written off that morning.

**Needs:** Confirm or flag stock availability before a plan is committed; see proposed dispatch quantities against current usable stock.

**Success condition:** No recommendation dispatches more usable stock than is available at her warehouse.

---

### 4.4 Store Manager — Amit, 29, retail floor

**Context:** Manages a convenience store with 200+ SKUs. Learns about a delayed delivery when the shelf is already empty.

**Pain:** No visibility into replenishment status until a stockout triggers a manual call to the distributor.

**Needs:** ETA for incoming stock, real-time delay alerts, and a way to submit urgent replenishment requests.

**Success condition:** Receives a clear, timely alert when stock is delayed or reassigned; can see expected delivery time.

---

### 4.5 Delivery Agent — Suresh, 26, van driver

**Context:** Completes 8–12 deliveries per day on a pre-assigned route. Loses connectivity in rural stretches. Sometimes receives updated route instructions mid-delivery via phone.

**Pain:** Last-minute reassignments arrive by phone with no map update. Offline stretches mean location is stale on the dashboard.

**Needs:** Accept assignments, see the approved route on a map, report progress, and queue events when offline.

**Success condition:** No conflicting active assignments; route changes are communicated before he reaches the wrong destination.

---

### 4.6 System Administrator — Dev, 34, IT operations

**Context:** Maintains API credentials, user roles, and service health across the platform. Responds to job failures and integration outages.

**Pain:** API credentials are sometimes embedded in frontend config, creating security exposure. Failed notification jobs are not surfaced until a user complains.

**Needs:** Server-side credential management, visible failed-job logs, configurable alert thresholds, and RBAC.

**Success condition:** The system degrades safely when an external dependency fails and produces an audit trail for all privileged actions.

## 5. Core User Journeys

### Journey A: Plan normal distribution

1. System loads warehouse stock, SKU/batch data, store demand history, agent/vehicle capacity, and cost assumptions.
2. Validates required fields; flags missing or stale records rather than silently proceeding.
3. Forecasting service estimates demand over the planning horizon and reports holdout-based baseline comparison metrics.
4. Routing adapter retrieves fresh distance/time estimates for candidate origin–destination pairs.
5. Optimization engine builds the problem, solves it under hard constraints, and surfaces the objective breakdown.
6. Decision guard validates constraints, checks improvement threshold vs. current plan, and determines auto-commit or approval.
7. Supply chain manager reviews trade-offs (cost / shortage / expiry) and the reason behind each material choice.
8. On approval, system commits a versioned plan atomically and publishes it to the map and dashboards.

### Journey B: Urgent order arrives

1. Order submitted with destination, SKU, quantity, deadline, and urgency flag.
2. System verifies destination geocode, stock availability at eligible warehouses, and urgency policy.
3. Evaluates eligible warehouses, available agents, route ETAs, workload, and remaining capacity.
4. Optimizer proposes a feasible assignment and surfaces trade-offs against existing commitments.
5. Decision guard checks the action against hard constraints and the auto-commit policy; routes to dispatcher approval if required.
6. Approved assignment appears on the map; affected agent and store manager receive deduplicated notifications.
7. Decision and execution result are written to the audit record.

### Journey C: Agent becomes unavailable

1. Dispatcher marks agent unavailable, or system receives a valid availability event with an idempotency key.
2. System identifies that agent's pending and unstarted orders, distinguishing them from deliveries already in progress.
3. Refreshes eligible agent status, workload, last-known location (with freshness timestamp), capacity, and ETA.
4. Ranks feasible reassignment options and explains why the leading option is preferred (distance, capacity, workload).
5. Dispatcher approves the proposed reassignment or selects another eligible agent manually.
6. System commits the reassignment and sends deduplicated notifications.
7. Previous and new assignment, reason, actor, and timestamp are auditable.

### Journey D: Route or fuel-cost disruption

1. A routing update, operator report, or external RSS/news event enters the ingestion endpoint.
2. Ingestion service checks source, timestamp, geographic relevance, duplicates, and confidence level.
3. Unverified news is stored as a candidate observation; it does not change the operational fuel parameter.
4. For a verified road/ETA change or an operator-confirmed cost update, the system recalculates affected route estimates and re-evaluates the objective.
5. Decision guard blocks the revised plan if it fails hard constraints or the materiality threshold, unless an explicit emergency rule applies.
6. A material change is published with its reason, revised ETA or cost estimate, and required notifications.

### Journey E: Agent loses connectivity

1. Agent client stores timestamped location and delivery events locally when offline, where device permissions allow.
2. Dashboard marks agent status as offline or stale; last-known location timestamp is visible. The position is never presented as live.
3. Dispatch decisions use the configured stale-data policy; high-confidence decisions may require manual review.
4. On reconnection, queued events upload with unique event IDs and reconcile idempotently.
5. System resolves duplicates and ordering conflicts using event timestamps and server receipt times; audit trail is updated.

## 6. Functional Requirements and Priorities

**P0** = essential to demonstrate the core product. **P1** = important enhancement if time permits. **P2** = future scope.

### 6.1 P0 — Must Have

**FR-P0-01: Inventory and order state** The system shall store warehouses, stores, SKUs, usable stock, batches (where applicable), orders, delivery deadlines, vehicles/agents, capacity, and current assignments. Every allocation shall be traceable to the state/version used to calculate it.

*Acceptance criteria:* Seeded dataset loads successfully. Negative stock, invalid quantities, and missing required identifiers are rejected with an explicit error. Plan versioning records the inventory snapshot used.

---

**FR-P0-02: Demand forecasting with baseline comparison** The system shall compute a seasonal-naive baseline forecast and a Random Forest regression forecast using chronologically ordered historical data with lag, calendar, and available promotion features. Both shall be evaluated on a held-out test period. The ML model is selected for recommendations only if it achieves at least 5% relative WAPE improvement over the baseline; otherwise the baseline is active and the comparison result is reported.

*Acceptance criteria:* Evaluation period and WAPE metric are visible in the UI. No future observations leak into training features. Data limitations are documented inline.

---

**FR-P0-03: Constraint-aware distribution optimization** The optimization service (Google OR-Tools) shall recommend source warehouse, destination store, SKU, quantity, and expected movement cost using available inventory, estimated demand, route cost/time, and configured shortage/waste penalties.

*Hard constraints:* Cannot allocate unavailable stock; cannot exceed vehicle or warehouse capacity; cannot assign an unavailable agent; cannot violate a required delivery time window without explicitly marking the request infeasible. Unmet demand must appear in output, not be silently dropped.

*Acceptance criteria:* 100% of plans in the acceptance test suite pass the constraint validator, or are explicitly marked infeasible with an unmet-demand record.

---

**FR-P0-04: Route and ETA integration** The backend shall call Google Maps Routes API for route geometry and travel-distance/time estimates when credentials are available. These estimates feed the optimizer; map rendering is not a substitute for route calculation.

*Acceptance criteria:* System displays a route returned by the routing layer. Documented fallback (cached haversine estimate with stale label) activates on API timeout, quota exhaustion, or missing credentials. Every cached route estimate shows its retrieval timestamp.

---

**FR-P0-05: Event-driven replanning** The system shall accept material events (urgent order, stock change, agent unavailability, verified route-delay, approved cost update) and re-evaluate the *affected* plan segment. It shall not trigger a full network recalculation on every minor event.

*Acceptance criteria:* A test event produces a decision record with trigger, affected objects, proposed action, reason, validation result, and final status. Events that do not meet the materiality threshold produce a logged suppression record.

---

**FR-P0-06: Decision guard and execution policy** Before committing any plan, the backend shall validate constraints, data freshness, permissions, and the configured minimum-improvement threshold. Auto-commit applies only within an explicitly configured low-risk policy; other actions require authorized approval.

*Acceptance criteria:* A plan that violates a hard constraint is never auto-committed. UI shows each plan's lifecycle state: proposed → awaiting approval → committed / rejected / failed.

---

**FR-P0-07: Agent availability and reassignment** The system shall track agent availability, workload, capacity, last-seen location (with timestamp and accuracy), and assignment status from heartbeat updates and delivery lifecycle events. It shall recommend reassignment for urgent orders and pending orders affected by declared unavailability.

*Acceptance criteria:* Manual dispatch override is always available. Reassignment cannot silently take over an in-progress delivery. All changes are recorded; affected parties are identified for notification.

---

**FR-P0-08: Map and operational dashboard** The frontend shall use MapCN + MapLibre GL to display warehouses, stores, active/proposed routes, order status, and agent status. Stale or unknown location must be visually distinct from live status.

*Acceptance criteria:* Map updates within 2 s of a committed plan event. Proposed and active routes are visually distinguished. Stale agent location shows last-seen timestamp.

---

**FR-P0-09: Notifications** The system shall create alerts for urgent assignments, material reassignments, critical stockout exposure, and material delay. An SMS adapter shall support Twilio or a clearly labelled simulated delivery mode.

*Acceptance criteria:* Each notification has a unique idempotency key, recipient, trigger, and lifecycle state. Reprocessing the same event does not create a duplicate logical notification. Retry history is visible.

---

**FR-P0-10: Workflow execution trace** The UI shall show a predefined step flow for: event ingestion → validation → forecast/impact analysis → optimization → decision guard → approval/execution → map update → notification → audit. Each run shows status, timestamps, and errors. n8n may orchestrate external integrations; critical business constraints remain enforced by the backend state machine.

*Acceptance criteria:* A judge can trace any scenario from trigger to final outcome without accessing terminal logs.

---

**FR-P0-11: Audit and explainability** Each decision shall persist input-data versions/timestamps, objective values, constraints checked, proposed alternatives, selected action, approval information, and execution outcome. A rule-based explanation shall answer "why did this plan change?" An LLM may generate a human-readable summary only from stored facts.

*Acceptance criteria:* System answers "why?" using stored decision data and never invents measurements.

---

**FR-P0-12: Security and access control** The API shall validate authentication and role permissions for all sensitive actions. API keys remain server-side. External content (RSS, uploaded files) is treated as untrusted input. LLM output is schema-validated and cannot directly execute database writes or unrestricted tool calls.

*Acceptance criteria:* Unauthorized write requests are rejected with 401/403. A malicious instruction embedded in an RSS payload cannot bypass decision rules. Credentials do not appear in frontend bundles or logs.

---

### 6.2 P1 — Should Have

**FR-P1-01: Fuel intelligence service** — Ingest RSS/search sources for fuel-cost events. Update the operational parameter only after authoritative corroboration or authorized human confirmation. Retain the previous trusted value with an uncertainty alert when sources conflict.

**FR-P1-02: Offline agent event queue** — Persist agent events locally during connectivity loss; synchronize idempotently on reconnection with unique event IDs and visible timestamps.

**FR-P1-03: FEFO expiry-aware allocation** — Prioritize feasible first-expiry-first-out allocation using verified batch records. Reject or flag missing/unverified expiry data. Do not infer expiry from LLM responses.

**FR-P1-04: What-if digital twin** — Repeatable scenarios for road disruption, warehouse stock reduction, urgent order, agent leave, and simulated fuel-price change. Show current vs. proposed KPI delta.

**FR-P1-05: Load management** — API rate limits, DB connection pooling, indexes, read-cache (Redis where justified), background workers for expensive jobs, and a notification outbox with retry.

**FR-P1-06: Source confidence and freshness labels** — Every external observation shows verified / estimated / simulated / stale / unknown status with source and retrieval timestamp.

**FR-P1-07: Workflow threshold configuration** — Authorized users can configure materiality thresholds and choose among predefined workflow templates via the UI.

### 6.3 P2 — Future Scope

- General drag-and-drop workflow editor with user-defined nodes and branches.
- Direct ERP, distributor billing, and WMS integrations.
- Probabilistic forecasting, promotion uplift modelling, uncertainty-aware inventory planning.
- Multi-provider routing fallback with automatic failover.
- Production offline basemap management for defined service zones.
- Multi-period, multi-warehouse batch allocation.
- Online model retraining with drift monitoring and approval gates.
- Native mobile application and additional notification channels.

## 7. High-Level Architecture

### 7.1 Technology stack

| Layer | Technology | Responsibility |
| --- | --- | --- |
| Web UI | React / Next.js · TypeScript · Tailwind CSS | Dashboard, inventory tables, approvals, workflow trace |
| Map | MapCN + MapLibre GL | Warehouse/store/agent markers, route overlays, status badges |
| API backend | Python + FastAPI | Auth, validation, business endpoints, event intake, state machine |
| Persistent store | PostgreSQL | Inventory, orders, agents, routes, decisions, events, audit records |
| Forecasting | Pandas + scikit-learn | Baseline and Random Forest model, chronological evaluation |
| Optimization | Google OR-Tools (CP-SAT / routing solver) | Allocation/assignment constraints and multi-component objective |
| Routing data | Google Maps Routes API | Route geometry, distance, duration/ETA; subject to API quota |
| Workflow orchestration | n8n (external integrations) + FastAPI state machine (critical decisions) | RSS ingestion, webhooks, scheduled checks, notifications |
| Background workers | Celery + Redis (or lightweight equivalent) | Forecasting jobs, optimization dispatch, notification outbox, retries |
| Notifications | Twilio SMS adapter or labelled demo mode | SMS dispatch and provider-callback status tracking |
| LLM | Configurable provider behind a server-side adapter | Article classification, request parsing, fact-grounded explanation |

### 7.2 Deployment topology

For the hackathon prototype, all services run in **Docker Compose on a single host**. Each service is a separate container with a defined internal network. This is sufficient for the demo dataset and makes the stack reproducible for judges.

| Container | Port (internal) | Notes |
| --- | --- | --- |
| `web` | 3000 | Next.js dev server or static export |
| `api` | 8000 | FastAPI + Uvicorn |
| `worker` | — | Celery worker(s); shares the `api` image |
| `db` | 5432 | PostgreSQL with persistent volume |
| `redis` | 6379 | Queue broker and cache |
| `n8n` | 5678 | Workflow engine; credentials injected via env |

**Single-point-of-failure acknowledgement:** In this topology, PostgreSQL and Redis are single instances. For the hackathon prototype this is acceptable. A production deployment would add PostgreSQL streaming replication, Redis Sentinel or Cluster, and a load balancer in front of the API tier.

### 7.3 Data flow

1. Ingest a sales, inventory, order, agent, routing, or external-event update via a validated API endpoint.
2. Validate schema, authorization, source, timestamps, duplicates, and required data freshness.
3. Persist the event and update the versioned operational state in PostgreSQL.
4. Invoke forecasting only when the relevant horizon or demand inputs have changed.
5. Obtain or reuse appropriately fresh route estimates (TTL-cached in Redis) for affected origin–destination pairs.
6. Build the OR-Tools optimization problem: inventory, demand, capacity, deadline, availability, cost.
7. Solve; capture infeasible demand explicitly.
8. Apply the decision guard: compare vs. current plan, check materiality threshold, verify freshness, determine approval requirement.
9. Commit the versioned plan atomically (PostgreSQL transaction) when approved or within auto-commit policy.
10. Publish map/dashboard events via WebSocket or polling; enqueue notifications to the Celery outbox.
11. Store execution outcomes; compare predicted vs. observed results when available.

### 7.4 Decision-making responsibility

| Component | Authority |
| --- | --- |
| ML model | Estimates demand or risk; does not enforce constraints |
| Rules engine (FastAPI) | Enforces hard constraints: stock, capacity, permissions, freshness, approval policy |
| OR-Tools solver | Selects a feasible allocation/assignment against the documented objective |
| LLM adapter | Parses unstructured text; explains structured decisions from stored facts; cannot commit actions |
| n8n | Coordinates external integrations, webhooks, and notification dispatch; does not own plan state |
| FastAPI state machine | Owns plan lifecycle: proposed → approved → committed; is the authority on commit |
| MapCN UI | Displays backend-returned route and agent data; never drives decisions |

## 8. Optimization and Decision Policy

### 8.1 Objective function

The OR-Tools solver minimises a configurable weighted objective:

```
Total cost =
  α · transport_cost
  + β · shortage_penalty
  + γ · expiry_waste_risk_penalty
  + δ · holding_cost
  + ε · lateness_penalty
  + ζ · reassignment_penalty
```

All weights (α–ζ) are documented, configurable, and displayed in the UI alongside the plan's objective breakdown. Different weight settings produce different trade-offs; the dashboard shows per-component values so the plan is never an opaque score.

### 8.2 Hard constraints

The following must hold for any plan the system commits. Violation of any hard constraint is a blocker — not a penalty.

| Constraint | Description |
| --- | --- |
| Stock availability | Allocated quantity ≤ usable stock at source warehouse |
| Vehicle capacity | Shipment weight/volume ≤ vehicle declared capacity |
| Agent availability | No assignment to an agent whose status is unavailable |
| Time window | Delivery must fit within the store's required receipt window, or be explicitly marked infeasible/late |
| Batch expiry | Shipment must not dispatch stock whose expiry falls before estimated delivery + consumption window, when batch data are available |
| Duplicate assignment | The same order cannot have two active assignments simultaneously |
| Authorization | Every committed action must pass decision-guard and role-permission checks |

### 8.3 Decision guard (the novel mechanism)

The decision guard is the system's primary safety layer and its most distinctive engineering contribution. It runs synchronously before any plan commit and enforces the following checks in order:

1. **Hard-constraint pass** — All constraints in §8.2 must hold. Any violation blocks commit.
2. **Data freshness check** — Route estimates, agent locations, and fuel parameters must be within their configured TTL. Stale data blocks auto-commit and flags the plan for review.
3. **Materiality threshold** — The candidate plan must improve the objective by at least the configured threshold (default: 2%) over the current committed plan. Plans that improve by less are suppressed with a logged reason, preventing route oscillation.
4. **Cooldown enforcement** — A route or assignment changed within the configured cooldown window (default: 10 minutes) cannot be changed again except on an explicit emergency exception, which must be logged.
5. **Approval routing** — Actions classified as high-impact (first assignment to a new agent, reassignment of an in-progress delivery, fuel parameter change) are always sent for dispatcher or manager approval, regardless of the improvement margin.
6. **Idempotency check** — The proposed commit is compared against the current committed plan; if they are equivalent, the commit is a no-op, not a duplicate write.

This mechanism cannot be replicated by composing a map library, a chatbot, and a workflow tool. It requires domain knowledge of constraint semantics, plan versioning, and operational risk thresholds.

### 8.4 Route-change guard

A route change is eligible for publication when at least one of the following holds:

- A verified disruption makes the current route infeasible or materially late.
- A candidate route improves the objective by at least the configured threshold.
- An urgent order or valid agent-unavailability event forces a reassignment.

Non-critical changes may require approval. Critical-event exceptions are explicit and logged. The cooldown window reduces oscillation between near-equivalent routes.

### 8.5 Fuel event policy

RSS/search results are candidate observations, not ground truth. Each observation retains source, date, region, and retrieval timestamp. The operational fuel parameter changes only after: (a) an authoritative source is found, (b) the configured number of independent corroborating sources is reached, or (c) an authorized operator manually confirms it. Conflicting or missing sources keep the previous trusted value with an uncertainty alert. Scenario mode may override fuel price for simulation but must label the result as simulated.

### 8.6 Address and location verification

- Normalize and geocode every delivery address on intake.
- Show the resolved address and map pin for human confirmation.
- GPS accuracy and timestamp are checked; a stale or low-accuracy reading flags the location as uncertain.
- Store provenance for every location: user-confirmed / geocoded / GPS-checked / manually overridden.
- A low-confidence or unresolved destination blocks automatic dispatch and requires review.

## 9. Data Model (Minimum)

| Entity | Key fields |
| --- | --- |
| **Warehouse** | id, name, coordinates/address, operating\_status |
| **Store** | id, name, validated\_address, coordinates, service\_zone, operating\_status |
| **SKU** | id, name, category, unit, storage\_class |
| **InventoryBatch** | id, warehouse\_id, sku\_id, usable\_quantity, expiry\_date (nullable), source, verification\_status |
| **DemandObservation** | store\_id, sku\_id, observed\_at, quantity, source, quality\_flags |
| **Forecast** | id, store\_id, sku\_id, horizon\_start, horizon\_end, predicted\_quantity, model\_version, model\_type (baseline / ml), generated\_at, wape, evaluation\_period |
| **Order** | id, store\_id, sku\_id, quantity, urgency, deadline, location\_validation\_state, lifecycle\_status, idempotency\_key |
| **Vehicle / Agent** | id, capacity\_kg, capacity\_volume, availability\_status, current\_assignment\_id, last\_seen\_at, location\_accuracy\_m, shift\_status |
| **RoutePlan** | id, version, origin\_warehouse\_id, destination\_store\_id, stops\_json, eta, distance\_km, cost\_estimate, source\_api, retrieved\_at, state |
| **DecisionRun** | id, trigger\_event\_id, input\_state\_version, objective\_config\_json, candidate\_plans\_json, constraints\_checked\_json, chosen\_action, approval\_state, approval\_actor, outcome, created\_at |
| **ExternalObservation** | id, source\_name, url, observed\_value, region, publication\_at, retrieved\_at, verification\_status, confidence\_score |
| **Notification** | id, idempotency\_key, recipient\_id, channel, trigger\_event\_id, status, provider\_reference, retry\_count, last\_attempted\_at |
| **AuditEvent** | id, actor\_id, actor\_type (user/service), action, object\_type, object\_id, timestamp, before\_ref, after\_ref, result, reason |

All timestamps are stored as UTC. Foreign keys reference the versioned state snapshot used when the entity was created or last modified. Plan version and input\_state\_version in DecisionRun enable full replay of any historical decision.

## 10. API and Event Contracts

All write operations require authentication and validated role permissions. Endpoint paths are indicative; exact names may be adjusted during implementation. All writes are idempotent: a repeated call with the same idempotency key is a no-op, not a duplicate.

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/orders` | POST | Create an order: destination, SKU, quantity, urgency, deadline, idempotency key |
| `/api/inventory/events` | POST | Record stock receipt, correction, dispatch, or shortage |
| `/api/agents/{id}/heartbeat` | POST | Update agent status and timestamped location/accuracy |
| `/api/agents/{id}/availability` | POST | Record availability or declared unavailability |
| `/api/events` | POST | Accept validated operational or external events with idempotency key |
| `/api/plans/optimize` | POST | Request a plan for a defined state/horizon; expensive work runs asynchronously |
| `/api/plans/{id}` | GET | Retrieve plan, objective breakdown, constraints checked, and lifecycle status |
| `/api/plans/{id}/approve` | POST | Record authorized approval or rejection with actor and timestamp |
| `/api/assignments/{id}/reassign` | POST | Request a validated manual reassignment with eligibility checks |
| `/api/routes/active` | GET | Retrieve current route geometry, ETA, freshness timestamp, and assignment info |
| `/api/external-observations` | POST | Store an RSS/search observation without treating it as verified |
| `/api/decision-runs/{id}` | GET | Retrieve trigger, reason, constraint checks, alternatives, result, and audit links |
| `/api/notifications/{id}/status` | GET | Retrieve notification lifecycle state and retry history |
| `/api/health` | GET | Service health, dependency status, and queue depth |

**Event contract requirements:**

- Every event must carry a unique `event_id` (UUID) and an `idempotency_key`.
- Retry-safe handlers: a repeated event may be delivered more than once by infrastructure but must not create a duplicate logical assignment or notification.
- Background jobs must expose `status`, `started_at`, `completed_at`, and `error` fields.
- Every failed job produces an error record retrievable without terminal access.

**WebSocket / real-time events:** The backend emits the following events to connected dashboards:

- `plan.committed` — map and dashboard refresh
- `agent.status_changed` — marker update
- `notification.status_updated` — notification panel update
- `decision_run.completed` — workflow trace update

## 11. Non-Functional Requirements

### Performance targets

All targets apply to the defined hackathon-scale dataset (3 warehouses, 10 stores, 10–20 SKUs, 5–10 agents) on a single-host Docker Compose deployment. External provider latency is measured separately.

| Metric | Target | Measurement method |
| --- | --- | --- |
| Decision pipeline p95 | ≤ 10 s event-to-recommendation, after routing inputs are available | Logged `event.received_at` → `decision_run.completed_at` |
| End-to-end update p95 | ≤ 15 s event to visible recommendation when external services respond normally | User-facing timestamp delta |
| Dashboard refresh p95 | ≤ 2 s from committed plan event to map/status update | WebSocket event → UI render log |
| Notification enqueue p95 | ≤ 2 s from plan commit to notification job enqueued | Outbox table `enqueued_at` |
| Hard-constraint violations | 0 in the acceptance test suite | Automated constraint validator |
| OR-Tools solver time | ≤ 5 s for the demo dataset (3×10×20 problem) | `solver.wall_time` logged per run |

### Reliability and resilience

- External API errors must not silently erase the current committed plan. The plan is preserved; the error is surfaced.
- If no feasible plan is found, the infeasibility reason and any unmet demand are reported; the last committed plan is preserved.
- Background jobs and notifications are retryable and idempotent: same `idempotency_key` → same outcome, no duplicate.
- Offline agent events retain timestamps and reconcile after reconnection.
- All cached routing, fuel, and location values display a freshness timestamp. Stale values are visually flagged.
- The system degrades gracefully: loss of the routing API → cached estimates with stale label; loss of n8n → backend state machine continues; loss of SMS provider → demo mode or failed status, no silent drop.

### Security

- JWT authentication with role-based access control (RBAC): roles Supply Chain Manager, Dispatcher, Warehouse Manager, Store Manager, Agent, Admin.
- API credentials (Google Maps, Twilio, LLM) stored in environment variables or a secret manager; never in frontend bundles, source code, or logs.
- RSS text, uploaded files, and external descriptions are treated as untrusted input; prompt-injection attempts do not alter decision logic.
- LLM output is schema-validated and passes through the same deterministic policy checks as any other input.
- Agent location collected only for active shift operations; retention policy is visible to authorized users.
- Security-relevant actions (plan approval, agent reassignment, credential change) are written to the audit trail.

### Maintainability

- Forecasting, optimization, routing, LLM, workflow, and notification responsibilities are each behind a service interface. Replacing a provider (e.g. swapping Google Maps for HERE) requires only the adapter, not the decision logic.
- The UI is downstream of stable API contracts. Visual changes must not alter decision semantics.
- All configurable thresholds (materiality, cooldown, WAPE minimum, weight coefficients) are stored in the database, not hardcoded.

## 12. Success Metrics and Acceptance Targets

All targets are **prototype acceptance targets on the defined demo dataset**. None constitutes a claim of real-world commercial performance.

| Metric | Definition | Target / pass condition | How measured |
| --- | --- | --- | --- |
| Demand forecast quality | WAPE on a chronological holdout period | ML model adopted only if WAPE improves ≥ 5% over seasonal-naive baseline; otherwise baseline is active and result reported | `forecast_evaluation` table, logged per model run |
| Constraint compliance | Plans in acceptance suite passing all hard checks | 100% pass, or explicitly marked infeasible — no silent violation | Automated constraint validator run against every generated plan |
| Optimization benefit | Objective value vs. static-allocation baseline on identical inputs | ≥ 5% lower objective in ≥ 2 of 3 controlled scenarios without hard-constraint violation; result reported even if target not met | Scenario runner logs objective components for both plans |
| Stock fulfilment rate | Demand fulfilled ÷ demand requested within planning horizon | Report baseline vs. optimized; target improvement in ≥ 1 stock-constrained scenario | Computed from committed plan vs. demand observations |
| Transportation cost | Sum of modelled route cost for committed plan | Report baseline vs. optimized on identical cost assumptions and identical routing data timestamps | Objective component breakdown in `decision_run` |
| Expiry exposure | Units with expiry before estimated consumption within risk horizon | Report baseline vs. optimized when verified batch/expiry data are available | Computed from `InventoryBatch.expiry_date` vs. plan ETA |
| Event-to-recommendation latency | Time from event acceptance to recommendation ready | p95 ≤ 10 s after routing inputs available on demo-sized data | `event.received_at` → `decision_run.completed_at` |
| Dashboard update latency | Time from plan commit to map/status visible | p95 ≤ 2 s under demo test setup | WebSocket event → UI render timestamp |
| Alert correctness | Logical notifications created once, tracked through provider states | 100% of test triggers create an auditable notification; 0 duplicate logical alerts in retry/idempotency tests | Notification table + provider callback log |
| Reassignment feasibility | Auto-committed reassignments passing all hard checks | 100% pass; unstarted vs. in-progress state handled explicitly | Constraint validator + acceptance test suite |
| Offline sync | Queued test events reconciled after reconnection | 100% of retained test events ingested exactly once; duplicates rejected; timestamps preserved | Integration test: offline queue → reconnect → audit comparison |
| Data provenance | External observations with source, timestamps, and verification status | 100% of fuel/search/RSS observations retain source, publication/retrieval time, and verification status | Query `ExternalObservation` table after each ingestion test |
| Explainability | Committed decisions with complete audit record | 100% of committed decisions have a retrievable record with trigger, input state, constraints, chosen action, approval, and result | `AuditEvent` query for every `DecisionRun` in the test suite |
| Scenario reset | Demo dataset reset without manual DB intervention | A single reset control restores the full seeded dataset in < 30 s | Timed reset test before demo |

## 13. Prototype Dataset and Evaluation Method

### Dataset

The prototype will use public retail/sales data where licensing and schema suitability permit, supplemented by explicitly labelled synthetic records.

**Candidate public source:** [Kaggle Store Sales — Time Series Forecasting](https://www.kaggle.com/competitions/store-sales-time-series-forecasting) or [Kaggle M5 Forecasting Accuracy](https://www.kaggle.com/competitions/m5-forecasting-accuracy). Dataset suitability, access rules, and licensing must be confirmed before use. These datasets supply sales history only; warehouse inventory, batch/expiry data, agent records, route costs, and vehicle capacities are synthetic.

**Synthetic records will be:**

- Clearly labelled as synthetic in the UI and in any reported metrics.
- Documented with their generation rules (e.g. vehicle capacity = Uniform(500, 2000) kg).
- Reproducible via a seeded random number generator committed to the repository.

### Evaluation method

1. Use chronological train / validation / test splits for forecasting. The test period is held out until evaluation; it never informs feature engineering.
2. Compare Random Forest forecasts with the seasonal-naive baseline on the same held-out dates using WAPE. Adopt ML only if improvement ≥ 5%; otherwise baseline is active.
3. Define a static allocation baseline: nearest eligible warehouse with available stock, ordered by store priority. Document the rule completely.
4. Run the optimizer and baseline on identical inventory, demand, capacity, route-estimate, and cost inputs.
5. Execute at least three controlled scenarios:
   - **Scenario A:** Urgent replenishment order + assigned agent becomes unavailable + route ETA increases.
   - **Scenario B:** Warehouse stock reduction mid-cycle + expiry-approaching batch.
   - **Scenario C:** External fuel-cost event (RSS) requiring corroboration before parameter update.
6. Record objective components and all hard-constraint checks for both plans in every scenario.
7. Label simulated events and results in the UI. Report them as simulated.
8. Do not treat synthetic savings as proof of commercial savings.

### Scenario reset control

A single UI control (or CLI command) restores the complete seeded dataset and clears all plans, events, and notifications in under 30 seconds — enabling judges to re-run any scenario from a clean state without manual database access.

## 14. Innovation and Differentiation

### The core mechanism: materiality-gated replanning with a decision guard

The dominant pattern in supply-chain automation is: trigger → optimize → commit. FlowGrid's distinguishing engineering contribution is the layer between optimize and commit — the **decision guard** — which makes the system behave fundamentally differently from any composition of a routing map, a chatbot, and a workflow tool:

- A plan that improves by less than the configured materiality threshold is **suppressed** — not committed, not surfaced as an alert. This directly solves route oscillation and notification floods, which are the primary failure modes of automated replanning systems.
- Data freshness is a **hard gate**, not a soft warning. A plan built on a stale route estimate cannot be auto-committed; it must be reviewed. This prevents the silent degradation that happens when cached data ages out of sync with real conditions.
- The guard's six sequential checks (constraint pass → freshness → materiality → cooldown → approval routing → idempotency) execute in a documented, testable, and auditable order. Every suppression and every approval routing decision is logged with its reason. No competitor tool in the hackathon context provides this.

### Differentiators in context

| What makes it novel | Why it cannot be off-the-shelf |
| --- | --- |
| Materiality-gated replanning | No routing API, map library, or workflow tool applies a domain-calibrated improvement threshold before publishing a route change |
| Forecast-to-constraint pipeline | Demand estimates directly feed an OR-Tools constraint model — not a chart or a recommendation card |
| Operationally aware reassignment | Agent workload, capacity, travel time, shift status, and in-progress delivery state are evaluated jointly before any reassignment is proposed |
| Confidence-aware external data | RSS observations are staged as candidates, not facts; the fuel parameter changes only after verifiable corroboration or authorized human confirmation |
| Transparent automation | The entire decision — trigger, inputs, constraints checked, alternatives, chosen action, approval, outcome — is retrievable as a structured audit record |
| Scenario-based evaluation | Judges can inject any of three predefined disruptions, observe the system's response, and compare metrics against the baseline on identical inputs — with a single reset control |

### What FlowGrid is not

FlowGrid is not a workflow canvas. It is not a map tool. It is not a chatbot. Those components exist in the system to visualize and coordinate; the differentiator is the domain-specific decision logic that determines what gets planned, when a plan changes, and why that change is safe to commit.

## 15. Risks, Mitigations, and Assumptions

| Risk / assumption | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Public retail data does not include local warehouse and route operations | High | Medium | Synthetic operational records, clearly labelled; generation rules documented |
| ML forecast performs worse than baseline | Medium | Low | Baseline is the fallback; comparison result reported regardless |
| OR-Tools finds no feasible solution | Low | High | Return infeasibility report with conflicting constraints; preserve last committed plan |
| Routing API unavailable, slow, or over quota | Medium | Medium | Documented fallback to cached haversine estimate with stale label; claim no live ETA |
| Agent location stale or permission unavailable | High | Medium | Show last-seen timestamp; flag location as uncertain; require manual review for location-dependent commits |
| RSS/search source contains incorrect or hostile content | Medium | High | Treat as untrusted; store metadata; require corroboration before changing fuel parameter; prompt-injection guard |
| Replanning creates route churn | Medium | High | Materiality threshold + cooldown window; suppress below-threshold changes with logged reason |
| LLM generates incorrect recommendation or follows hostile instructions | Low | High | Restrict LLM to bounded tasks (classification, explanation); validate output schema; all actions through deterministic policy checks |
| SMS delivery fails silently | Medium | Low | Track provider callbacks; expose failed/unknown status; demo mode available |
| DB/API load rises under repeated GPS and map requests | Medium | Medium | Indexes, pooling, Redis cache (TTL per resource type), background workers for expensive jobs |
| Team over-invests in workflow editor UI | Medium | High | Backend and decision pipeline first; predefined workflow stages are P0; editable canvas is P2 |
| Docker Compose single-host SPOF | High | Medium | Acceptable for hackathon; documented; production path calls for PostgreSQL replication + Redis HA |

### Assumptions

- A demo dataset of synthetic operational records is acceptable under the challenge brief.
- Google Maps API credentials and quota access are available; the prototype supports a labelled fallback mode if they are not.
- Twilio credentials are available for SMS demo; a clearly labelled demo mode is the fallback.
- All objective weights, thresholds, vehicle capacities, expiry records, and delivery deadlines used in simulation are documented in the repository.
- Automated actions are limited to the configured policy; high-impact or uncertain actions require human approval.
- External provider behaviour, latency, and coverage are outside the application's direct control and measured separately.

## 16. Implementation Plan

### Phase 1 — Backend foundation (hours 0–8)

- Define and migrate PostgreSQL schemas for all entities in §9.
- Seed warehouses, stores, SKUs, inventory batches, demand observations, agents, and orders from the reproducible dataset.
- Implement role-based auth (JWT), input validation, event IDs, idempotency handling, and audit-event writes.
- Stand up Docker Compose with all six services; confirm inter-container connectivity.

### Phase 2 — Decision engine (hours 8–16)

- Implement the seasonal-naive baseline forecast and Random Forest comparison with chronological split.
- Integrate Google Maps Routes API adapter with Redis TTL cache and haversine fallback.
- Build the OR-Tools optimization solver: hard constraints, objective components, and infeasibility reporting.
- Implement plan versioning, the decision guard (all six checks), and the FastAPI state machine (proposed → approved → committed).

### Phase 3 — Event automation (hours 16–22)

- Implement urgent-order and agent-unavailability event handlers with materiality threshold and cooldown.
- Add targeted replanning: re-evaluate only affected plan segments.
- Integrate Celery notification outbox: Twilio adapter or demo mode; retry-safe; idempotency keys.
- Add n8n workflows for RSS ingestion and external observation staging.

### Phase 4 — Map and workflow UI (hours 22–28)

- Build MapCN/MapLibre dashboard: warehouse/store/agent markers, active/proposed route overlays, stale-location indicators.
- Build workflow execution trace: predefined node graph, per-run status, timestamps, and error display.
- Build plan comparison view: current vs. proposed objective breakdown and KPI delta.
- Polish UI only after backend contracts and WebSocket events are stable.

### Phase 5 — Evaluation and demo hardening (hours 28–36)

- Run forecast holdout evaluation; log WAPE and baseline comparison.
- Execute all three controlled scenarios; verify objective improvement and constraint compliance.
- Test edge cases: stale route, offline sync, duplicate event delivery, API failure, infeasible plan.
- Verify all 14 success metrics from §12; remove any unsupported claims.
- Implement and test the scenario reset control.
- Prepare demo walkthrough script aligned to §17.

**Build order rationale:** Backend and decision engine are built before UI. A working optimizer with a terminal output is more valuable at hour 16 than a polished map with no solver behind it. The demo will run end-to-end on Scenario A with at least one live metric comparison.

## 17. Judge Demonstration Scenario

**Primary scenario (Scenario A — compound disruption):** A retail store creates an urgent replenishment order. Simultaneously, the assigned delivery agent becomes unavailable and a routing update raises the ETA for the original route above the store's required receipt window.

### Step-by-step walkthrough

1. **Baseline state.** Dashboard shows original inventory levels, committed allocation plan, active routes, and agent workloads. Objective breakdown is visible.
2. **Events enter the system.** The urgent order, agent-unavailability event, and route-delay event are submitted — manually via the UI or replayed from the seeded scenario.
3. **Validation.** System verifies order destination (geocoded), current usable stock at eligible warehouses, route estimate freshness, and agent status. Validation failures are shown inline.
4. **Targeted replanning.** Optimizer evaluates eligible warehouses and available agents against capacity, workload, ETA, and the delivery deadline. Only the affected plan segment is re-evaluated.
5. **Decision guard runs.** All six checks execute: constraint pass, freshness, materiality (≥ 2% improvement), cooldown, approval routing, idempotency. The guard's reasoning is logged and visible in the workflow trace.
6. **Approval or auto-commit.** If the action meets the low-risk auto-commit policy, it commits immediately. Otherwise the dispatcher sees the proposed reassignment with the reason and approves it with one click.
7. **Map updates.** New route appears on the map; original route is archived. Stale location indicators clear for the reassigned agent. ETA is updated.
8. **Notifications send.** Store manager and new agent receive SMS (Twilio) or labelled demo-mode notifications. The notification panel shows idempotency key, status, and retry history.
9. **Audit review.** The audit view shows: original plan → trigger events → decision run (inputs, constraints, alternatives, chosen action, approval) → new plan → notifications. The question "why did this plan change?" is answerable from the UI without terminal access.
10. **Metric comparison.** The UI shows baseline vs. revised objective components, stock fulfilment, and latency for this run. All results are labelled as simulated.

### Pass criteria

- Revised plan is feasible (all hard constraints pass).
- Reason for change is traceable to a structured audit record.
- Notifications are deduplicated (retry test: same event submitted twice → one logical notification).
- Map reflects the committed plan, not the proposed plan.
- If no feasible improvement exists, the system reports the infeasibility and preserves the current plan rather than inventing an improvement.
- Decision guard suppression test: submit a minor event that improves the objective by < 2% → confirm it is suppressed with a logged reason, not committed.

## 18. Definition of Done

The MVP is ready for submission when all of the following hold:

- [ ] Reproducible seeded dataset loads from a single command.
- [ ] Forecast holdout evaluation is available: WAPE for baseline and ML model, with the active model identified.
- [ ] Optimizer returns a validated allocation/assignment for at least one seeded scenario, or an explicit infeasibility report with constraint details.
- [ ] Decision guard runs on every plan commit: all six checks, logged results, suppression with reason when below threshold.
- [ ] At least one material event (Scenario A) triggers controlled targeted replanning and a committed revised plan.
- [ ] Agent reassignment supports eligibility checks, in-progress delivery protection, and manual dispatcher override.
- [ ] MapCN displays current and proposed route states with stale-data indicators and freshness timestamps.
- [ ] Notifications are logged with idempotency keys; retry test confirms zero duplicate logical alerts.
- [ ] Workflow execution trace shows every stage of at least one full scenario run without terminal access.
- [ ] Audit record answers "why did this plan change?" for every committed decision.
- [ ] External data provenance (source, retrieval time, verification status) is visible for all RSS/search observations.
- [ ] KPI report compares optimizer vs. baseline on identical inputs for at least two controlled scenarios.
- [ ] Scenario reset restores the full dataset in < 30 s.
- [ ] No unsupported claims of live integration, accuracy, or commercial savings are present in the UI or the report.
- [ ] All containers start with `docker-compose up`; no manual environment setup beyond `.env` configuration.

## 19. Technical References

- [MapCN documentation](https://www.mapcn.dev/docs) — React map components built on MapLibre GL.
- [Google Maps Routes API](https://developers.google.com/maps/documentation/routes) — route geometry, distance, and ETA calculations.
- [Google Maps Route Optimization API](https://developers.google.com/maps/documentation/route-optimization/overview) — optional fleet routing alternative; not to be run in parallel with OR-Tools.
- [Google OR-Tools Vehicle Routing](https://developers.google.com/optimization/routing) — CP-SAT and VRP solver for capacity, time-window, and multi-depot constraints.
- [Google OR-Tools CP-SAT](https://developers.google.com/optimization/reference/python/sat/python/cp_model) — constraint programming solver used for allocation objective.
- [n8n documentation](https://docs.n8n.io/) — workflow automation and integration orchestration.
- [FastAPI documentation](https://fastapi.tiangolo.com/) — Python API framework with async support.
- [Celery documentation](https://docs.celeryq.dev/) — distributed task queue for background workers and notification outbox.
- [scikit-learn RandomForestRegressor](https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.RandomForestRegressor.html) — ML model for demand forecasting.
- [Kaggle Store Sales — Time Series Forecasting](https://www.kaggle.com/competitions/store-sales-time-series-forecasting) — candidate public sales dataset.
- [Kaggle M5 Forecasting Accuracy](https://www.kaggle.com/competitions/m5-forecasting-accuracy) — candidate public retail forecasting dataset.
- [Twilio Messaging API](https://www.twilio.com/docs/sms) — SMS notification provider adapter.

---

**Submission summary:** FlowGrid's core contribution is a closed-loop distribution decision process anchored by a materiality-gated decision guard — a deterministic layer that prevents route oscillation, enforces data freshness, and routes every action through the correct approval path before commit. Its success will be demonstrated through three reproducible, judge-injectable scenarios and a measurable KPI comparison against a documented baseline — not through feature count or unverified claims.
