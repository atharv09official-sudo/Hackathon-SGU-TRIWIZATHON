AI-Powered Distribution Intelligence and Inventory Optimization Engine
Hackathon: SGU Triwizathon
Problem Statement 2: Distribution Intelligence and Inventory Optimization
Domain: FMCG distribution, demand forecasting, inventory planning, and dispatch optimization

FlowGrid is an AI-assisted decision-support platform designed to help FMCG distributors make better replenishment and dispatch decisions. It addresses a common distribution problem: some retail stores hold excess stock while others experience stockouts, even when inventory is available elsewhere in the network.

FlowGrid combines demand forecasting, inventory-health analysis, constrained allocation, expiry-aware batch selection, route-risk information, and explainable recommendations. Its goal is to reduce avoidable stockouts and expiry waste while making distribution decisions more transparent.
Results note: Benchmark figures in this README are based on the project's described simulations and test runs. They should not be interpreted as production results unless they have been independently reproduced using real operational data.

1. Problem Statement
FMCG distribution networks must balance product availability, transportation expense, warehouse stock, delivery schedules, store capacity, and product shelf life. Decisions based only on last week's sales or the nearest warehouse can result in:
- Stockouts at stores while usable inventory remains elsewhere.
- Excess inventory and avoidable expiry losses.
- Deliveries that arrive too late or with insufficient remaining shelf life.
- Unnecessary transportation costs.
- Poor visibility into why a particular store received a specific quantity.
FlowGrid evaluates these constraints together and produces a distribution plan that can be inspected by operators.
2. Proposed Solution
FlowGrid is designed to answer five operational questions:
1. Which products need replenishment?
2. What quantity should each store receive?
3. Which store should receive each shipment first?
4. Which eligible warehouse should supply the shipment?
5. Why was the recommendation made?
The system uses machine-learning models to estimate demand and deterministic optimization or allocation logic to make decisions under operational constraints. An optional local language model can explain the resulting plan, but it does not replace the forecasting or constraint-checking components.
3. Core Functional Modules
3.1 Inventory Dashboard
- Warehouse-level inventory visibility for WH-01 (Pune Central), WH-02 (Pune North), and WH-03 (Pimpri).
- Store-level on-hand stock, target stock, and estimated days of supply.
- Alerts for stores with critically low stock coverage.
- Inventory health classifications: CRITICAL_STOCKOUT_RISK, LOW_STOCK, BALANCED, and OVERSTOCKED_EXCESS.
3.2 Demand Forecasting
The forecasting module estimates future sales for each store and SKU using historical sales, calendar features, lagged demand, rolling statistics, price information, and promotion-related features where available.

Models described in the project include:
- Seasonal Naive: Baseline forecast using recent seasonal history, such as the value from seven days earlier.
- Random Forest: Baseline machine-learning forecaster.
- LightGBM Regressor: Gradient-boosted forecasting model.
- DeepDemandNet: PyTorch model using entity embeddings and a residual multilayer perceptron.
- Isolation Forest: Detects unusual sales patterns that may indicate data anomalies or demand shocks.
Models should be evaluated using chronological train, validation, and test splits. The Random Forest model is retained over the baseline only when it meets the project's specified improvement threshold of at least 5% relative WAPE.
3.3 Inventory Optimization
FlowGrid calculates replenishment needs rather than shipping forecast demand without considering current inventory.

Safety stock:
\[
SS_{s,k}=Z_{\alpha}\,\sigma_{s,k}\sqrt{LT}
\]
Target stock:
\[
Target_{s,k}=\hat{D}_{s,k}+SS_{s,k}
\]
Net replenishment:
\[
Replenishment_{s,k}=\max(0,Target_{s,k}-OnHand_{s,k}-InTransit_{s,k})
\]
Where:
- \(s\) represents a store.
- \(k\) represents a SKU.
- \(\hat{D}\) is forecast demand over the selected planning horizon.
- \(Z_{\alpha}\) is the selected service-level factor.
- \(\sigma\) represents demand uncertainty.
- \(LT\) is lead time.
The planning horizon, units, and lead-time convention must be consistent across these calculations.
3.4 Distribution Recommendation Engine
The engine generates an explainable dispatch plan containing the product, source warehouse, destination store, quantity, estimated cost, priority, and reason.

The allocation considers:
- Available warehouse inventory.
- Store replenishment requirements.
- Warehouse-to-store distance and estimated freight.
- Delivery windows and estimated transit time.
- Vehicle weight and volume limits where represented in the active scenario.
- Store backroom capacity where represented.
- Remaining shelf life and batch expiry.
- Stockout urgency and expected business value.
Example output format:
Product	Source	Destination	Quantity	Estimated cost	Priority	Explanation
Fortune Sunflower Oil 1L	WH-01	STORE-001	47 packets	₹8.47	P0 Immediate	Example: low store stock, eligible batch, and shorter route
Fortune Sun Lite Oil 1L	WH-01	STORE-001	22 packets	₹3.97	P1 High	Example: expiry-aware allocation and replenishment need
Fortune Cottonlite 1L	WH-01	STORE-002	8 packets	₹0.90	P2 Routine	Example: remaining inventory gap and eligible supply


These rows are illustrative examples from the project text. Their values should be checked against the current dataset and implementation before being used as live recommendations.

Priority levels are described as:
- P0_IMMEDIATE: urgent stock coverage, such as less than two days of supply.
- P1_HIGH: high priority, such as less than four days of supply.
- P2_ROUTINE: routine replenishment.
The precise thresholds should be configurable and consistently applied by the decision engine.
3.5 Shelf-Life and Expiry Management
The system uses the First-Expired, First-Out (FEFO) principle when selecting inventory batches. It can prioritize batches approaching expiry and check whether they are suitable for a destination after accounting for transit time and the store's minimum remaining shelf-life requirement.

A batch should be eligible only when its projected remaining shelf life at arrival meets the relevant store or contractual threshold. The project describes a 70% minimum arrival shelf-life threshold for its HETVAYA allocation benchmark. Confirm the threshold and its calculation against the active FlowGrid implementation before treating it as a universal rule.

Near-expiry stock should be routed only to stores where it can reasonably be sold before expiry. The system should not claim guaranteed sell-through unless supported by validated demand and shelf-life evidence.
3.6 Local LLM Explanations
The project includes local Ollama integration for explaining plan recommendations and extracting potential causal factors, such as:
- Promotion-related demand changes.
- Low stock coverage and stockout exposure.
- Recent demand trends.
- Expiry urgency and route considerations.
The language model should explain facts returned by the forecasting and optimization components rather than inventing inventory values or making allocation decisions independently. If Ollama is unavailable or times out, the application can use deterministic explanations. The fallback behavior and timeout should be verified through automated tests.
3.7 Road-Risk and Delivery Replanning
The project also describes models and rules for identifying possible Maharashtra transit delays and route hazards using features such as rainfall, visibility, potholes, congestion, terrain, and corridor information.

Delivery-agent status and GPS heartbeat data can support reassignment when an agent becomes unavailable or a route is disrupted. Replanning must revalidate stock, capacity, route feasibility, and delivery constraints before a revised plan is committed.
3.8 Web Dashboard and Store Interface
The frontend is described as a React and TypeScript application with:
- Planner and dispatch views.
- Forecast review and benchmark comparison.
- Warehouse operations and FEFO pick-slip views.
- Store-management/POS views.
- Master-data import and validation.
- Offline event queuing and synchronization.
- English, Hindi, and Marathi interface options.
- Map-based views for warehouses, stores, and distribution corridors.
The interface should clearly distinguish live data, sample data, simulated values, and stale offline records.
4. Optimization Approach
The project describes two related approaches in different parts of its implementation:
1. OR-Tools CP-SAT optimization: a constrained stock-allocation approach that aims to satisfy hard constraints while minimizing the selected objective.
2. Greedy marginal-value knapsack allocation: an in-memory heuristic that prioritizes candidate cases using expected marginal value, freight and holding costs, and storage-space requirements.
These are different optimization strategies. The application documentation and demo should state which engine is used for each workflow instead of implying that the heuristic and CP-SAT solver are the same component.

The described marginal-value heuristic uses the following sequence:
1. Remove batches that fail the minimum arrival shelf-life requirement.
2. Estimate the cost of delivery lateness relative to store stock coverage.
3. Estimate marginal case value using demand probabilities and the chance of sale before expiry.
4. Rank candidate cases by value per unit of constrained storage space.
5. Allocate only within available inventory and the applicable store and delivery limits.
An example marginal-density expression is:
\[
Density=\frac{Expected\ Case\ Margin-(Route\ Freight+Holding\ Cost)}{Space\ Per\ Case}
\]
The objective and cost units should be defined consistently in the implementation and benchmark documentation.
5. Machine-Learning and Decision Components
Component	Purpose	Method described
Seasonal Naive	Forecast baseline	Seven-day seasonal lag
Random Forest	Baseline ML forecast	RandomForestRegressor
LightGBM	Demand forecasting	LGBMRegressor
Isolation Forest	Outlier detection	IsolationForest
OR-Tools CP-SAT	Constrained allocation	cp_model.CpModel
DeepDemandNet	Neural demand forecasting	PyTorch embeddings and residual MLP
Ollama LLM	Plan explanations and disruption parsing	Local LLM API
RoadRiskDelayPredictor	Transit-delay estimation	LightGBM and Random Forest, as described
DeepRoadwayDispatchNet	Multi-entity dispatch modelling	PyTorch embeddings and residual MLP
MaharashtraDecisionGuard	Operational safety checks	Deterministic rule-based validation


Reported model metrics, such as road-delay MAE/R² or neural-network WAPE, should be accompanied by dataset details, evaluation splits, units, and reproducible commands. Do not present them as independently verified performance without that evidence.
6. Neural Model Training
The project describes three training cycles for DeepDemandNet:
Cycle	Focus	Learning rate	Reported train loss	Reported validation WAPE
1	Global manifold alignment	0.0015	5.1468	19.33%
2	Hard-sample residual backpropagation	0.0005	4.3028	16.68%
3	Bias calibration and regularization	0.0001	4.2639	16.16%


These values are reproduced from the supplied project notes. For a reproducible report, also record the dataset version, feature set, split dates, random seeds, training configuration, and evaluation script.
7. Benchmark Results
7.1 Simulated Network Comparison
The project text describes a comparison of three distribution policies across 20 simulated networks and nine replenishment cycles per network, giving 180 decision runs.
- Current practice: last week's sales, nearest warehouse, and limited expiry/capacity checks.
- Textbook baseline: order-up-to replenishment, safety stock, eligible-nearest-warehouse selection, FEFO, and capacity checks.
- FlowGrid/HETVAYA allocation engine: marginal-value allocation, arrival shelf-life filtering, lateness-aware sourcing, and backroom capacity enforcement.
The following figures are reported in the supplied notes and should be reproduced from the benchmark output before external publication.
Metric	Current practice	Textbook baseline	Advanced allocation engine
Mean stockout units	23,272	19,364	9,569
Fill rate	59.1%	66.0%	83.2%
Total waste units	12,969	9,627	8,703
Transport freight	₹45,670	₹44,410	₹52,694
Lost margin	₹1,042,248	₹866,476	₹242,261
Feasible solves	180/180	180/180	180/180
Reported solve time	Not reported	Not reported	p50: 0.51 ms; p95: 0.89 ms


Trade-off: The advanced allocation engine reports higher freight costs than the textbook baseline, while reporting lower stockouts, lower total waste, and lower lost margin in these simulations. This trade-off should be presented explicitly.

The source notes also report paired statistical tests over 20 seeds. Those claims should be checked against the raw per-seed results and benchmark script. In particular, ensure that percentage differences, confidence intervals, and p-values are calculated from the same defined metric and comparison.
7.2 Separate CLI Benchmark Summary
The supplied notes also report these prototype acceptance results:
Test	Reported result
Data leakage and temporal split checks	0 leaks and 0 NaNs reported
Random Forest vs. Seasonal Naive	Reported to exceed the 5% relative WAPE improvement gate
Hard allocation constraints	0 violations reported
Controlled scenario objective	Target achieved in 2 of 3 scenarios
Anomaly detection	Shock detected and clamped in the test
Solver wall time	0.29 seconds reported against a 10-second limit
Unit tests	15/15 reported passing in test_models.py


The notes report six of six acceptance checks passing. Treat these as project-reported test outcomes until confirmed by running the current repository and reviewing its generated reports.

Do not combine the CLI acceptance figures with the separate 20-network frontend benchmark as though they came from one experiment. They use different reported metrics and may represent different implementations or test scenarios.
8. System Architecture and Technology Stack
Frontend
- React 19
- TypeScript
- Tailwind CSS v4
- Recharts
- Lucide React
- Vite
Backend and persistence
- FastAPI
- Python 3.11+
- SQLAlchemy 2.0
- Alembic migrations
- PostgreSQL or SQLite, depending on configuration
Data science and optimization
- Pandas and NumPy
- Scikit-learn
- LightGBM
- PyTorch
- Joblib
- OR-Tools, where the CP-SAT workflow is enabled
Local language-model integration
- Ollama
- A locally configured supported model, such as Llama or another model installed on the machine
Main repository areas
project-root/
├── app/                         # FastAPI backend and API endpoints
├── alembic/                     # Database migrations
├── models/                      # Forecasting and decision models
├── src/
│   ├── components/              # React views and dashboard components
│   ├── services/                # Frontend services
│   ├── data/                    # Sample/reference data
│   ├── types/                   # TypeScript types
│   ├── App.tsx                  # Main application
│   └── main.tsx                 # Frontend entry point
├── scripts/                     # Pipeline and benchmark scripts
├── tests/                       # Automated tests
├── docs/                        # PRDs and technical documentation
├── saved_models/                # Generated model artifacts and reports
├── results/                     # Benchmark outputs
├── requirements.txt
├── package.json
└── README.md
This is a consolidated logical structure based on the supplied notes. Confirm actual paths against the checked-out repository before relying on it as an exact directory listing.
9. Running the Application
Commands below are based on the supplied project notes. Run them from the relevant repository directory and adjust environment activation for your operating system.
9.1 Install Python dependencies
python -m venv .venv
On Windows:
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
On macOS/Linux:
source .venv/bin/activate
pip install -r requirements.txt
9.2 Configure and migrate the database
Review the project's environment configuration and database URL before running migrations.
alembic upgrade head
9.3 Start the backend
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
API documentation, when the backend is running:
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc
9.4 Start the frontend
In a separate terminal:
npm install
npm run dev
Open http://localhost:5173 if that is the port configured by the Vite project.
9.5 Run tests and build checks
python -m pytest tests/ -v
npm run build
npm run lint
Run only commands that are defined in the repository's current configuration. If a script is not present in package.json or a Python entry point is absent, use the actual command provided by the project.
9.6 Run the model pipeline and CLI
The supplied notes describe the following commands. Confirm that each command and option exists in the current version before running it.
python pipeline_runner.py
python flowgrid_cli.py recommend --top-skus 20 --stores 12
python flowgrid_cli.py road-risk --corridor COR-NH48 --rainfall 24.5
python flowgrid_cli.py guard
python flowgrid_cli.py ollama --model llama3
python flowgrid_cli.py -i
python flowgrid_cli.py optimize
python flowgrid_cli.py forecast --sku SKU-001
python flowgrid_cli.py loop-train --dataset maharashtra --epochs 3 --no-prompt
python flowgrid_cli.py scenario
python flowgrid_cli.py test
python flowgrid_cli.py audit
The model pipeline is described as writing artifacts to saved_models/, including a demand-forecasting artifact, anomaly detector, neural-network weights, pipeline summary, and PRD test report. Actual filenames depend on the current implementation.
10. Data, Evaluation, and Auditability
The project describes synthetic FMCG data, inventory batches, warehouse and store records, vehicle and agent information, route estimates, and order data. It also references a Maharashtra roadway dataset and a 100-SKU FMCG dataset.

For reliable evaluation:
- Keep training, validation, and test data chronologically separated.
- Prevent future information from entering training features.
- Compare machine-learning forecasts with a simple seasonal baseline.
- Report WAPE, MAE, and forecast bias with their definitions.
- Evaluate allocation policies on identical demand scenarios.
- Record random seeds, configuration, constraints, and software versions.
- Preserve a decision audit trail containing inputs, selected model/version, constraints, recommendation, and outcome.
- Distinguish synthetic, imported, cached, and live operational data.
The source notes mention a 5% relative WAPE improvement threshold for adopting Random Forest over the Seasonal Naive baseline. The acceptance test should calculate that threshold consistently and document the exact formula.
11. Limitations and Disclosures
1. Synthetic data: The benchmark network is described as simulated and calibrated using typical FMCG assumptions. It is not a substitute for validation against real ERP, inventory, sales, and delivery records.
2. Freight model: The frontend benchmark describes per-case route costs and lateness penalties. It does not necessarily represent a complete multi-stop vehicle-routing model or real-world tariff schedule.
3. Offline synchronization: The offline POS flow is described as a browser prototype with local event queuing and timestamp-based reconciliation. Production use would require stronger conflict handling, device testing, authentication, and data-integrity controls.
4. Optimization methods: The notes describe both a greedy allocation heuristic and an OR-Tools CP-SAT optimizer. Their scope and use must be clearly separated in the architecture and demo.
5. LLM reliability: Deterministic fallback behavior must be tested. A local LLM should not be treated as a guarantee of factual correctness.
6. Performance claims: Metrics such as model accuracy, solve time, cost reduction, and stockout reduction depend on the selected dataset, constraints, and evaluation method. Publish them with reproducible evidence.
7. Operational deployment: Real deployment requires access control, secure configuration, monitoring, backup and recovery, data validation, and integration testing.
12. Suggested Demonstration Flow
A clear judge-facing walkthrough can follow this sequence:
1. Import or load a sample network and validate the master data.
2. Review warehouse inventory and store stock coverage.
3. Generate demand forecasts and compare them with the seasonal baseline.
4. Calculate net replenishment needs.
5. Generate an expiry-aware, capacity-constrained distribution plan.
6. Inspect the reason behind each recommendation.
7. Simulate a disruption, such as a route delay or unavailable delivery agent.
8. Replan and verify that inventory, capacity, and shelf-life constraints remain satisfied.
9. Compare the proposed plan with the baseline using the same demand scenario.
10. Open the audit trail and show the input data, decisions, and test evidence.
13. Project Summary
FlowGrid brings together demand forecasting, inventory optimization, expiry-aware allocation, distribution planning, and explainable decision support for FMCG networks. Its key design principle is to separate prediction from decision-making: machine-learning models estimate demand and potential risks, while deterministic rules and optimization components enforce operational constraints.

The next step toward production readiness is to validate all reported benchmarks against reproducible scripts, reconcile the allocation-engine descriptions, and test the system against real or carefully validated operational data.
Developed for: SGU Triwizathon, Problem Statement 2
License: MIT, as stated in the supplied project notes. Confirm the repository's LICENSE file before
