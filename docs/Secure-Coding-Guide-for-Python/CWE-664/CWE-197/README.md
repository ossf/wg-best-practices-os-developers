# CWE-197: Numeric Truncation Error

Ensure to have predictable outcomes in loops by using int instead of `float` variables as a counter.

Floating-point arithmetic can only represent a finite subset of real numbers [[IEEE Std 754-2019](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8766229)], such as `0.555....` represented by `0.5555555555555556` also discussed in [CWE-1339: Insufficient Precision or Accuracy of a Real Number](https://github.com/ossf/wg-best-practices-os-developers/tree/main/docs/Secure-Coding-Guide-for-Python/CWE-682/CWE-1339). Code examples in this rule are based on [Albing and Vossen, 2017].

Side effects of using `float` as a counter is demonstrated in `example01.py` showcasing that calculating `0.1 + 0.2` does not end up as `0.3`.

[*example01.py:*](example01.py)

```py
""" Code Example """

value = 0.0
while value <= 1:
    print(f"{type(value)} {value}")
    value += 0.1
```

 **Output of example01.py:**

```bash
<class 'float'> 0.0
<class 'float'> 0.1
<class 'float'> 0.2
<class 'float'> 0.30000000000000004
<class 'float'> 0.4
<class 'float'> 0.5
<class 'float'> 0.6
<class 'float'> 0.7
<class 'float'> 0.7999999999999999
<class 'float'> 0.8999999999999999
<class 'float'> 0.9999999999999999
```

## Non-Compliant Code Example

 The `noncompliant01.py` code demonstrates a side effect when a floating point counter is used.

[*noncompliant01.py:*](noncompliant01.py)

```py
""" Non-compliant Code Example """
counter = 0.0
while counter <= 1.0:
    if counter == 0.8:
        print("we reached 0.8")  
        break  # never going to reach this
    counter += 0.1
```

The `noncompliant01.py` code will never print "we are at 0.8" due to lack of precision or controlled rounding.

## Compliant Solution

The `compliant01.py` makes use of integer as long as possible and only converts to `float` where needed.

[*compliant01.py:*](compliant01.py)

```py
""" Compliant Code Example """
counter = 0
while counter <= 10:
    value = counter/10
    if value == 0.8:
        print("we reached 0.8")
        break
    counter += 1
```

The use of `range(10)` is more compact and prohibits `float`.

## Non-Compliant Code Example - Infinite Loop

Python `float` has a limit in precision as demonstrated in `example02.py`

[*example02.py:*](example02.py)

```py
""" Code Example """
print(f"{1.0 + 1e-16:.20f}")
print(f"{1.0 + 1e-15:.20f}")
```

**Output of example02.py:**

```bash
1.00000000000000000000
1.00000000000000111022
```

Below `noncompliant02.py` code tries to increment a floating-point `COUNTER` by a too small value causing an infinite loop.

[*noncompliant02.py:*](noncompliant02.py)

```py
""" Non-compliant Code Example """
counter = 1.0 + 1e-16
target = 1.0 + 1e-15
while counter <= target:  # never ends
    print(f"counter={counter / 10**16 :.20f}")
    print(f" target={target / 10**16:.20f}")
    counter += 1e-16

```

The code will loop forever due to missing precision in the initial calculation of `COUNTER = 1.0 + 1e-16`.

## Compliant Solution - Infinite Loop

Use of an `int` loop counter that is only converted to `float` when required is demonstrated in `compliant2.py`.

[*compliant02.py:*](compliant02.py)

```py
""" Compliant Code Example """
counter = 1
target = 10
while counter <= target:
    print(f"counter={counter / 10**16 :.20f}")
    print(f" target={target / 10**16:.20f}")
    counter += 1
```

## Definitions

|Definition|Explanation|Reference|
|:---|:---|:---|
|Loop Counters|loop counters are variables used to control the iterations of a loop|[Loops and their control variables](http://www.knosof.co.uk/vulnerabilities/loopcntrl.pdf)|

## Automated Detection

|Tool|Version|Checker|Description|
|:---|:---|:---|:---|
|Bandit|1.7.4 on Python 3.10.4|Not Available||
|Flake8|8-4.0.1 on Python 3.10.4|Not Available||

## Related Guidelines

|||
|:---|:---|
|[MITRE CWE](http://cwe.mitre.org/)|Pillar [CWE-664: Improper Control of a Resource Through its Lifetime (4.13) (mitre.org)](https://cwe.mitre.org/data/definitions/664.html)|
|[MITRE CWE](http://cwe.mitre.org/)|Class [CWE-197: Numeric Truncation Error](https://cwe.mitre.org/data/definitions/197.html)|
|[SEI CERT Coding Standard for Java](https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java)|[NUM09-J. Do not use floating-point variables as loop counters](https://wiki.sei.cmu.edu/confluence/display/java/NUM09-J.+Do+not+use+floating-point+variables+as+loop+counters)|
|[SEI CERT C Coding Standard](https://web.archive.org/web/20220511061752/https://wiki.sei.cmu.edu/confluence/display/c/SEI+CERT+C+Coding+Standard)|[FLP30-C. Do not use floating-point variables as loop counters](https://web.archive.org/web/20220511061752/https://wiki.sei.cmu.edu/confluence/display/c/FLP30-C.+Do+not+use+floating-point+variables+as+loop+counters)|
|[ISO/IEC TR 24772:2019]|Programming languages — Guidance to avoiding vulnerabilities in programming languages, available from [https://www.iso.org/standard/71091.html](https://www.iso.org/standard/71091.html)|

## Biblography

|||
|:---|:---|
|[IEEE Std 754-2019](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8766229)|IEEE Standard for Floating-Point Arithmetic, available from: [https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8766229](https://ieeexplore.ieee.org/stamp/stamp.jsp?tp=&arnumber=8766229), [Last  accessed June 2024] |
|[Loops and control variables]|Derek M. Jones(2006 )Loops and their control variables, Discussion and proposed guidelines:[http://www.knosof.co.uk/vulnerabilities/loopcntrl.pdf](http://www.knosof.co.uk/vulnerabilities/loopcntrl.pdf), [Last accessed October 2025] |
|[Albing and Vossen, 2017]|Albin, C. and Vossen, JP (2017) 6.13 Looping with Floating Point Values. In: Bleiel, J., Brown, K. and Head, R. eds. bash Cookbook: Solutions and Examples for bash Users, 2d Edition. Sebastopol: O'Reilly Media, Inc., pp.159-160|
|[Bloch 2005]|Puzzle 34, "Down for the Count", available from: [https://web.archive.org/web/20220511061752/https://wiki.sei.cmu.edu/confluence/display/java/Rule+AA.+References#RuleAA.References-Bloch05](https://web.archive.org/web/20220511061752/https://wiki.sei.cmu.edu/confluence/display/java/Rule+AA.+References#RuleAA.References-Bloch05), [Last accessed August 2024] |
