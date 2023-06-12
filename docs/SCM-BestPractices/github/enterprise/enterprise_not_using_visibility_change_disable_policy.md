
## Enterprise Should Not Allow Members To Change Repository Visibility
policy name: enterprise_not_using_visibility_change_disable_policy

severity: MEDIUM

### Description
The enterprise's Repository visibility change policy should be set to DISABLED. This will prevents users from creating private repositories and change them to be public. Malicous actors could leak code if enabled.

### Threat Example(s)
A member of the organization could inadvertently or maliciously make public an internal repository exposing confidential data.



### Remediation
1. Make sure you are an enterprise owner
2. Go to the policies page
3. Under the "Repository visibility change" section
4. choose the "Disabled" option


