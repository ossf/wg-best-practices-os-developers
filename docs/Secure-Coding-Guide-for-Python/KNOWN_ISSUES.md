ISSUES FOUND
======================================================================

Documentation Issues:

  CWE-664/CWE-197/01/README.md
    -> E       Missing required sections: Bibliography

  CWE-664/CWE-197/README.md
    -> E       Missing required sections: Bibliography
    -> Section order issue

  CWE-664/CWE-400/README.md
    -> E       Missing required sections: Automated Detection

  CWE-664/CWE-404/README.md
    -> E       Missing required sections: Automated Detection

  CWE-664/CWE-410/README.md
    -> E       Missing required sections: Bibliography
    -> Section order issue

  CWE-664/CWE-426/README.md
    -> E       Missing required sections: Bibliography

  CWE-664/CWE-459/README.md
    -> E       Missing required sections: Bibliography

  CWE-664/CWE-460/README.md
    -> E       Missing required sections: Bibliography

  CWE-664/CWE-501/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Compliant Solution

  CWE-664/CWE-502/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Bibliography
    -> E       Missing file: rpcpy-exploit.py

  CWE-664/CWE-532/README.md
    -> E       Missing required sections: Bibliography
    -> Section order issue

  CWE-664/CWE-665/README.md
    -> E       Missing required sections: Automated Detection, Bibliography

  CWE-664/CWE-681/01/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Bibliography
    -> Section order issue

  CWE-664/CWE-833/README.md
    -> E       Missing required sections: Bibliography
    -> Section order issue

  CWE-682/CWE-1335/01/README.md
    -> E       Missing required sections: Bibliography
    -> Section order issue

  CWE-682/CWE-191/README.md
    -> E       Missing required sections: Automated Detection
    -> Section order issue

  CWE-693/CWE-182/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Compliant Solution

  CWE-693/CWE-330/README.md
    -> E       Missing required sections: Compliant Solution, Bibliography

  CWE-693/CWE-472/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Compliant Solution, Bibliography

  CWE-693/CWE-778/README.md
    -> E       Missing required sections: Bibliography

  CWE-703/CWE-252/README.md
    -> Section order issue

  CWE-703/CWE-390/README.md
    -> E       Missing required sections: Compliant Solution, Bibliography

  CWE-703/CWE-392/README.md
    -> E       Missing required sections: Bibliography
    -> Section order issue

  CWE-703/CWE-476/README.md
    -> E       Missing required sections: Compliant Solution

  CWE-703/CWE-754/README.md
    -> E       Missing required sections: Bibliography

  CWE-703/CWE-755/README.md
    -> E       Missing required sections: Bibliography
    -> Section order issue

  CWE-707/CWE-117/README.md
    -> E       Missing required sections: Non-Compliant Code Example

  CWE-707/CWE-175/README.md
    -> Section order issue

  CWE-710/CWE-1109/README.md
    -> Section order issue

  CWE-710/CWE-489/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Compliant Solution

  Intro_to_multiprocessing_and_multithreading/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Compliant Solution, Automated Detection, Related Guidelines

Python Code Issues:

  CWE-664/CWE-197/noncompliant02.py
    -> Execution timeout (intentional infinite loop/blocking)

  CWE-664/CWE-400/noncompliant01.py
    -> Execution timeout (intentional infinite loop/blocking)

  CWE-664/CWE-409/example01.py
    -> Execution timeout (intentional infinite loop/blocking)

  CWE-664/CWE-409/noncompliant02.py
    -> Output doesn't match expected

  CWE-664/CWE-410/noncompliant01.py
    -> Execution timeout (intentional infinite loop/blocking)

  CWE-664/CWE-410/noncompliant02.py
    -> Execution timeout (intentional infinite loop/blocking)

  CWE-664/CWE-460/noncompliant01.py
    -> Execution timeout (intentional infinite loop/blocking)

  CWE-664/CWE-833/noncompliant01.py
    -> Execution timeout (intentional infinite loop/blocking)

  CWE-664/CWE-833/noncompliant02.py
    -> Execution timeout (intentional infinite loop/blocking)

  CWE-682/CWE-1335/noncompliant01.py
    -> Execution timeout (intentional infinite loop/blocking)

  CWE-693/CWE-798/compliant01.py
    -> DeprecationWarning detected

  CWE-703/CWE-390/compliant01.py
    -> Execution timeout (intentional infinite loop/blocking)

  CWE-703/CWE-390/noncompliant01.py
    -> Execution timeout (intentional infinite loop/blocking)

======================================================================
Total Files with Issues: 44

For detailed output: uv run pytest tests/ -v
For fix instructions: see tests/README.md