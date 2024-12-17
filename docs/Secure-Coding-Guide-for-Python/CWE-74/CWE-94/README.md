# CWE-94: Improper Control of Generation of Code ('Code Injection')

Ensure that generated code influenced by untrusted input, that is then
directly executed, cannot cause malicious results.

As a general rule, never use untrusted inputs to create something that will be passed to Python's built-in [eval](https://docs.python.org/3/library/functions.html#eval) function. It is difficult to escape properly, and there are far too many ways to subvert it.

As noted by [MITRE's CWE-94 information](https://cwe.mitre.org/data/definitions/94.html), "it is frequently encouraged to use the `ast.literal_eval()` function instead of eval, since it is intentionally designed to avoid executing code. However, an adversary could still cause excessive memory or stack consumption via deeply nested structures [REF-1372], so the python documentation discourages use of ast.literal_eval() on untrusted data [REF-1373]."

Solutions generally involve changing the software architecture and approach so it does not need to dynamically generate code for execution that uses untrusted input. For example, if you know that you're reading JSON data that could also be interpreted as a Python executable, a *terrible* solution would be to use `eval` to evaluate it. A much better solution would be to use Python's built-in [json](https://docs.python.org/3/library/json.html) module to read in the data, as it does not allow attackers to arbitrarily control execution. As noted in the `json` module documentation, "Be cautious when parsing JSON data from untrusted sources. A malicious JSON string may cause the decoder to consume considerable CPU and memory resources. Limiting the size of data to be parsed is recommended."

## Non-Compliant Code Example

The `noncompliant01.py` code example demonstrates this:

*[noncompliant01.py](noncompliant01.py):*

```py
```

## Compliant Solution


## Automated Detection

unknown

## Related Guidelines


## Biblography

