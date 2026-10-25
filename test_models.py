"""
<<<<<<< HEAD
Comprehensive Automated Test Suite for FlowGrid ML & Optimization Models
Guarantees ZERO Faulty Outputs:
- No NaN, null, or infinite values
- No negative demand or fractional physical units
- Strict enforcement of PRD FR-P0-02 5% Relative WAPE Decision Gate
- Zero overselling of warehouse inventory in OR-Tools CP-SAT
- Feasibility preservation under extreme stockouts
"""

import unittest
import numpy as np
import pandas as pd

from models.feature_pipeline import FeaturePipeline
from models.demand_forecaster import DemandForecaster
from models.anomaly_detector import AnomalyDetector
from models.stock_optimizer import DistributionOptimizer
from models.maharashtra_roadways_loader import MaharashtraRoadwaysLoader
from models.road_risk_predictor import RoadRiskDelayPredictor
from models.deep_roadway_dispatch_net import DeepRoadwayDispatchNet, NeuralRoadwayDispatchTrainer
from models.decision_guard import MaharashtraDecisionGuard


class TestFlowGridModels(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Create a deterministic mock dataset
        dates = pd.date_range("2026-01-01", periods=60, freq="D")
        records = []
        for d in dates:
            for store in ["STORE-001", "STORE-002"]:
                for sku in ["SKU-001", "SKU-002"]:
                    records.append({
                        "date": d.strftime("%Y-%m-%d"),
                        "store_id": store,
                        "sku_id": sku,
                        "units_sold": int(np.random.poisson(lam=20) + (10 if d.weekday() >= 5 else 0)),
                        "unit_price": 100.0,
                        "weekday": d.strftime("%A"),
                        "day_of_week": d.weekday(),
                        "month": d.month,
                        "is_weekend": 1 if d.weekday() >= 5 else 0,
                        "synthetic_promo_flag": 1 if d.day % 7 == 0 else 0,
                        "synthetic_anomaly_flag": 1 if d.day == 15 else 0,
                        "data_origin": "test_mock"
                    })
        cls.mock_df = pd.DataFrame(records)

    def test_01_feature_pipeline_sanitization(self):
        """Verify feature pipeline eliminates NaNs and enforces temporal order."""
        pipeline = FeaturePipeline(lag_days=[1, 7], rolling_windows=[7])
        processed = pipeline.fit_transform(self.mock_df)

        # Assert no NaNs or Infs
        self.assertEqual(processed.isna().sum().sum(), 0, "Feature dataframe contains unexpected NaNs!")
        for col in pipeline.feature_columns:
            self.assertFalse(np.isneginf(processed[col]).any(), f"Column {col} contains -inf")
            self.assertFalse(np.isposinf(processed[col]).any(), f"Column {col} contains +inf")

        # Assert chronological split
        train_df, holdout_df = pipeline.split_chronological(processed, holdout_days=10)
        self.assertGreater(len(train_df), 0)
        self.assertGreater(len(holdout_df), 0)
        self.assertLess(train_df['date'].max(), holdout_df['date'].min(), "Data leakage: train date overlaps holdout!")

    def test_02_demand_forecaster_no_faulty_outputs(self):
        """Verify demand predictions are non-negative, non-null, and integer quantities."""
        pipeline = FeaturePipeline(lag_days=[1, 7], rolling_windows=[7])
        processed = pipeline.fit_transform(self.mock_df)
        train_df, holdout_df = pipeline.split_chronological(processed, holdout_days=10)

        forecaster = DemandForecaster(target_col="units_sold")
        forecaster.train_random_forest(train_df, pipeline.feature_columns)
        forecaster.train_lightgbm(train_df, pipeline.feature_columns)
        forecaster.evaluate_all(holdout_df)

        # Test inference
        preds = forecaster.predict(holdout_df)

        # Assert zero negative predictions
        self.assertTrue(np.all(preds >= 0), "Demand predictions contain faulty negative numbers!")
        # Assert zero NaNs
        self.assertFalse(np.isnan(preds).any(), "Demand predictions contain NaNs!")
        # Assert discrete integers for physical inventory
        self.assertTrue(np.issubdtype(preds.dtype, np.integer), "Predictions are not integer units!")

    def test_03_prd_decision_gate_logic(self):
        """Verify the 5% relative WAPE gate correctly approves or falls back."""
        forecaster = DemandForecaster(target_col="units_sold")
        
        # Scenario A: ML achieves > 5% relative improvement
        forecaster.model_metrics = {
            "seasonal_naive": {"wape": 0.30},
            "random_forest": {"wape": 0.25},  # (0.30 - 0.25)/0.30 = 16.6% improvement
            "lightgbm": {"wape": 0.22}        # 26.6% improvement
        }
        selected = forecaster.enforce_prd_decision_gate()
        self.assertEqual(selected, "lightgbm", "Should select best ML model when > 5% improvement achieved.")
        self.assertEqual(forecaster.decision_audit["status"], "APPROVED_BY_GATE")

        # Scenario B: ML fails 5% threshold (e.g. only 2% improvement)
        forecaster.model_metrics = {
            "seasonal_naive": {"wape": 0.200},
            "random_forest": {"wape": 0.198},  # 1% improvement
            "lightgbm": {"wape": 0.196}        # 2% improvement
        }
        fallback_selected = forecaster.enforce_prd_decision_gate()
        self.assertEqual(fallback_selected, "seasonal_naive", "Should safely fall back to baseline when ML fails 5% gate.")
        self.assertEqual(forecaster.decision_audit["status"], "FALLBACK_ACTIVATED")

    def test_04_anomaly_detector_bounds_and_clamping(self):
        """Verify anomaly detector produces bounded flags and clamps outlier shocks."""
        pipeline = FeaturePipeline(lag_days=[1, 7], rolling_windows=[7])
        processed = pipeline.fit_transform(self.mock_df)

        detector = AnomalyDetector(contamination=0.05)
        feature_cols = ['unit_price', 'lag_1', 'lag_7', 'rolling_mean_7', 'rolling_std_7']
        detector.fit(processed, feature_cols)

        is_anomaly, scores = detector.predict(processed)
        self.assertEqual(len(is_anomaly), len(processed))
        self.assertTrue(set(np.unique(is_anomaly)).issubset({0, 1}), "Anomaly flags must be binary 0 or 1.")

        # Test clamping safeguard on a synthetic shock row
        shock_df = processed.copy().head(5)
        shock_df.loc[0, 'units_sold'] = 99999  # Massive abnormal shock
        clamped = detector.clamp_anomalies(shock_df, is_anomaly=np.array([1, 0, 0, 0, 0]))
        self.assertLess(clamped.loc[0, 'units_sold'], 500, "Shock outlier was not clamped safely!")

    def test_05_stock_optimizer_never_oversells(self):
        """Verify OR-Tools CP-SAT never allocates more stock than warehouse usable inventory."""
        optimizer = DistributionOptimizer(time_limit_seconds=3.0)
        warehouses = ["WH-1", "WH-2"]
        stores = ["STORE-A", "STORE-B"]
        skus = ["SKU-X"]

        # Low inventory vs high demand
        inventory = {("WH-1", "SKU-X"): 15, ("WH-2", "SKU-X"): 20}  # Total 35
        demand = {("STORE-A", "SKU-X"): 50, ("STORE-B", "SKU-X"): 50}  # Total 100
        distances = {
            ("WH-1", "STORE-A"): 10.0, ("WH-1", "STORE-B"): 20.0,
            ("WH-2", "STORE-A"): 25.0, ("WH-2", "STORE-B"): 15.0
        }

        result = optimizer.solve_allocation(
            warehouses=warehouses, stores=stores, skus=skus,
            inventory=inventory, demand=demand, distance_matrix=distances
        )

        self.assertTrue(result["is_feasible"], "Solver failed to return a feasible result!")
        # Total allocated must NEVER exceed total warehouse inventory
        self.assertLessEqual(result["total_allocated_units"], 35, "Optimizer oversold warehouse stock!")
        self.assertEqual(result["total_allocated_units"] + result["total_unmet_units"], 100, "Inventory accounting mismatch!")

        # Verify each warehouse individually
        wh_alloc = {"WH-1": 0, "WH-2": 0}
        for alloc in result["allocations"]:
            wh_alloc[alloc["warehouse_id"]] += alloc["allocated_quantity"]
            self.assertGreaterEqual(alloc["allocated_quantity"], 0, "Negative allocation detected!")

        self.assertLessEqual(wh_alloc["WH-1"], 15, "WH-1 allocated more than available stock!")
        self.assertLessEqual(wh_alloc["WH-2"], 20, "WH-2 allocated more than available stock!")

    def test_06_stock_optimizer_zero_inventory_edge_case(self):
        """Verify optimizer handles catastrophic zero-inventory without crashing."""
        optimizer = DistributionOptimizer(time_limit_seconds=3.0)
        warehouses = ["WH-1"]
        stores = ["STORE-A"]
        skus = ["SKU-X"]

        inventory = {("WH-1", "SKU-X"): 0}
        demand = {("STORE-A", "SKU-X"): 40}
        distances = {("WH-1", "STORE-A"): 10.0}

        result = optimizer.solve_allocation(
            warehouses=warehouses, stores=stores, skus=skus,
            inventory=inventory, demand=demand, distance_matrix=distances
        )

        self.assertEqual(result["total_allocated_units"], 0)
        self.assertEqual(result["total_unmet_units"], 40)
        self.assertEqual(result["fulfillment_rate_pct"], 0.0)
        self.assertEqual(result["violations_detected"], 0)

    def test_07_flipkart_100sku_data_loader(self):
        """Verify Flipkart 100-SKU relational data loading and optimizer integration."""
        from models.data_loader import FlowGridDataLoader
        loader = FlowGridDataLoader()
        net = loader.build_network_inputs(top_n_skus=15)

        self.assertEqual(len(net["warehouses"]), 3)
        self.assertEqual(len(net["stores"]), 30)
        self.assertEqual(len(net["skus"]), 15)
        self.assertIn("SKU-001", net["sku_names"])

        # Test optimizer on actual Flipkart network
        demand = {
            (s, k): 10 for s in net["stores"][:5] for k in net["skus"][:5]
        }
        optimizer = DistributionOptimizer(time_limit_seconds=3.0)
        res = optimizer.solve_allocation(
            warehouses=net["warehouses"],
            stores=net["stores"][:5],
            skus=net["skus"][:5],
            inventory=net["inventory"],
            demand=demand,
            distance_matrix=net["distances"],
            sku_weights=net["sku_weights"],
            sku_volumes=net["sku_volumes"],
            sku_names=net["sku_names"],
            sku_categories=net["sku_categories"]
        )
        self.assertTrue(res["is_feasible"])
        self.assertIn(res["solver_status"], ("OPTIMAL", "FEASIBLE"))
        self.assertEqual(res["violations_detected"], 0)
        self.assertGreater(len(res["allocations"]), 0)

    def test_08_neural_loop_engineering_backprop(self):
        """Verify 3x loop engineering cycles, backprop weight/bias updates, and non-negative predictions."""
        from models.neural_demand_forecaster import NeuralDemandForecaster
        
        # Prepare small dataset
        train_slice = self.mock_df.iloc[:40].copy()
        val_slice = self.mock_df.iloc[40:].copy()

        forecaster = NeuralDemandForecaster()
        history = forecaster.train_3x_loop_engineering(
            train_df=train_slice,
            val_df=val_slice,
            batch_size=16,
            epochs_per_cycle=1,
            verbose=False
        )

        # Assert 3 cycles completed
        self.assertEqual(len(history), 3, "Loop engineering must complete exactly 3 cycles!")
        self.assertEqual(history[0]["cycle"], 1)
        self.assertEqual(history[1]["cycle"], 2)
        self.assertEqual(history[2]["cycle"], 3)

        # Assert weight and bias updates occurred
        summary = forecaster.get_weight_bias_summary()
        self.assertGreater(summary["total_trainable_parameters"], 0)
        self.assertGreater(summary["weight_l2_norm"], 0.0)
        self.assertGreater(summary["bias_l2_norm"], 0.0)

        # Assert inference guarantees
        preds = forecaster.predict(val_slice)
        self.assertEqual(len(preds), len(val_slice))
        self.assertTrue(np.all(preds >= 0), "Neural predictions contain negative quantities!")
        self.assertFalse(np.isnan(preds).any(), "Neural predictions contain NaNs!")
        self.assertTrue(np.issubdtype(preds.dtype, np.integer), "Neural predictions must be discrete integers!")

    def test_09_inventory_optimization_net_replenishment(self):
        """Verify Core Concept 2: Net Replenishment = max(0, Target - Current) & Safety Stock."""
        from models.inventory_optimizer import InventoryOptimizer
        inv_opt = InventoryOptimizer(service_level_z=1.65, default_lead_time_days=1.5)

        # Example from Problem Statement:
        # Demand: 300 packets, Current stock: 50 packets -> Net Replenishment needed
        demand = {("STORE-KOLHAPUR", "SKU-BISCUIT"): 300}
        curr_stock = {("STORE-KOLHAPUR", "SKU-BISCUIT"): 50}

        res = inv_opt.calculate_net_replenishment(demand, curr_stock)
        pos = res["store_sku_positions"][0]

        # Target stock = 300 + safety_stock
        self.assertGreaterEqual(pos["target_stock"], 300)
        # Net needed = target_stock - 50
        self.assertEqual(pos["net_replenishment_needed"], pos["target_stock"] - 50)
        self.assertEqual(res["net_replenishment_dict"][("STORE-KOLHAPUR", "SKU-BISCUIT")], pos["target_stock"] - 50)
        self.assertIn(pos["stock_status"], ("CRITICAL_STOCKOUT_RISK", "LOW_STOCK"))

        # Test overstocked case (Demand: 100, Stock: 300) -> Net needed must be 0
        overstock_d = {("STORE-PUNE", "SKU-SOAP"): 100}
        overstock_s = {("STORE-PUNE", "SKU-SOAP"): 300}
        res_over = inv_opt.calculate_net_replenishment(overstock_d, overstock_s)
        pos_over = res_over["store_sku_positions"][0]
        self.assertEqual(pos_over["net_replenishment_needed"], 0)
        self.assertEqual(pos_over["stock_status"], "OVERSTOCKED_EXCESS")

    def test_10_fmcg_distribution_engine_modules(self):
        """Verify End-to-End FMCG Distribution Intelligence Engine & 4 Prototype Modules."""
        from models.fmcg_distribution_engine import FMCGDistributionEngine
        engine = FMCGDistributionEngine()
        result = engine.run_distribution_intelligence(top_n_skus=10, num_stores=5)

        self.assertEqual(result["engine_status"], "SUCCESS")
        
        # Module 1: Inventory Dashboard
        m1 = result["module_1_inventory_dashboard"]
        self.assertIn("warehouse_stocks", m1)
        self.assertGreater(m1["total_warehouse_stock"], 0)

        # Module 2: Demand Prediction
        m2 = result["module_2_demand_prediction"]
        self.assertGreater(m2["total_forecasted_units"], 0)
        self.assertGreater(m2["total_net_replenishment_units"], 0)

        # Module 3: Recommended Distribution Plan with Reasons
        m3 = result["module_3_distribution_recommendations"]
        self.assertGreater(len(m3), 0)
        first_rec = m3[0]
        self.assertIn("product", first_rec)
        self.assertIn("from_warehouse", first_rec)
        self.assertIn("to_store", first_rec)
        self.assertIn("quantity", first_rec)
        self.assertIn("estimated_cost", first_rec)
        self.assertIn("reason", first_rec)
        self.assertGreater(len(first_rec["reason"]), 5)

        # Module 4: Optimization Dashboard (Before vs After)
        m4 = result["module_4_optimization_dashboard"]
        self.assertIn("before_optimization", m4)
        self.assertIn("after_ai_optimization", m4)
        self.assertLessEqual(m4["after_ai_optimization"]["stockout_risk_pct"], m4["before_optimization"]["stockout_risk_pct"])
        self.assertLessEqual(m4["after_ai_optimization"]["optimized_transport_cost_inr"], m4["before_optimization"]["estimated_transport_cost_inr"])

    def test_11_ollama_intelligence_adapter(self):
        """Verify Ollama LLM integration, key feature extraction, and reliable fallback."""
        from models.ollama_intelligence import OllamaIntelligenceAdapter
        adapter = OllamaIntelligenceAdapter(timeout_seconds=0.5)

        # Health check
        health = adapter.check_health()
        self.assertIn("status", health)
        self.assertIn(health["status"], ("ONLINE", "OFFLINE"))

        # Feature extraction (extracts primary driver, promo elasticity, stockout threat)
        features = adapter.extract_key_features(
            store_id="STORE-001",
            sku_id="SKU-001",
            product_name="Fortune Sunflower Oil 1L",
            feature_data={
                "units_sold": 50,
                "rolling_mean_7": 30.0,
                "synthetic_promo_flag": 1,
                "unit_price": 198.0,
                "current_stock": 5,
                "days_to_expiry": 28
            }
        )
        self.assertIn("insights", features)
        self.assertGreater(len(features["insights"]), 10)
        self.assertIn("extracted_drivers", features)
        self.assertEqual(features["extracted_drivers"]["promo_elasticity"], "HIGH")
        self.assertEqual(features["extracted_drivers"]["stockout_threat"], "CRITICAL")

        # Output optimization and executive briefing
        mock_recs = [{
            "product": "Fortune Sunflower Oil (SKU-001)",
            "from_warehouse": "WH-01",
            "to_store": "STORE-001",
            "quantity": 45,
            "estimated_cost": "INR 8.50",
            "reason": "FEFO Urgent: Lot LOT-2 expires in 28d; dispatched to eliminate warehouse write-off."
        }]
        mock_impact = {
            "before_optimization": {"stockout_risk_pct": 45.0, "estimated_transport_cost_inr": 500.0},
            "after_ai_optimization": {
                "stockout_risk_pct": 0.0,
                "optimized_transport_cost_inr": 350.0,
                "transport_cost_savings_pct": 30.0,
                "rescued_near_expiry_units": 45,
                "expiry_wastage_reduction_pct": 95.0,
                "stockout_reduction_pct": 45.0
            }
        }
        opt_output = adapter.optimize_distribution_output(mock_recs, mock_impact)
        self.assertIn("executive_dispatch_briefing", opt_output)
        self.assertGreater(len(opt_output["executive_dispatch_briefing"]), 20)
        self.assertIn("optimized_recommendations", opt_output)
        self.assertEqual(opt_output["optimized_recommendations"][0]["dispatch_priority"], "PRIORITY_P0_IMMEDIATE")

    def test_12_maharashtra_roadways_loader(self):
        """Verifies loading and relational joining of Maharashtra dynamic delivery dataset."""
        loader = MaharashtraRoadwaysLoader()
        locs = loader.load_locations()
        self.assertEqual(len(locs), 33)
        self.assertIn("diesel_inr_per_litre_2026_10_24", locs.columns)

        whs = loader.load_warehouses()
        self.assertEqual(len(whs), 4)

        routes = loader.load_route_options()
        self.assertEqual(len(routes), 132)

        corrs = loader.load_corridors()
        self.assertEqual(len(corrs), 8)

        conds = loader.load_road_conditions_daily()
        self.assertEqual(len(conds), 11880)

        orders = loader.load_delivery_orders()
        self.assertEqual(len(orders), 2970)

        lines = loader.load_delivery_order_lines()
        self.assertEqual(len(lines), 14542)

        df_risk = loader.build_road_risk_training_features()
        self.assertEqual(len(df_risk), 11880)
        self.assertIn("is_ghat_route", df_risk.columns)
        self.assertIn("waterlogging_flag_int", df_risk.columns)

        df_dispatch = loader.build_delivery_dispatch_training_features()
        self.assertEqual(len(df_dispatch), 14542)
        self.assertIn("fuel_cost_inr_est_one_way", df_dispatch.columns)

        topo = loader.get_network_topology()
        self.assertEqual(len(topo["warehouses"]), 4)
        self.assertEqual(len(topo["locations"]), 33)
        self.assertEqual(len(topo["distance_matrix"]), 132)

    def test_13_road_risk_delay_predictor(self):
        """Verifies LightGBM delay regressor and Random Forest hazard classifier on Maharashtra dataset."""
        loader = MaharashtraRoadwaysLoader()
        df_risk = loader.build_road_risk_training_features()

        predictor = RoadRiskDelayPredictor(models_dir="saved_models")
        metrics = predictor.train(df_risk)

        self.assertGreater(metrics["lgbm_r2_score"], 0.85)
        self.assertLess(metrics["lgbm_delay_mae_minutes"], 5.0)
        self.assertTrue(metrics["meets_prd_5pct_gate"])
        self.assertGreater(metrics["hazard_classification_accuracy_percent"], 90.0)

        # Operational prediction test on wet ghat route
        pred = predictor.predict_route_risk(
            route_id="R-W-PUN-KOL",
            corridor_id="COR-NH48",
            terrain_class="ghat_edge",
            environment_region="Western Maharashtra",
            road_distance_km=233.0,
            baseline_drive_time_minutes=280.0,
            rainfall_mm=25.0,
            traffic_congestion_index=0.25,
            waterlogging_flag=False
        )
        self.assertGreater(pred["predicted_delay_minutes"], 20.0)
        self.assertIn(pred["risk_severity"], ["medium", "high"])
        self.assertGreater(pred["lateness_surcharge_inr"], 0.0)
        self.assertIn("Corridor COR-NH48", pred["explanation"])

    def test_14_deep_roadway_dispatch_net_loop_engineering(self):
        """Verifies 3x neural loop backpropagation optimizing weights and biases on dispatch data."""
        loader = MaharashtraRoadwaysLoader()
        df_dispatch = loader.build_delivery_dispatch_training_features()

        trainer = NeuralRoadwayDispatchTrainer(models_dir="saved_models")
        # Run 3x loop engineering on representative slice
        summary = trainer.train_3x_loops(df_dispatch.iloc[:2500], epochs_per_loop=2)

        self.assertEqual(len(summary["loop_results"]), 3)
        self.assertNotEqual(summary["total_weight_delta"], 0.0)
        self.assertNotEqual(summary["total_bias_delta"], 0.0)

        # Output prediction test
        pred = trainer.predict_dispatch_quantity(
            warehouse_id="W-PUN",
            destination_location_id="L-MH-KOL",
            representative_corridor_id="COR-NH48",
            terrain_class="ghat_edge",
            category_id="EDIBLE_OIL",
            order_date_str="2026-10-24",
            road_distance_km=233.0,
            diesel_price_inr=98.68
        )
        self.assertGreaterEqual(pred, 0.0)

    def test_15_maharashtra_decision_guard_fixtures(self):
        """Verifies 100% compliance across the 12 official test fixtures in decision_guard_test_cases.csv."""
        loader = MaharashtraRoadwaysLoader()
        df_cases = loader.load_decision_guard_test_cases()

        guard = MaharashtraDecisionGuard()
        report = guard.run_fixture_test_cases(df_cases)

        self.assertEqual(report["total_test_cases"], 12)
        self.assertEqual(report["passed_test_cases"], 12)
        self.assertEqual(report["pass_rate_percent"], 100.0)
        self.assertTrue(report["all_passed"])


if __name__ == "__main__":
    unittest.main()



=======
FlowGrid: Automated Test Suite shim delegating to tests/test_models.py.
"""

import sys
import unittest
from pathlib import Path

# Add project root to sys.path
ROOT_DIR = Path(__file__).resolve().parent
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from tests.test_models import TestFlowGridModels

if __name__ == "__main__":
    unittest.main()
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
