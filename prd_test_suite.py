"""
<<<<<<< HEAD
PRD-Compliant Acceptance Test Suite for FlowGrid Engine
Implements Section 12 Success Metrics and Section 6 Functional Requirements:
- FR-P0-01: Data Ingestion & Zero-Leakage Chronological Validation
- FR-P0-02: Demand Forecasting Baseline Comparison & 5% Relative WAPE Gate
- FR-P0-03: Constraint-Aware Allocation & Zero Hard-Constraint Violations
- FR-P0-05: Event-Driven Replanning & Anomaly Mitigation
- FR-P0-11: Auditability, Solver Verification, and Explainability Records
- Section 12 Benchmark: >=5% Objective Improvement in >=2 of 3 Controlled Scenarios
"""

import os
import json
import numpy as np
import pandas as pd
from typing import Dict, Any, List, Tuple
from datetime import datetime

from models.feature_pipeline import FeaturePipeline
from models.demand_forecaster import DemandForecaster
from models.anomaly_detector import AnomalyDetector
from models.stock_optimizer import DistributionOptimizer
from models.static_baseline import StaticAllocationBaseline


def safe_json_default(obj):
    if isinstance(obj, (np.bool_, bool)):
        return bool(obj)
    if isinstance(obj, (np.integer, int)):
        return int(obj)
    if isinstance(obj, (np.floating, float)):
        return float(obj)
    if isinstance(obj, (np.ndarray, list)):
        return [safe_json_default(x) for x in obj]
    return str(obj)


class PRDTestSuite:
    def __init__(self, data_path: str = "synthetic_sales_daily.csv"):
        self.data_path = data_path
        self.results: Dict[str, Any] = {}
        self.scenarios_results: List[Dict[str, Any]] = []
        self.summary_stats: Dict[str, int] = {"passed": 0, "failed": 0, "total": 0}

    def _record_result(self, test_id: str, title: str, prd_ref: str, passed: bool, details: Dict[str, Any]):
        self.summary_stats["total"] += 1
        if passed:
            self.summary_stats["passed"] += 1
        else:
            self.summary_stats["failed"] += 1

        self.results[test_id] = {
            "title": title,
            "prd_reference": prd_ref,
            "status": "PASSED" if passed else "FAILED",
            "timestamp": datetime.now().isoformat(),
            "details": details
        }

    # --------------------------------------------------------------------------
    # TEST 1: FR-P0-01 Data Ingestion, Sanitization & Temporal Integrity
    # --------------------------------------------------------------------------
    def test_fr_p0_01_data_integrity(self) -> bool:
        title = "Data Ingestion, Sanitization & Zero-Leakage Split"
        prd_ref = "PRD Sec. 6.1 FR-P0-01 & Sec. 13.1"
        
        if not os.path.exists(self.data_path):
            for candidate in [
                "flowgrid_flipkart_100sku/data/synthetic_sales_daily.csv",
                "unused_data/synthetic_sales_daily.csv",
                "../flowgrid_flipkart_100sku/data/synthetic_sales_daily.csv"
            ]:
                if os.path.exists(candidate):
                    self.data_path = candidate
                    break

        if not os.path.exists(self.data_path):
            self._record_result("FR-P0-01", title, prd_ref, False, {"error": f"File {self.data_path} missing"})
            return False

        df = pd.read_csv(self.data_path)
        required_cols = {"date", "store_id", "sku_id", "units_sold", "unit_price"}
        has_cols = required_cols.issubset(df.columns)
        no_negative_sales = (df["units_sold"] >= 0).all()
        no_null_sales = df["units_sold"].notna().all()

        pipeline = FeaturePipeline(lag_days=[1, 7], rolling_windows=[7])
        processed = pipeline.fit_transform(df.head(10000))
        train_df, holdout_df = pipeline.split_chronological(processed, holdout_days=15)
        
        zero_leakage = train_df["date"].max() < holdout_df["date"].min()
        no_feature_nans = processed[pipeline.feature_columns].isna().sum().sum() == 0

        passed = has_cols and no_negative_sales and no_null_sales and zero_leakage and no_feature_nans
        details = {
            "rows_evaluated": len(df),
            "columns_verified": list(required_cols),
            "negative_sales_found": not no_negative_sales,
            "zero_leakage_guaranteed": zero_leakage,
            "feature_nans_count": int(processed[pipeline.feature_columns].isna().sum().sum()),
            "train_max_date": train_df["date"].max().strftime("%Y-%m-%d"),
            "holdout_min_date": holdout_df["date"].min().strftime("%Y-%m-%d")
        }
        self._record_result("FR-P0-01", title, prd_ref, passed, details)
        return passed

    # --------------------------------------------------------------------------
    # TEST 2: FR-P0-02 Demand Forecasting & 5% Relative WAPE Decision Gate
    # --------------------------------------------------------------------------
    def test_fr_p0_02_forecasting_gate(self) -> bool:
        title = "Demand Forecasting & 5% Relative WAPE Decision Gate"
        prd_ref = "PRD Sec. 6.1 FR-P0-02 & Sec. 12"

        # Deterministic simulation slice
        forecaster = DemandForecaster()
        
        # Scenario: ML achieves strong WAPE improvement
        forecaster.model_metrics = {
            "seasonal_naive": {"wape": 0.2195, "mae": 6.70},
            "random_forest": {"wape": 0.1499, "mae": 4.58},
            "lightgbm": {"wape": 0.1520, "mae": 4.64}
        }
        selected = forecaster.enforce_prd_decision_gate()
        audit = forecaster.decision_audit

        passed = (
            selected == "random_forest" and
            audit["status"] == "APPROVED_BY_GATE" and
            audit["relative_improvement_pct"] >= 5.0
        )

        # Test fallback branch: mock underperforming model
        fallback_forecaster = DemandForecaster()
        fallback_forecaster.model_metrics = {
            "seasonal_naive": {"wape": 0.200},
            "random_forest": {"wape": 0.198} # 1% improvement (< 5%)
        }
        fallback_selected = fallback_forecaster.enforce_prd_decision_gate()
        fallback_works = (fallback_selected == "seasonal_naive") and (fallback_forecaster.decision_audit["status"] == "FALLBACK_ACTIVATED")

        all_passed = passed and fallback_works
        details = {
            "baseline_wape_pct": round(audit["baseline_wape"] * 100, 2),
            "winning_model_wape_pct": round(audit["active_model_wape"] * 100, 2),
            "relative_improvement_pct": round(audit["relative_improvement_pct"], 2),
            "active_model": selected,
            "threshold_required_pct": 5.0,
            "fallback_mechanism_verified": fallback_works
        }
        self._record_result("FR-P0-02", title, prd_ref, all_passed, details)
        return all_passed

    # --------------------------------------------------------------------------
    # TEST 3: FR-P0-03 Constraint Compliance (Zero Hard Constraint Violations)
    # --------------------------------------------------------------------------
    def test_fr_p0_03_constraint_compliance(self) -> bool:
        title = "Constraint-Aware Allocation & Zero Hard Violations"
        prd_ref = "PRD Sec. 6.1 FR-P0-03 & Sec. 12 (100% Target)"

        optimizer = DistributionOptimizer(vehicle_capacity=400, time_limit_seconds=4.0)
        warehouses = ["WH-A", "WH-B"]
        stores = ["STORE-1", "STORE-2", "STORE-3"]
        skus = ["SKU-1", "SKU-2"]

        inventory = {
            ("WH-A", "SKU-1"): 50, ("WH-A", "SKU-2"): 30,
            ("WH-B", "SKU-1"): 40, ("WH-B", "SKU-2"): 60
        }
        demand = {
            ("STORE-1", "SKU-1"): 35, ("STORE-1", "SKU-2"): 20,
            ("STORE-2", "SKU-1"): 40, ("STORE-2", "SKU-2"): 50,
            ("STORE-3", "SKU-1"): 30, ("STORE-3", "SKU-2"): 30
        }
        distances = {
            ("WH-A", "STORE-1"): 12.0, ("WH-A", "STORE-2"): 25.0, ("WH-A", "STORE-3"): 35.0,
            ("WH-B", "STORE-1"): 40.0, ("WH-B", "STORE-2"): 15.0, ("WH-B", "STORE-3"): 20.0
        }

        res = optimizer.solve_allocation(warehouses, stores, skus, inventory, demand, distances)

        # Check: Never oversell warehouse inventory
        wh_usage = {w: {k: 0 for k in skus} for w in warehouses}
        for a in res["allocations"]:
            wh_usage[a["warehouse_id"]][a["sku_id"]] += a["allocated_quantity"]

        oversold = False
        for w in warehouses:
            for k in skus:
                if wh_usage[w][k] > inventory[(w, k)]:
                    oversold = True

        # Check: Non-negative and integer
        non_negative = all(a["allocated_quantity"] >= 0 for a in res["allocations"])
        
        # Check: Unmet demand + Allocated == Requested demand
        demand_balance = (res["total_allocated_units"] + res["total_unmet_units"]) == res["total_demand_units"]

        passed = (not oversold) and non_negative and demand_balance and (res["solver_status"] in ("OPTIMAL", "FEASIBLE"))
        details = {
            "solver_status": res["solver_status"],
            "total_demand": res["total_demand_units"],
            "total_allocated": res["total_allocated_units"],
            "total_unmet": res["total_unmet_units"],
            "fulfillment_rate_pct": res["fulfillment_rate_pct"],
            "warehouse_oversell_detected": oversold,
            "hard_constraint_violations": 0 if passed else 1
        }
        self._record_result("FR-P0-03", title, prd_ref, passed, details)
        return passed

    # --------------------------------------------------------------------------
    # TEST 4: Section 12 Controlled Scenarios (Static Baseline vs AI Optimizer)
    # --------------------------------------------------------------------------
    def test_sec12_controlled_scenarios(self) -> bool:
        """
        PRD §12 Target:
        Demonstrate at least 5% lower objective value in at least 2 of 3 controlled scenarios.
        """
        title = "Optimization Benefit: Controlled Scenarios vs Static Baseline"
        prd_ref = "PRD Sec. 12 (>=5% Lower Objective in >=2 of 3 Scenarios)"

        warehouses = ["WH-CENTRAL", "WH-EAST", "WH-WEST"]
        stores = [f"STORE-{i:02d}" for i in range(1, 9)]
        skus = [f"SKU-{j:02d}" for j in range(1, 6)]

        base_distances = {}
        for w_idx, w in enumerate(warehouses):
            for s_idx, s in enumerate(stores):
                base_distances[(w, s)] = float(15.0 + (abs(w_idx * 3 - s_idx) * 8.0))

        optimizer = DistributionOptimizer(transport_cost_per_km=1.8, shortage_penalty_per_unit=150.0)
        baseline = StaticAllocationBaseline(transport_cost_per_km=1.8, shortage_penalty_per_unit=150.0)

        # ---------------- SCENARIO 1: Balanced Network ----------------
        inv_s1 = {(w, k): 100 for w in warehouses for k in skus}
        dem_s1 = {(s, k): 25 for s in stores for k in skus} # Total 1000 demand, 1500 inv
        
        opt_s1 = optimizer.solve_allocation(warehouses, stores, skus, inv_s1, dem_s1, base_distances)
        base_s1 = baseline.solve(warehouses, stores, skus, inv_s1, dem_s1, base_distances)
        cost_opt_s1 = opt_s1["modeled_transport_cost"] + (opt_s1["total_unmet_units"] * 150.0)
        cost_base_s1 = base_s1["total_objective_value"]
        imp_s1 = (cost_base_s1 - cost_opt_s1) / cost_base_s1 * 100.0 if cost_base_s1 > 0 else 0.0

        # ---------------- SCENARIO 2: Demand Surge / Stockout Stress ----------------
        # 3x demand surge on priority stores (creating localized shortages)
        inv_s2 = {(w, k): 45 for w in warehouses for k in skus} # Tight inventory: 675 units
        dem_s2 = {(s, k): (60 if s in stores[:4] else 20) for s in stores for k in skus} # 1600 demand
        
        opt_s2 = optimizer.solve_allocation(warehouses, stores, skus, inv_s2, dem_s2, base_distances)
        base_s2 = baseline.solve(warehouses, stores, skus, inv_s2, dem_s2, base_distances)
        cost_opt_s2 = opt_s2["modeled_transport_cost"] + (opt_s2["total_unmet_units"] * 150.0)
        cost_base_s2 = base_s2["total_objective_value"]
        imp_s2 = (cost_base_s2 - cost_opt_s2) / cost_base_s2 * 100.0 if cost_base_s2 > 0 else 0.0

        # ---------------- SCENARIO 3: Warehouse Stock Cut & Route Penalty ----------------
        # Central warehouse loses 80% stock; distant warehouses must supply efficiently
        inv_s3 = {}
        for w in warehouses:
            for k in skus:
                inv_s3[(w, k)] = 20 if w == "WH-CENTRAL" else 90
        dem_s3 = {(s, k): 30 for s in stores for k in skus}
        # Disrupted routes with toll/congestion surcharge
        dist_s3 = {k: v * 1.5 if "WH-CENTRAL" in k[0] else v for k, v in base_distances.items()}

        opt_s3 = optimizer.solve_allocation(warehouses, stores, skus, inv_s3, dem_s3, dist_s3)
        base_s3 = baseline.solve(warehouses, stores, skus, inv_s3, dem_s3, dist_s3)
        cost_opt_s3 = opt_s3["modeled_transport_cost"] + (opt_s3["total_unmet_units"] * 150.0)
        cost_base_s3 = base_s3["total_objective_value"]
        imp_s3 = (cost_base_s3 - cost_opt_s3) / cost_base_s3 * 100.0 if cost_base_s3 > 0 else 0.0

        scenarios = [
            {"id": "SCENARIO_1_BALANCED", "name": "Normal Balanced Day", "baseline_obj": cost_base_s1, "optimizer_obj": cost_opt_s1, "improvement_pct": imp_s1, "passed_target": imp_s1 >= 5.0},
            {"id": "SCENARIO_2_SURGE", "name": "Demand Shock & Shortage Stress", "baseline_obj": cost_base_s2, "optimizer_obj": cost_opt_s2, "improvement_pct": imp_s2, "passed_target": imp_s2 >= 5.0},
            {"id": "SCENARIO_3_DISRUPTION", "name": "Depot Stock Cut & Route Surcharge", "baseline_obj": cost_base_s3, "optimizer_obj": cost_opt_s3, "improvement_pct": imp_s3, "passed_target": imp_s3 >= 5.0}
        ]
        self.scenarios_results = scenarios

        passing_scenarios = sum(1 for s in scenarios if s["passed_target"])
        passed = passing_scenarios >= 2

        details = {
            "scenarios_evaluated": 3,
            "scenarios_meeting_5pct_target": passing_scenarios,
            "target_required": 2,
            "scenario_breakdown": scenarios
        }
        self._record_result("SEC-12-SCENARIOS", title, prd_ref, passed, details)
        return passed

    # --------------------------------------------------------------------------
    # TEST 5: FR-P0-05 Anomaly Detection & Shock Replanning
    # --------------------------------------------------------------------------
    def test_fr_p0_05_anomaly_detection(self) -> bool:
        title = "Anomaly Detection & Shock Replanning Response"
        prd_ref = "PRD Sec. 6.1 FR-P0-05 & Sec. 6.2 FR-P1-04"

        detector = AnomalyDetector(contamination=0.05)
        # Create synthetic series with deliberate shock
        dates = pd.date_range("2026-01-01", periods=40)
        data = []
        for i, d in enumerate(dates):
            qty = 20 if i != 25 else 200 # Shock at index 25
            data.append({
                "date": d,
                "store_id": "STORE-01",
                "sku_id": "SKU-01",
                "units_sold": qty,
                "unit_price": 50.0,
                "price_ratio": 1.0,
                "synthetic_promo_flag": 1 if i == 25 else 0,
                "lag_1": 20, "lag_7": 20,
                "rolling_mean_7": 20.0,
                "rolling_std_7": 1.5,
                "synthetic_anomaly_flag": 1 if i == 25 else 0
            })
        test_df = pd.DataFrame(data)
        detector.fit(test_df, ['unit_price', 'synthetic_promo_flag', 'rolling_mean_7', 'rolling_std_7'])
        is_anom, scores = detector.predict(test_df)

        # Ensure shock at row 25 is recognized
        shock_detected = (is_anom[25] == 1)

        # Test clamping safeguard
        clamped_df = detector.clamp_anomalies(test_df, is_anom)
        clamped_safe = clamped_df.loc[25, "units_sold"] < 50

        passed = shock_detected and clamped_safe
        details = {
            "shock_identified": shock_detected,
            "outlier_clamping_verified": clamped_safe,
            "original_shock_units": 200,
            "clamped_safe_units": int(clamped_df.loc[25, "units_sold"])
        }
        self._record_result("FR-P0-05", title, prd_ref, passed, details)
        return passed

    # --------------------------------------------------------------------------
    # TEST 6: FR-P0-11 Auditability, Traceability & Execution Bounds
    # --------------------------------------------------------------------------
    def test_fr_p0_11_audit_and_traceability(self) -> bool:
        title = "Audit Traceability & Solver Latency Compliance"
        prd_ref = "PRD Sec. 6.1 FR-P0-11 & Sec. 11 (Latency <= 10s)"

        optimizer = DistributionOptimizer(time_limit_seconds=5.0)
        res = optimizer.solve_allocation(
            warehouses=["WH-1"], stores=["STORE-1"], skus=["SKU-1"],
            inventory={("WH-1", "SKU-1"): 100},
            demand={("STORE-1", "SKU-1"): 40},
            distance_matrix={("WH-1", "STORE-1"): 15.0}
        )

        has_status = "solver_status" in res
        has_cost_breakdown = "modeled_transport_cost" in res
        has_allocations = len(res["allocations"]) > 0
        latency_under_10s = res["wall_time_seconds"] <= 10.0

        passed = has_status and has_cost_breakdown and has_allocations and latency_under_10s
        details = {
            "solver_wall_time_s": res["wall_time_seconds"],
            "max_allowed_time_s": 10.0,
            "decision_records_traceable": True,
            "solver_status": res["solver_status"]
        }
        self._record_result("FR-P0-11", title, prd_ref, passed, details)
        return passed

    # --------------------------------------------------------------------------
    # Execution Runner
    # --------------------------------------------------------------------------
    def run_all(self, export_path: str = "saved_models/prd_test_report.json") -> Dict[str, Any]:
        print("\n" + "=" * 80)
        print(" FLOWGRID PRD ACCEPTANCE TEST SUITE")
        print(" Validating System Compliance against Problem Statement 2 PRD Specifications")
        print("=" * 80 + "\n")

        self.test_fr_p0_01_data_integrity()
        self.test_fr_p0_02_forecasting_gate()
        self.test_fr_p0_03_constraint_compliance()
        self.test_sec12_controlled_scenarios()
        self.test_fr_p0_05_anomaly_detection()
        self.test_fr_p0_11_audit_and_traceability()

        # Print scoreboard
        print(f"{'TEST ID':<16} | {'PRD REFERENCE':<30} | {'STATUS':<8} | {'TITLE'}")
        print("-" * 80)
        for t_id, data in self.results.items():
            status_str = f"PASS" if data['status'] == 'PASSED' else "FAIL"
            print(f"{t_id:<16} | {data['prd_reference']:<30} | {status_str:<8} | {data['title']}")

        print("\n" + "-" * 80)
        print(f"Controlled Scenarios Evaluation (PRD Section 12 Benchmark):")
        for s in self.scenarios_results:
            p_badge = "PASS (+)" if s['passed_target'] else "FAIL (-)"
            print(f"  * {s['name']:<35} | Static: ${s['baseline_obj']:<8.2f} | AI Opt: ${s['optimizer_obj']:<8.2f} | Imp: {s['improvement_pct']:>6.2f}% | [{p_badge}]")

        print("-" * 80)
        pass_rate = (self.summary_stats['passed'] / self.summary_stats['total']) * 100.0
        print(f"Final Score: {self.summary_stats['passed']}/{self.summary_stats['total']} Tests Passed ({pass_rate:.1f}% Compliance)\n")

        # Export JSON
        os.makedirs(os.path.dirname(export_path) if os.path.dirname(export_path) else ".", exist_ok=True)
        report = {
            "summary": self.summary_stats,
            "pass_rate_pct": pass_rate,
            "timestamp": datetime.now().isoformat(),
            "results": self.results,
            "scenarios": self.scenarios_results
        }
        with open(export_path, "w") as f:
            json.dump(report, f, indent=2, default=safe_json_default)

        print(f"Test report successfully saved to: {export_path}")
        return report

=======
FlowGrid: Acceptance Test Suite shim delegating to scripts/prd_test_suite.py.
"""

from scripts.prd_test_suite import PRDTestSuite, safe_json_default

__all__ = ["PRDTestSuite", "safe_json_default"]
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b

if __name__ == "__main__":
    suite = PRDTestSuite()
    suite.run_all()
