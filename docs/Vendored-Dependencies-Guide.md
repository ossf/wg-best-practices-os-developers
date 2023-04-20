# Best Practice: Vulnerabilites in Vendored Dependencies

A “vendored” dependency is any dependency that can't be directly updated by the end-user. Vendoring is the process of adding vendored dependencies.

It's considered best-practice, when updating a vendored dependency to fix a vulnerability, that the Project issues their own disclosure of that vulnerability. The Project should also assign the existing CVE ID of the affected package to their software. The impact should be assessed and communicated in the context of the Project’s use of that dependency. Finally, reach out to the CNA for the original vulnerability to add the Project’s advisory to the list of links.

NB: A project is that vendors dependencies is not necessarily a vendor.
