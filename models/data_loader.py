"""
Data Loader & Relational Catalog Adapter for FlowGrid
Seamlessly loads and joins the Flipkart 100-SKU FMCG Catalog and operational tables:
- skus.csv (100 SKUs with weight, volume, category, brand, shelf life, listing price)
- inventory_batches.csv (600 batches with lot IDs, usable quantities, expiry dates for FEFO)
- warehouses.csv (3 regional warehouses with coordinates & dispatch capacity)
- stores.csv (30 stores with service zones & priority weights)
- route_estimates.csv (90 route corridors with distance, ETA, transport cost)
- vehicles.csv (15 vehicles with payload weight & volume limits)
- model_ready datasets (train.csv, validation.csv, test.csv with 1,011,000 rows)
"""

import os
from pathlib import Path
from typing import Dict, List, Tuple, Any, Optional
import pandas as pd
import numpy as np


class FlowGridDataLoader:
    def __init__(self, base_dir: Optional[str] = None):
        if base_dir:
            self.base_dir = Path(base_dir)
        else:
            # Auto-detect flipkart dataset directory
            candidates = [
                Path("flowgrid_flipkart_100sku/data"),
                Path("../flowgrid_flipkart_100sku/data"),
                Path("data"),
                Path(".")
            ]
            self.base_dir = Path("flowgrid_flipkart_100sku/data")
            for c in candidates:
                if (c / "skus.csv").exists():
                    self.base_dir = c
                    break

    def get_path(self, filename: str) -> Path:
        return self.base_dir / filename

    def load_skus(self) -> pd.DataFrame:
        """Loads 100-SKU Flipkart product master with logistics & pricing."""
        path = self.get_path("skus.csv")
        if not path.exists():
            raise FileNotFoundError(f"SKUs file not found at {path}")
        df = pd.read_csv(path)
        return df

    def load_warehouses(self) -> pd.DataFrame:
        """Loads 3 regional warehouse facilities with dispatch capacities."""
        path = self.get_path("warehouses.csv")
        return pd.read_csv(path)

    def load_stores(self) -> pd.DataFrame:
        """Loads 30 retail store locations and priority weights."""
        path = self.get_path("stores.csv")
        return pd.read_csv(path)

    def load_inventory_batches(self, only_usable: bool = True) -> pd.DataFrame:
        """
        Loads 600 inventory batches with lot numbers and expiry dates.
        Sorted by expiry_date for FEFO (First-Expired, First-Out) optimization.
        """
        path = self.get_path("inventory_batches.csv")
        df = pd.read_csv(path)
        if only_usable and "quality_status" in df.columns:
            df = df[df["quality_status"] == "USABLE"].copy()
        
        # Parse expiry date and sort for FEFO
        df["expiry_date"] = pd.to_datetime(df["expiry_date"])
        df = df.sort_values(["warehouse_id", "sku_id", "expiry_date"]).reset_index(drop=True)
        return df

    def load_vehicles(self, only_available: bool = False) -> pd.DataFrame:
        """Loads 15 delivery vehicles with weight (kg) and volume (L) limits."""
        path = self.get_path("vehicles.csv")
        df = pd.read_csv(path)
        if only_available and "availability_status" in df.columns:
            df = df[df["availability_status"] == "AVAILABLE"].copy()
        return df

    def load_route_estimates(self) -> pd.DataFrame:
        """Loads 90 origin-destination route estimates with distance_km and cost."""
        path = self.get_path("route_estimates.csv")
        return pd.read_csv(path)

    def load_sales_history(self) -> pd.DataFrame:
        """Loads historical daily sales used by the seven-day quantile forecaster."""
        path = self.get_path("synthetic_sales_daily.csv")
        if not path.exists():
            for alt in [
<<<<<<< HEAD
                Path("unused_data/synthetic_sales_daily.csv"),
=======
>>>>>>> 6209d0dc29978b08b561485c7af41eb3eb82c39b
                self.base_dir.parent / "templates" / "sales_daily.csv",
                self.base_dir / "sales_daily.csv",
                Path("flowgrid_flipkart_100sku/templates/sales_daily.csv"),
            ]:
                if alt.exists():
                    path = alt
                    break
        if not path.exists():
            raise FileNotFoundError(f"Sales history file not found at {path}")
        wanted = {"date", "store_id", "sku_id", "units_sold", "closing_stock"}
        return pd.read_csv(path, usecols=lambda col: col in wanted)

    def load_model_ready_split(self, split: str = "test", max_rows: int = 0) -> pd.DataFrame:
        """
        Loads pre-computed, zero-leakage model-ready data (train, validation, or test).
        Uses memory-optimized dtypes for fast evaluation on 1M rows.
        """
        model_ready_dir = self.base_dir / "model_ready"
        file_map = {
            "train": model_ready_dir / "train.csv",
            "validation": model_ready_dir / "validation.csv",
            "test": model_ready_dir / "test.csv",
            "all": model_ready_dir / "sales_features.csv"
        }
        target_file = file_map.get(split, file_map["test"])
        if not target_file.exists():
            # Fallback to synthetic_sales_daily.csv if model_ready not present
            fallback = self.base_dir / "synthetic_sales_daily.csv"
            return pd.read_csv(fallback, nrows=max_rows if max_rows > 0 else None)

        read_dtypes = {
            "store_id": "category",
            "sku_id": "category",
            "weekday": "category",
            "split": "category",
            "units_sold": "int32",
            "unit_price": "float32",
            "day_of_week": "int8",
            "month": "int8",
            "is_weekend": "int8",
            "synthetic_promo_flag": "int8"
        }
        for col in ["lag_1", "lag_7", "lag_14", "lag_28", "rolling_mean_7", "rolling_mean_28", "rolling_std_7", "rolling_std_28"]:
            read_dtypes[col] = "float32"

        df = pd.read_csv(target_file, dtype=read_dtypes, nrows=max_rows if max_rows > 0 else None)
        return df

    def build_network_inputs(self, top_n_skus: int = 100) -> Dict[str, Any]:
        """
        Builds unified relational inputs for the OR-Tools CP-SAT Optimizer:
        - Warehouses list & capacities
        - Stores list & priorities
        - SKUs list & unit weight/volume
        - Usable inventory per (warehouse, sku) with FEFO expiry sorting
        - Real distance and cost matrix per (warehouse, store)
        - Fleet capacities
        """
        warehouses_df = self.load_warehouses()
        stores_df = self.load_stores()
        skus_df = self.load_skus().head(top_n_skus)
        batches_df = self.load_inventory_batches()
        routes_df = self.load_route_estimates()
        vehicles_df = self.load_vehicles()

        warehouses = warehouses_df["warehouse_id"].tolist()
        stores = stores_df["store_id"].tolist()
        skus = skus_df["sku_id"].tolist()

        # Aggregated usable inventory per warehouse and SKU
        inv_grouped = batches_df[batches_df["sku_id"].isin(skus)].groupby(["warehouse_id", "sku_id"])["quantity_available"].sum()
        inventory = {
            (w, k): int(inv_grouped.get((w, k), 0))
            for w in warehouses for k in skus
        }

        # Route distances and estimated costs
        distances = {}
        route_costs = {}
        for _, row in routes_df.iterrows():
            w = row["origin_warehouse_id"]
            s = row["destination_store_id"]
            distances[(w, s)] = float(row["distance_km"])
            route_costs[(w, s)] = float(row.get("estimated_cost", row["distance_km"] * 1.8))

        # SKU logistics: weights and volumes
        sku_weights = dict(zip(skus_df["sku_id"], skus_df["unit_weight_kg"].fillna(1.0).astype(float)))
        sku_volumes = dict(zip(skus_df["sku_id"], skus_df["unit_volume_l"].fillna(1.0).astype(float)))
        sku_names = dict(zip(skus_df["sku_id"], skus_df["product_name"]))
        sku_categories = dict(zip(skus_df["sku_id"], skus_df["category_id"]))
        sku_shelf_life = dict(zip(skus_df["sku_id"], skus_df["estimated_total_shelf_life_days"].fillna(365).astype(int)))

        # Store priority weights
        store_priorities = dict(zip(stores_df["store_id"], stores_df["priority_weight"].fillna(1.0).astype(float)))

        return {
            "warehouses": warehouses,
            "stores": stores,
            "skus": skus,
            "inventory": inventory,
            "distances": distances,
            "route_costs": route_costs,
            "sku_weights": sku_weights,
            "sku_volumes": sku_volumes,
            "sku_names": sku_names,
            "sku_categories": sku_categories,
            "sku_shelf_life": sku_shelf_life,
            "store_priorities": store_priorities,
            "vehicles": vehicles_df.to_dict(orient="records")
        }
