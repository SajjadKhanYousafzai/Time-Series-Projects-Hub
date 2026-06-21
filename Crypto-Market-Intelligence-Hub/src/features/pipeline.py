"""sklearn-compatible feature pipeline for crypto time-series data."""
from __future__ import annotations

from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.base import BaseEstimator, TransformerMixin
import pandas as pd
import numpy as np

from .returns import add_return_features
from .technical import add_technical_indicators


class CryptoFeatureTransformer(BaseEstimator, TransformerMixin):
    """sklearn transformer that adds return + technical features to a DataFrame.

    Parameters
    ----------
    rolling_windows : list[int]
        Windows for rolling volatility features.
    add_technicals : bool
        Whether to add RSI, MACD, Bollinger Bands, ATR, OBV.
    """

    def __init__(
        self,
        rolling_windows: list[int] | None = None,
        add_technicals: bool = True,
    ):
        self.rolling_windows = rolling_windows or [7, 14, 30]
        self.add_technicals = add_technicals

    def fit(self, X: pd.DataFrame, y=None):  # noqa: N803
        return self

    def transform(self, X: pd.DataFrame, y=None) -> pd.DataFrame:  # noqa: N803
        df = add_return_features(X, windows=self.rolling_windows)
        if self.add_technicals:
            df = add_technical_indicators(df)
        return df


def build_feature_pipeline(add_technicals: bool = True) -> Pipeline:
    """Return a sklearn Pipeline that adds crypto features + scales numerics.

    Usage
    -----
    >>> pipe = build_feature_pipeline()
    >>> features = pipe.fit_transform(raw_df)
    """
    return Pipeline(
        steps=[
            ("features", CryptoFeatureTransformer(add_technicals=add_technicals)),
        ]
    )


def prepare_sequences(
    series: pd.Series | np.ndarray,
    seq_len: int,
) -> tuple[np.ndarray, np.ndarray]:
    """Build (X, y) sequences for LSTM/GRU training.

    Parameters
    ----------
    series : 1-D array-like
        Univariate time series (already scaled).
    seq_len : int
        Look-back window length.

    Returns
    -------
    X : np.ndarray, shape (n_samples, seq_len, 1)
    y : np.ndarray, shape (n_samples,)
    """
    values = np.asarray(series)
    X, y = [], []
    for i in range(seq_len, len(values)):
        X.append(values[i - seq_len : i])
        y.append(values[i])
    return np.array(X)[..., np.newaxis], np.array(y)
