# Evaluating Usage Considerations

As a software developer, before using open source software (OSS) dependencies or tools, it is important to ensure that they will fit into the long-term lifecycle of our use-case. To evaluate a potential OSS dependency for long-term use-case fit, consider these questions (all tools or services listed are merely examples):

1. **How do you intend to use the software?** Is it a build or runtime dependency? Will the software be incorporated into a versioned deliverable to users or up for the user to update themselves?
   1. Consider the full lifecycle of the update process, including deprecating or blocking old client software that has not updated, particularly where your use case is a mobile or desktop application.
   2. In the case that you only need some functionality of the software it may be helpful to understand the code structure in detail and only utilize specific portions of the software (e.g. classes, packages, modules, etc.) to solve your problem rather than the entirety of the software.
   3. If you only need the software for a debug / pre-release or as part of the build process ensure it isn't being utilized as a runtime dependency

3. **How will you become aware of updates to this software?** Are there regular releases or only a mainline branch? How will you approach updating this software (every version, minor only, etc?)
   1. If you are a significant user/contributor of this of software you may want to consider pre-release (embargoed) notice of future updates you can be ready to update.

4. **Should a vulnerability be discovered, what can you to stop immediate bleeding?** Can you degrade features, or disable functionality entirely?
   1. Consider implementing configuration options or other means of disabling functionality supported by this software if possible.
   2. In the event that a user is responsible for updating the dependency outside of your system, consider warning mechanisms to alert the user of out of date dependencies.
   3. If the software is not distributed together, consider emitting information about the version of any dependencies at startup so that the user can easily understand what version(s) were picked up and whether a particular runtime instance might be vulnerable.

5. **What happens if the software becomes unmaintained?** Are there alternatives you could switch to? Could you take on maintenance of the open source project?
   1. It may be valuable to attempt to spend some time understanding the software and making some basic modifications to prepare for the potential to need to need to maintain this software on your own.

6. **What will you do if the software does not meet a requirement of your software (e.g. scale, durability, etc.)?**
   1. Your use-cases may not be amendable to the maintainer's aspirations for the project. Will you need to fork the software? If so, how will you ensure that your fork will not devolve far from the upstream's development progress?

