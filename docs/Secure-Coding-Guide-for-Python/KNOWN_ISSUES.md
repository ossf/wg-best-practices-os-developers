ISSUES FOUND
======================================================================

Documentation Issues:

  CWE-664/CWE-134/README.md
    -> Inlined code doesn't match file content

  CWE-664/CWE-197/01/README.md
    -> E       Missing required sections: Bibliography

  CWE-664/CWE-197/README.md
    -> E       Missing required sections: Bibliography
    -> Section order issue

  CWE-664/CWE-209/README.md
    -> Inlined code doesn't match file content

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
    -> Inlined code doesn't match file content

  CWE-664/CWE-460/README.md
    -> E       Missing required sections: Bibliography
    -> Inlined code doesn't match file content

  CWE-664/CWE-501/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Compliant Solution

  CWE-664/CWE-502/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Bibliography
    -> E       Missing file: rpcpy-exploit.py

  CWE-664/CWE-532/README.md
    -> E       Missing required sections: Bibliography
    -> Section order issue

  CWE-664/CWE-584/README.md
    -> Inlined code doesn't match file content

  CWE-664/CWE-665/README.md
    -> E       Missing required sections: Automated Detection, Bibliography

  CWE-664/CWE-681/01/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Bibliography
    -> Section order issue

  CWE-664/CWE-833/README.md
    -> E       Missing required sections: Bibliography
    -> Section order issue

  CWE-664/CWE-843/README.md
    -> Inlined code doesn't match file content

  CWE-682/CWE-1335/01/README.md
    -> E       Missing required sections: Bibliography
    -> Section order issue

  CWE-682/CWE-1335/README.md
    -> Inlined code doesn't match file content

  CWE-682/CWE-191/README.md
    -> E       Missing required sections: Automated Detection
    -> Section order issue
    -> Inlined code doesn't match file content

  CWE-691/CWE-362/README.md
    -> Inlined code doesn't match file content

  CWE-693/CWE-182/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Compliant Solution

  CWE-693/CWE-184/README.md
    -> Inlined code doesn't match file content

  CWE-693/CWE-330/README.md
    -> E       Missing required sections: Compliant Solution, Bibliography

  CWE-693/CWE-472/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Compliant Solution, Bibliography

  CWE-693/CWE-778/README.md
    -> E       Missing required sections: Bibliography

  CWE-693/CWE-798/README.md
    -> Inlined code doesn't match file content

  CWE-703/CWE-230/README.md
    -> Inlined code doesn't match file content

  CWE-703/CWE-252/README.md
    -> Section order issue
    -> Inlined code doesn't match file content

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
    -> Inlined code doesn't match file content

  CWE-707/CWE-175/README.md
    -> Section order issue
    -> Inlined code doesn't match file content

  CWE-707/CWE-78/README.md
    -> Inlined code doesn't match file content

  CWE-707/CWE-838/README.md
    -> Inlined code doesn't match file content

  CWE-710/CWE-1109/README.md
    -> Section order issue
    -> Inlined code doesn't match file content

  CWE-710/CWE-489/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Compliant Solution

  Intro_to_multiprocessing_and_multithreading/README.md
    -> E       Missing required sections: Non-Compliant Code Example, Compliant Solution, Automated Detection, Related Guidelines
    -> Inlined code doesn't match file content

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

  CWE-691/CWE-366/compliant01.py
    -> Execution timeout (intentional infinite loop/blocking)

======================================================================
Total Files with Issues: 53

For detailed output: uv run pytest tests/ -v
For fix instructions: see tests/README.md