## Project Doesn't Require All Conversations To Be Resolved Before Merge
policy name: no_conversation_resolution

severity: LOW

### Description
Require all merge request conversations to be resolved before merging. Check this to avoid bypassing/missing a Pull Reuqest comment.

### Threat Example(s)
Allowing the merging of code without resolving all conversations can promote poor and vulnerable code, as important comments may be forgotten or deliberately ignored when the code is merged.



### Remediation
1. Make sure you can manage project merge requests permissions
2. Go to the project's settings page
3. Select "Merge Requests"
4. Press on the "All threads must be resolved"
5. Click "Save changes"



