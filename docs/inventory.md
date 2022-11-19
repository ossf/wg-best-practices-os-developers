# Inventory

## User Stories

1. As a user, I want an inventory that holds:
   - Training resources
   - DevSecOps tools
   - Best practices for the technology being used
2. As a user, I want a user-friendly interface to go through the inventory and identify my needs. I want to be able to search for the items relevant to a specific technology, framework, language.
3. As a user, I want to be able to link my account to the inventory to keep track of my activity on it.
4. As a user, I want to be able to save resources that fit my needs.
5. As a user, I want to view recommendations and ratings from the community on the resources provided.
6. As a user, I want to be able to rate and review the resources provided.
7. As a user, I want the inventory to be pluggable inside my repositories in order to quickly reference resources (use them, share them, etc.) -- This user story would be more to encourage the usage of the inventory and have it like a pocket book for the devs.
8. As a user, I want to set guidelines based on the inventory. -- Referenceable inventory
9. As a user, I want each best practice in the inventory to link to a given hands-on exercise in the learning platform.
10. As a user, I want an IDE plugin that seamlessly pulls inventory entries related to findings from code analysis or software composition analysis tools so that I have access to more resources than the link(s) within the finding alone would give me.

## Roadmap

1. Assess the fields that must be tackled in order to identify the width of the inventory (I proposed 3 fields in the user stories).
2. Create an architecture for the inventory and how it’ll be constructed.
   - It should take into consideration that this should allow user engagement, as well as reference projects, articles, and guidance.
3. Start building up the inventory with projects in a way to cover all topics. Afterwards, depth should be considered in order to provide enough variety to the user.
4. Link the github accounts (or the method of authn/authz to be used) in order for the users to have their identities on the inventory.
5. Build up the review system, top used resources, etc. in order to make it easier for users to search for the best tools.
