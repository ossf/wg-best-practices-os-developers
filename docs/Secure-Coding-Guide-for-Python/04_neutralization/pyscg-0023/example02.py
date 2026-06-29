# SPDX-FileCopyrightText: OpenSSF project contributors
# SPDX-License-Identifier: MIT
""" Example Code: secure loading of pickle data """

# pickle is widely used but unsafe by default: loading a pickle stream can
# execute arbitrary code. This module provides an allowlist-based defence:
#
#   Only classes explicitly approved by the caller are permitted.
#   This blocks code execution during loading (__reduce__ exploits).
#
# This module controls *what kinds of objects* are allowed to load, mirroring
# how json.loads controls what kinds of values JSON can represent. It does NOT
# validate data values; ensuring that loaded values are safe and correct
# remains the caller's responsibility, just as it is with json.loads.
#
# Quick start:
#
#   from example02 import SafeUnpickler
#
#   loader = SafeUnpickler(allowed_classes=[MyRecord])
#   record = loader.safe_loads(raw_bytes)
#   # validate record's field values here before use
#
# Run doctests:
#
#   python3 -m doctest example02.py

import builtins
import datetime
import decimal
import io
import pickle
import types
import uuid
from collections.abc import Sequence


# ---------------------------------------------------------------------------
# Default allowlist
# ---------------------------------------------------------------------------

# Build the default set from concrete class objects so that module renames or
# reimports cannot silently widen the allowlist.
_PICKLE_SAFE_CLASSES = (
    # Built-in primitives and containers.
    # These cannot execute code on load, though they can carry attacker-
    # controlled string data; always validate values after loading.
    builtins.str, builtins.int, builtins.float, builtins.bool,
    builtins.bytes, builtins.bytearray, type(None),
    builtins.list, builtins.tuple, builtins.dict,
    builtins.set, builtins.frozenset, builtins.complex,
    builtins.range, builtins.slice,

    # Immutable stdlib value types with well-defined structure.
    datetime.date, datetime.time, datetime.datetime,
    datetime.timedelta, datetime.timezone,
    decimal.Decimal,
    uuid.UUID,

    # Unvalidated carriers: safe to unpickle but may hold arbitrary string
    # data. Several exceptions included because pickle is widely used for
    # inter-process communication (IPC) where exceptions are routinely
    # serialized. SimpleNamespace is a common lightweight container.
    builtins.Exception, builtins.ValueError, builtins.TypeError,
    builtins.KeyError, builtins.IndexError, builtins.AttributeError,
    builtins.RuntimeError,
    types.SimpleNamespace,
)

PICKLE_SAFE_TYPES: frozenset = frozenset(
    (cls.__module__, cls.__name__) for cls in _PICKLE_SAFE_CLASSES
)
"""Frozenset of ``(module, name)`` pairs considered safe to unpickle.

These types cannot execute code on pickle load, but several (str, dict,
SimpleNamespace) can carry attacker-controlled payloads that may harm
downstream code. Always validate data values after loading.

This set is public so callers can inspect it, union it with additional types,
or ignore it entirely by passing exclusive=True to SafeUnpickler.
"""


# ---------------------------------------------------------------------------
# Internal restricted unpickler
# ---------------------------------------------------------------------------

class _RestrictedUnpickler(pickle.Unpickler):
    """Unpickler that blocks every class not in allowed_globals.

    Not part of the public API; use SafeUnpickler instead.
    ``pickle.Unpickler`` is bound to one file at construction and is
    single-use; ``SafeUnpickler`` holds the allowlist configuration and
    creates a fresh instance of this class for each load.

    pickle calls find_class() for every global (class, function, or other
    callable) it needs to resolve while loading. By raising UnpicklingError
    for anything outside the allowlist, we prevent __reduce__-based exploits
    from executing their embedded callables.
    """

    def __init__(self, file, allowed_globals: frozenset):
        super().__init__(file)
        self._allowed_globals = allowed_globals

    def find_class(self, module: str, name: str):
        if (module, name) in self._allowed_globals:
            mod = __import__(module, fromlist=[name])
            return getattr(mod, name)
        raise pickle.UnpicklingError(
            f"Security block: '{module}.{name}' is not in the allowlist. "
            f"Add it to allowed_classes if you have verified it's safe to load."
        )


# ---------------------------------------------------------------------------
# Public loader class
# ---------------------------------------------------------------------------

class SafeUnpickler:
    """Configure a restricted unpickler once; load safely many times.

    By default the allowlist is PICKLE_SAFE_TYPES. Pass allowed_classes to
    permit additional application-specific types. Set exclusive=True to
    restrict loading to *only* allowed_classes, ignoring PICKLE_SAFE_TYPES;
    use this when you want the tightest possible surface area.

    Before adding a class to allowed_classes, check all of the following:

    1. ``__new__``, ``__setstate__``, and ``__del__``: pickle bypasses
       ``__init__`` but DOES call ``__new__`` and ``__setstate__`` if defined.
       ``__del__`` (the finalizer) runs when the object is garbage-collected,
       which can happen during or shortly after loading. Verify none of these
       execute shell commands, file I/O, or network requests.

    2. ``__reduce__`` / ``__reduce_ex__``: the primary mechanism by which
       pickle executes arbitrary code. A class whose ``__reduce__`` returns
       ``(callable, args)`` will have that callable invoked on load. The
       allowlist blocks this by refusing to resolve callables not in the list,
       but only if the callable itself is not allowlisted. Never allowlist
       functions such as ``eval``, ``exec``, or ``os.system``.

    3. Gadget chains: pickle writes loaded values directly to ``__dict__``,
       bypassing ``__init__`` and any validation it performs. An attacker can
       therefore set any attribute to any value they choose. If the application
       later passes those attributes to a sensitive operation, the attacker
       controls the outcome (even though no code ran at load time). Examples:

       - A ``command: str`` field passed to ``subprocess.run(obj.command)``
         becomes arbitrary command execution.
       - A ``query: str`` field passed to a database cursor becomes a SQL
         injection vector.
       - A ``path: str`` field passed to ``open(obj.path)`` can read
         ``/etc/passwd`` or overwrite arbitrary files.

       Prefer data-only classes (dataclasses, namedtuples) whose fields are
       never passed to system calls, file I/O, or queries without explicit
       validation.

    4. Third-party library classes: avoid allowlisting complex classes from
       large frameworks (SQLAlchemy, NumPy, Django). They often contain deep
       method chains that can be used as exploit gadgets.
    """

    def __init__(self, allowed_classes: Sequence[type] | None = None, exclusive: bool = False):
        """
        Parameters
        ----------
        allowed_classes:
            List or tuple of class objects to permit. With ``exclusive=False``
            (the default) these are *added to* PICKLE_SAFE_TYPES. With
            ``exclusive=True`` these are the *complete* allowlist and
            PICKLE_SAFE_TYPES is not included; you must then list every
            type your pickle uses, including primitives such as str and int.
        exclusive:
            If False (the default), allowed_classes is added to
            PICKLE_SAFE_TYPES. If True, allowed_classes is the complete
            allowlist and PICKLE_SAFE_TYPES is not included.

        Doctest: exclusive=True with the class listed permits loading::

            >>> import pickle, decimal
            >>> strict = SafeUnpickler(allowed_classes=[decimal.Decimal], exclusive=True)
            >>> strict.safe_loads(pickle.dumps(decimal.Decimal('1.5')))
            Decimal('1.5')

        Doctest: exclusive=True blocks types that are in PICKLE_SAFE_TYPES.
        Note: plain built-in types (dict, list, str, int) are handled by native
        pickle opcodes and bypass find_class() entirely, so they cannot be
        blocked by any allowlist regardless of exclusive::

            >>> import pickle, datetime
            >>> strict = SafeUnpickler(allowed_classes=[], exclusive=True)
            >>> strict.safe_loads(  # doctest: +IGNORE_EXCEPTION_DETAIL
            ...     pickle.dumps(datetime.date(2024, 1, 1)))
            Traceback (most recent call last):
                ...
            pickle.UnpicklingError: Security block: 'datetime.date' is not in the allowlist.
        """
        caller_set = frozenset(
            (cls.__module__, cls.__name__) for cls in (allowed_classes or [])
        )
        self._allowed_globals = (
            caller_set if exclusive else PICKLE_SAFE_TYPES | caller_set
        )

    def safe_loads(self, data: bytes):
        """Deserialize pickle bytes, blocking any class not in the allowlist.

        Parameters
        ----------
        data:
            Raw pickle bytes.

        Raises
        ------
        pickle.UnpicklingError
            If the pickle stream references a class outside the allowlist.

        Note
        ----
        This method controls *what kinds of objects* are loaded, not the
        values within them. Always validate loaded data before using it.

        Doctest: ``__reduce__`` exploit is blocked::

            >>> import pickle
            >>> class Exploit:
            ...     def __reduce__(self):
            ...         return (eval, ('1+1',))
            >>> SafeUnpickler().safe_loads(pickle.dumps(Exploit()))  # doctest: +IGNORE_EXCEPTION_DETAIL
            Traceback (most recent call last):
                ...
            pickle.UnpicklingError: Security block: 'builtins.eval' is not in the allowlist.

        Doctest: unlisted class is blocked even without a __reduce__ exploit.
        fractions.Fraction is a real stdlib class absent from
        PICKLE_SAFE_TYPES::

            >>> import pickle, fractions
            >>> SafeUnpickler().safe_loads(pickle.dumps(fractions.Fraction(1, 3)))  # doctest: +IGNORE_EXCEPTION_DETAIL
            Traceback (most recent call last):
                ...
            pickle.UnpicklingError: Security block: 'fractions.Fraction' is not in the allowlist.

        Doctest: adding a class to allowed_classes permits it to load::

            >>> import pickle, fractions
            >>> loader = SafeUnpickler(allowed_classes=[fractions.Fraction])
            >>> loader.safe_loads(pickle.dumps(fractions.Fraction(1, 3)))
            Fraction(1, 3)
        """
        return _RestrictedUnpickler(io.BytesIO(data), self._allowed_globals).load()

    def safe_load(self, file_obj):
        """Deserialize from a file-like object. Delegates to safe_loads."""
        return self.safe_loads(file_obj.read())


# ---------------------------------------------------------------------------
# Module-level convenience functions
# ---------------------------------------------------------------------------

def safe_loads(data: bytes, allowed_classes: Sequence[type] | None = None, exclusive: bool = False):
    """One-shot secure load from bytes.

    Equivalent to::

        SafeUnpickler(allowed_classes, exclusive).safe_loads(data)

    Use SafeUnpickler directly when loading multiple payloads with the same
    configuration, to avoid rebuilding the allowlist on every call.

    This function controls *what kinds of objects* are loaded, not their
    values. Always validate loaded data before use.
    """
    return SafeUnpickler(allowed_classes, exclusive).safe_loads(data)


def safe_load(file_obj, allowed_classes: Sequence[type] | None = None, exclusive: bool = False):
    """One-shot secure load from a file-like object.

    Equivalent to::

        SafeUnpickler(allowed_classes, exclusive).safe_load(file_obj)

    This function controls *what kinds of objects* are loaded, not their
    values. Always validate loaded data before use.
    """
    return SafeUnpickler(allowed_classes, exclusive).safe_load(file_obj)


# ---------------------------------------------------------------------------
# Usage demonstration
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    from dataclasses import dataclass

    @dataclass
    class Order:
        order_id: int
        customer: str
        amount: float

    loader = SafeUnpickler(allowed_classes=[Order])

    def validate_orders(raw) -> list[Order]:
        """Validate structure and domain constraints on a loaded orders list."""
        if not isinstance(raw, list):
            raise TypeError(
                f"Expected list of orders, got {type(raw).__name__}"
            )
        for i, order in enumerate(raw):
            if not isinstance(order, Order):
                raise TypeError(
                    f"orders[{i}]: expected Order, got {type(order).__name__}"
                )
            if not (isinstance(order.order_id, int) and order.order_id >= 1):
                raise ValueError(
                    f"orders[{i}].order_id must be int >= 1, "
                    f"got {order.order_id!r}"
                )
            if not (isinstance(order.customer, str) and order.customer):
                raise ValueError(
                    f"orders[{i}].customer must be a non-empty str"
                )
            if not (isinstance(order.amount, (int, float))
                    and order.amount >= 0.0):
                raise ValueError(
                    f"orders[{i}].amount must be >= 0.0, "
                    f"got {order.amount!r}"
                )
        return raw

    print("Normal round-trip:")
    original = Order(order_id=42, customer="Alice", amount=99.95)
    loaded = loader.safe_loads(pickle.dumps(original))
    print(f"  {loaded}")

    print("\nLoading and validating a list of orders:")
    orders = [
        Order(order_id=1, customer="Alice", amount=99.95),
        Order(order_id=2, customer="Bob", amount=0.0),
    ]
    validated = validate_orders(loader.safe_loads(pickle.dumps(orders)))
    print(f"  Loaded {len(validated)} valid orders")
    for order in validated:
        print(f"  {order}")
