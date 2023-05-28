
## Enterprise Should Not Allow Members To Invite Outside Collaborators
policy name: enterprise_allows_inviting_externals_collaborators

severity: MEDIUM

### Description
The enterprise's external collaborators invite policy should be set to enterprise/organization owners only. Allowing members to invite external collaborators might result in unauthorized access to the internal projects.

### Threat Example(s)
Inviting external collaborators could result in a loss of control over proprietary information and potentially expose the organization to security risks, such as data leaks.



### Remediation
1. Make sure you are an enterprise owner
2. Go to the policies page
3. Under the "Repository outside collaborators" section - choose the "Enterprise Owners Only" or the "Organization Owners Only" option


