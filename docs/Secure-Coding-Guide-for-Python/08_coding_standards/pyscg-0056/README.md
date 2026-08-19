# pyscg-0056: Verify Downloaded Code Before Running It

Verify a downloaded artifact against a digest or signature obtained through a separate channel before executing it.

Transport security authenticates the host that answered the request, not the bytes it returned. A mirror, a caching proxy, a compromised build host, or anyone able to alter the response body can substitute code, and the receiving process runs it with its own privileges.

Two mistakes recur:

* Executing an artifact after fetching it over `https`, treating the transport as proof of provenance.
* Comparing the artifact against a digest published beside it. Whoever replaces the artifact replaces the digest.

The expected value must therefore come from somewhere the attacker does not control, such as a value pinned in source control or a signature that chains to a key established out of band.

For packages installed from PyPI, that separate channel already exists. Under [PEP 740] an index can serve attestations about how a file was built, on a path derived from the file itself rather than from anything the uploader supplies:

```bash
curl https://pypi.org/integrity/sigstore/4.5.0/sigstore-4.5.0-py3-none-any.whl/provenance
```

The response names the publishing identity and the artifact it covers:

```json
{
  "version": 1,
  "attestation_bundles": [
    {
      "publisher": {
        "kind": "GitHub",
        "repository": "sigstore/sigstore-python",
        "workflow": "release.yml"
      },
      "attestations": [{"version": 1, "envelope": {"statement": "...", "signature": "..."}}]
    }
  ]
}
```

The `envelope.statement` is a base64 encoded [in-toto] statement of type
`https://in-toto.io/Statement/v1`, whose subject carries the file name and its
SHA-256 digest, and whose `predicateType` is
`https://docs.pypi.org/attestations/publish/v1`. So the claim is not "this
digest sits next to this file", it is "this file, with this digest, was built
by this workflow in this repository", which is the property the rest of this
rule is about. Verifying the signature on that envelope needs tooling outside
the standard library and is beyond the scope of this rule, but reading the
publisher and digest is enough to see what an independent source of truth
looks like in practice.

## Non-Compliant Code Example

The `noncompliant01.py` code example downloads a plugin and executes it without verification.

[*noncompliant01.py:*](noncompliant01.py)

```py
"""Non-compliant Code Example"""

PLUGIN_URL = "https://downloads.example.com/plugin.py"


def get_plugin_source() -> bytes:
    """Return the bytes served by PLUGIN_URL."""
    return b"print('plugin loaded')\n"


def load_plugin() -> dict:
    """Download a plugin and run it."""
    source = get_plugin_source()
    namespace: dict = {}
    exec(source, namespace)  # noqa: S102
    return namespace


#####################
# Trying to exploit above code example
#####################
# A mirror, a cache, or anyone able to alter the response body serves these
# bytes instead. TLS authenticates the host that answered, not what it sent.
def tampered_source() -> bytes:
    """Stand in for a response body the attacker replaced."""
    return b"import os\nos.system('id')\n"


get_plugin_source = tampered_source  # noqa: F811
load_plugin()
```

The substituted code executes with the privileges of the running process.

## Compliant Solution

The `compliant01.py` code example compares the artifact against a digest pinned in source control and refuses to return it on mismatch. `hmac.compare_digest` performs the comparison in constant time.

[*compliant01.py:*](compliant01.py)

```py
"""Compliant Code Example"""

import hashlib
import hmac

PLUGIN_URL = "https://downloads.example.com/plugin.py"
# Obtained from the publisher through a channel the attacker does not control,
# such as a pinned value in this repository. A digest served alongside the
# artifact proves nothing: whoever replaces one replaces the other.
EXPECTED_SHA256 = "9f6077fbddaa732bb91278098b727709ad4a3cf5c00022057b6775e77fb92127"


class IntegrityError(Exception):
    """Raised when an artifact does not match its expected digest."""


def verify(artifact: bytes, expected_hex: str) -> bytes:
    """Return the artifact only if its digest matches the expected value."""
    digest = hashlib.sha256(artifact).hexdigest()
    if not hmac.compare_digest(digest, expected_hex):
        raise IntegrityError("artifact does not match its expected digest")
    return artifact


def get_plugin_source() -> bytes:
    """Return the bytes served by PLUGIN_URL."""
    return b"print('plugin loaded')\n"


def load_plugin() -> dict:
    """Download a plugin, verify it, and only then run it."""
    namespace: dict = {}
    try:
        source = verify(get_plugin_source(), EXPECTED_SHA256)
    except IntegrityError as error:
        print(f"rejected before execution: {error}")
        return namespace
    exec(source, namespace)  # noqa: S102
    return namespace


#####################
# Trying to exploit above code example
#####################
# A mirror, a cache, or anyone able to alter the response body serves these
# bytes instead. TLS authenticates the host that answered, not what it sent.
def tampered_source() -> bytes:
    """Stand in for a response body the attacker replaced."""
    return b"import os\nos.system('id')\n"


get_plugin_source = tampered_source  # noqa: F811
load_plugin()
```

The substituted artifact is rejected before it reaches `exec`.

## Verifying Packages Installed From an Index

A pinned digest establishes that an artifact has not changed since it was pinned. It says nothing about who produced it, and it does not scale to transitive dependencies.

For packages installed from PyPI, [PEP 740] index attestations record which repository and which workflow built a distribution, signed through Sigstore and recorded in a public transparency log. PyPI serves them at `/integrity/<project>/<version>/<file>/provenance`. Because the log is append-only and publicly auditable, a publisher cannot later deny a signature it issued.

Note that the older wheel signing mechanism is no longer available. `RECORD.jws` and `RECORD.p7s` are deprecated in the binary distribution format specification, which states that build backends "must not add them to wheels anymore" \[PyPA 2026\].

Trust on first use, where the first key seen is pinned and later keys are compared against it, is a different trust model rather than a weaker form of the same one. It detects a key changing but cannot establish that the first key was ever the right one.

## Automated Detection

<table>
    <tr>
        <td>Tool</td>
        <td>Version</td>
        <td>Checker</td>
        <td>Description</td>
    </tr>
    <tr>
        <td>Bandit</td>
        <td>1.8.3 on Python 3.13</td>
        <td>B102</td>
        <td>exec_used</td>
    </tr>
    <tr>
        <td>Bandit</td>
        <td>1.8.3 on Python 3.13</td>
        <td>B310</td>
        <td>urllib_urlopen</td>
    </tr>
    <tr>
        <td>Ruff</td>
        <td>0.12 on Python 3.13</td>
        <td>S102, S310</td>
        <td>flake8-bandit rules, detects the execution and the fetch but not the missing verification between them</td>
    </tr>
</table>

## Related Guidelines

<table>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Base: <a href="https://cwe.mitre.org/data/definitions/494.html">[CWE-494: Download of Code Without Integrity Check]</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Class: <a href="https://cwe.mitre.org/data/definitions/345.html">[CWE-345: Insufficient Verification of Data Authenticity]</a></td>
    </tr>
    <tr>
        <td><a href="http://cwe.mitre.org/">MITRE CWE</a></td>
        <td>Class: <a href="https://cwe.mitre.org/data/definitions/829.html">[CWE-829: Inclusion of Functionality from Untrusted Control Sphere]</a></td>
    </tr>
    <tr>
        <td><a href="https://wiki.sei.cmu.edu/confluence/display/java/SEI+CERT+Oracle+Coding+Standard+for+Java">[SEI CERT Oracle Coding Standard for Java]</a></td>
        <td><a href="https://wiki.sei.cmu.edu/confluence/display/java/SEC06-J.+Do+not+rely+on+the+default+automatic+signature+verification+provided+by+URLClassLoader+and+java.util.jar">[SEC06-J. Do not rely on the default automatic signature verification provided by URLClassLoader and java.util.jar]</a></td>
    </tr>
</table>

## Bibliography

<table>
    <tr>
        <td>[PyPA 2026]</td>
        <td>Binary distribution format [online]. Available from: <a href="https://packaging.python.org/en/latest/specifications/binary-distribution-format/">https://packaging.python.org/en/latest/specifications/binary-distribution-format/</a> [Accessed 4 August 2026]</td>
    </tr>
    <tr>
        <td>[PEP 740 2024]</td>
        <td>PEP 740 - Index support for digital attestations [online]. Available from: <a href="https://peps.python.org/pep-0740/">https://peps.python.org/pep-0740/</a> [Accessed 4 August 2026]</td>
    </tr>
    <tr>
        <td>[in-toto 2024]</td>
        <td>in-toto Attestation Framework Specification [online]. Available from: <a href="https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md">https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md</a> [Accessed 19 August 2026]</td>
    </tr>
    <tr>
        <td>[Python 2026]</td>
        <td>hmac - Keyed-Hashing for Message Authentication [online]. Available from: <a href="https://docs.python.org/3/library/hmac.html#hmac.compare_digest">https://docs.python.org/3/library/hmac.html#hmac.compare_digest</a> [Accessed 4 August 2026]</td>
    </tr>
    <tr>
        <td>[NIST 2022]</td>
        <td>SP 800-218 Secure Software Development Framework (SSDF) Version 1.1 [online]. Available from: <a href="https://csrc.nist.gov/pubs/sp/800/218/final">https://csrc.nist.gov/pubs/sp/800/218/final</a> [Accessed 4 August 2026]</td>
    </tr>
</table>

[PEP 740]: https://peps.python.org/pep-0740/
[in-toto]: https://github.com/in-toto/attestation/blob/main/spec/v1/statement.md
