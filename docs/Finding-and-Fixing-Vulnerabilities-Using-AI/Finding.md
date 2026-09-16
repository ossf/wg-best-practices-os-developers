# Finding and Fixing Software Vulnerabilities Using AI: A Guide for Developers (LFD126)

David A. Wheeler

This is a guide for software developers and vulnerability researchers on finding and fixing vulnerabilities using artificial intelligence (AI). We intend to create a course using this guide (by  adding quizzes and a final exam). This guide/course is a joint effort between the OpenSSF Best Practices working group (WG) and the OpenSSF AI/ML WG.

[Introduction](#introduction)

[Scope of this material](#scope-of-this-material)

[Course Learning Outcomes](#course-learning-outcomes)

[No endorsement intended](#no-endorsement-intended)

[Why this is important](#why-this-is-important)

[AI is accelerating vulnerability-finding](#ai-is-accelerating-vulnerability-finding)

[Attack speed is accelerating](#attack-speed-is-accelerating)

[Manual closed approaches are failing](#manual-closed-approaches-are-failing)

[What hasn’t changed](#what-hasn’t-changed)

[Good news: Long-term potential for eliminating nearly all vulnerabilities](#good-news:-long-term-potential-for-eliminating-nearly-all-vulnerabilities)

[Overview](#overview)

[AI concepts](#ai-concepts)

[Basic terminology](#basic-terminology)

[Strengths and weaknesses](#strengths-and-weaknesses)

[Models](#models)

[External vs. local models](#external-vs.-local-models)

[Licenses](#licenses)

[Specialized models](#specialized-models)

[AI guardrails & intentional limitations](#ai-guardrails-&-intentional-limitations)

[Cyber Reasoning System (CRS) History](#cyber-reasoning-system-\(crs\)-history)

[AI organizations, projects, and services](#ai-organizations,-projects,-and-services)

[Decide on Approaches](#decide-on-approaches)

[Do not ignore AI](#do-not-ignore-ai)

[Do not wait for access to best AI models](#do-not-wait-for-access-to-best-ai-models)

[Do simple things first](#do-simple-things-first)

[AI more effective if guided by process](#ai-more-effective-if-guided-by-process)

[Processes for using AI to find and fix vulnerabilities](#processes-for-using-ai-to-find-and-fix-vulnerabilities)

[Challenges of finding and evaluating tools](#challenges-of-finding-and-evaluating-tools)

[Sample services and tools](#sample-services-and-tools)

[Scrutineer](#scrutineer)

[OSS-CRS](#oss-crs)

[Do multiple times due to non-determinism and long tail](#do-multiple-times-due-to-non-determinism-and-long-tail)

[Prepare to find and fix vulnerabilities](#prepare-to-find-and-fix-vulnerabilities)

[Preparing AI](#preparing-ai)

[Preparing the threat model](#preparing-the-threat-model)

[Preparing sandbox](#preparing-sandbox)

[Preparing the code and documentation](#preparing-the-code-and-documentation)

[Preparing CI/CD](#preparing-ci/cd)

[Preparing dependency updates](#preparing-dependency-updates)

[Core tasks for finding and fixing vulnerabilities](#core-tasks-for-finding-and-fixing-vulnerabilities)

[Identify findings](#identify-findings)

[Separate identifying findings from validation](#separate-identifying-findings-from-validation)

[Helping to identify findings](#helping-to-identify-findings)

[Findings process](#findings-process)

[Handling external findings/vulnerabilities](#handling-external-findings/vulnerabilities)

[De-duplicate](#de-duplicate)

[Validate findings](#validate-findings)

[Defining what a vulnerability is](#defining-what-a-vulnerability-is)

[Defining the proof required](#defining-the-proof-required)

[Tips for validation](#tips-for-validation)

[Triage](#triage)

[Fix vulnerabilities](#fix-vulnerabilities)

[Fixing is often necessary for sending reports to external organizations](#fixing-is-often-necessary-for-sending-reports-to-external-organizations)

[Assigning the fix](#assigning-the-fix)

[Creating tests and confirming the root problem](#creating-tests-and-confirming-the-root-problem)

[How to create the fix](#how-to-create-the-fix)

[Verifying the fix](#verifying-the-fix)

[Report vulnerability](#report-vulnerability)

[EU Cyber Resilience Act (CRA) reporting](#eu-cyber-resilience-act-\(cra\)-reporting)

[Release & deploy](#release-&-deploy)

[Repeated application](#repeated-application)

[Preventing vulnerabilities longer term](#preventing-vulnerabilities-longer-term)

[Limit vibe coding](#limit-vibe-coding)

[Evaluate merge/pull requests](#evaluate-merge/pull-requests)

[Apply secure by design and secure by default](#apply-secure-by-design-and-secure-by-default)

[Harden](#harden)

[Applying hardening](#applying-hardening)

[Harden to counter chaining](#harden-to-counter-chaining)

[Disable hardening and evaluate hardening during evaluation](#disable-hardening-and-evaluate-hardening-during-evaluation)

[Harden the deployed environment and infrastructure](#harden-the-deployed-environment-and-infrastructure)

[Call to action](#call-to-action)

[TODO](#todo)

[Bibliography](#bibliography)

# Introduction {#introduction}

## Scope of this material {#scope-of-this-material}

This is a guide/course on finding and fixing vulnerabilities in software using artificial intelligence (AI)/machine learning (ML). It is intended for:

* *software developers*, to help them find and fix vulnerabilities in software (especially software they’re responsible for), and for  
* *security researchers*, who are trying to help those software developers.

It includes the process of finding, validating, and generating fixes, as well as related tasks that make this process more effective. These processes apply when examining the entire project, or when examining a particular set of proposed changes. We expect this material to apply to any software regardless of its license, but we do include a few notes specifically on open source software (OSS).

We don’t focus on any *specific* system to do this. There are many systems that can help with this, there are more all the time, using multiple systems can be helpful, and the industry is rapidly changing. We instead focus on general principles that we believe are more timeless and will help you regardless of the systems you use to find and fix vulnerabilities. Once you understand the general issues, you’ll be more effective when using any particular system.

For a more general introduction on AI/ML, software development, and security, see our course   
*Secure AI/ML-Driven Software Development (LFEL1012)* at [https://training.linuxfoundation.org/express-learning/secure-ai-ml-driven-software-development-lfel1012/](https://training.linuxfoundation.org/express-learning/secure-ai-ml-driven-software-development-lfel1012/).

Please note that this course does NOT focus on the following topics:

1. Building AI models & AI systems.  
2. Building/fixing software or systems that include AI. This course is still applicable, but we don’t discuss anything special related to that situation.  
3. How to write secure software in general. Please take our LFD121 course to learn that.  
4. Evaluating malicious or possibly-malicious software. We’re presuming that software developers are investigating their own software or software they want to contribute to that isn’t intended to be malicious. The focus here is on *unintentional* vulnerabilities.

This material is a joint effort between the OpenSSF Best Practices working group (WG) and the OpenSSF AI/ML WG. Its lead author is David A. Wheeler. Reviewers include Laura Guazzelli.

## Course Learning Outcomes {#course-learning-outcomes}

When you complete this course, you will be able to:

1. Prepare to find and fix vulnerabilities. This includes how to prepare the AI and its sandbox, as well as how to prepare the software threat model, code/documentation, and CI/CD processes to make this more effective.  
2. Find & fix vulnerabilities using AI. This includes:  
   1. knowing the value of separating the process of identifying findings from validating them.  
   2. How to identify findings (potential vulnerabilities), including mechanisms for increasing the likelihood of finding such as using past vulnerability reports.  
   3. How to de-duplicate, validate, and triage findings.  
   4. How to fix vulnerabilities, including the importance of ensuring that a defect is fully fixed.  
   5. Knowing important aspects of reporting, releasing, and deploying the fixes.  
   6. Understanding the need for repeated application, since the non-deterministic nature of modern AI means that a single application may miss important issues.  
3. Prevent longer-term problems. This includes evaluating merge/pull requests, the need for secure-by-design and secure-by-default, and the importance of larger-scale hardening.

## No endorsement intended {#no-endorsement-intended}

This course will mention many AI models, systems, tools, and services, so that we can be better grounded in reality. However, no specific endorsement is intended. Specific technology may have changed as you read this, since the whole computing industry is undergoing rapid change. Our focus is on general principles that are less likely to change.

## Why this is important {#why-this-is-important}

AI has become incredibly good at finding vulnerabilities, for both attackers *and* defenders. This is requiring defenders to *rapidly* find and fix vulnerabilities using AI. If they don’t, their resulting systems will be repeatedly taken over by attackers who are *already* using AI.

CloudStrike found that even back in 2025, “AI-enabled adversaries increased attacks by 89% year-over-year” \[[CloudStrike2026-Global](https://go.crowdstrike.com/2026-global-threat-report.html)\]. That’s accelerating now.

There are many reasons this topic is important. Here we summarize them, with quotes and citations showing that this is *real*.

### AI is accelerating vulnerability-finding {#ai-is-accelerating-vulnerability-finding}

* *The cost, expertise, and effort to find vulnerabilities has collapsed*.  
  * “With the latest frontier AI models, the cost, effort, and level of expertise required to find and exploit software vulnerabilities have all dropped dramatically. Over the past year, AI models have become increasingly effective at reading and reasoning about code—in particular, they show a striking ability to spot vulnerabilities and work out ways to exploit them.” \[[Anthropic2026-04g](https://www.anthropic.com/glasswing)\]  
* *Far more vulnerabilities are being found with AI*. Agentic AI can find *far* more vulnerabilities (exploitable defects) than non-AI systems. AI is able to use other tools and integrate that information to discover problems.  
  * One paper “found that \[AI was\]  crucial to the success of \[finding vulnerabilities; without AI traditional fuzzers\] were unable to discover a single bug within a four-hour time limit in any of 20 trials. …. \[this\] highlights the importance of integrating LLM-assisted tooling into automated security workflows.” \[[Wolff2026](https://cacm.acm.org/research/large-language-models-in-software-security-analysis/)\]  
* *AI can rapidly turn vulnerabilities into exploits, often by chaining multiple defects together*. AI’s ability to rapidly turn a vulnerability into an exploit accelerates the need for repair. In particular, AI can often combine multiple minor-seeming defects into a chain that is devastating.  
  * “Over the past year, AI models have become increasingly effective at reading and reasoning about code—in particular, they show a striking ability to spot vulnerabilities and work out ways to exploit them. Claude Mythos Preview demonstrates a leap in these cyber skills—the vulnerabilities it has spotted have in some cases survived decades of human review and millions of automated security tests, and the exploits it develops are increasingly sophisticated… frontier AI models are now becoming competitive with the best humans at finding and exploiting vulnerabilities.”” \[[Anthropic2026-04g](https://www.anthropic.com/glasswing)\]  
* *The speed of finding and exploiting vulnerabilities has dramatically accelerated*.  
  * “AI is making it possible to detect severe security vulnerabilities at highly accelerated speeds.” \[[Anthropic2026-03](https://www.anthropic.com/news/mozilla-firefox-security)\]  
* *Far more attackers are now able to create sophisticated attacks*.  
  * “Advanced frontier models (like Claude Mythos Preview) and optimized open-weight models have democratized the ability to find complex vulnerabilities and construct exploit chains, exposing non-traditional targets to high-level threats.” \[[Wolff2026](https://cacm.acm.org/research/large-language-models-in-software-security-analysis/)\]

### Attack speed is accelerating {#attack-speed-is-accelerating}

* *Attackers are becoming faster and more dangerous*.  
  * \[[FiveEyes2026](https://www.cyber.gov.au/sites/default/files/2026-06/Five%20eyes%20cyber%20security%20agencies%20statement.pdf)\] says that “Adversaries are already using AI to move faster and more effectively. Defenders must do the same.”  
  * CrowdStrike similarly says “AI systems are beginning to assist with tasks that materially improve offensive velocity \[and will be used by\] adversaries.” \[Crowdstrike2026-FiveSteps\]  
  * “The window between a vulnerability being publicly disclosed and weaponized has dramatically collapsed to hours or minutes, as AI can instantly reverse-engineer patches to create exploit blueprints.” \[[Wolff2026](https://cacm.acm.org/research/large-language-models-in-software-security-analysis/)\]  
* *Attackers are now, on average, exploiting vulnerabilities before a patch is released*.  
  * “Mandiant’s M-Trends 2026 report measures the mean time between a vulnerability becoming publicly known and the first observed exploitation in the wild. In 2018, that interval was 63 days. By 2023 it had collapsed to 5 days. In 2025, it inverted. Attackers are now exploiting vulnerabilities an average of 7 days before patches are released.” \[[Cycode2026](https://cycode.com/blog/claude-mythos-security-readiness/)\]  
  * Similarly, ZeroDayClock says that in “2018, the median time from a vulnerability being disclosed to the first observed exploit was 771 days. Organizations had over two years to patch. By 2023 that window was 6 days. By 2024 it was 4 hours. In 2025, the majority of exploited vulnerabilities were weaponized before they were even publicly disclosed. The data fits an exponential decay curve. This is not a trend that stabilizes. It is a collapse.” \[[ZeroDayClock](https://zerodayclock.com/)\]

### Manual closed approaches are failing {#manual-closed-approaches-are-failing}

* *Traditional slow security measures are ineffective.*  
  * “As AI speeds up both discovery and exploitation, organizations need to move from periodic assessment to continuous, intelligence-driven exposure management so they can determine what really matters, prioritize real risk, and quickly coordinate remediation. They must also prepare for a surge in vulnerability discovery and patch activity that many organizations are not operationally prepared to absorb… As vulnerabilities are discovered and exploited on shorter timelines, traditional security approaches built on periodic assessments, severity scores, and human-paced response are becoming less effective. Defenders need a new model centered on exploitability, continuous validation of exposure, stronger prevention, cross-domain visibility, decisive response, and governed use of AI.” \[Crowdstrike2026-FiveSteps\]  
  * “Here is the systemic problem. When a software vendor releases a security patch, AI can now reverse-engineer that patch, identify the vulnerability it fixes, and generate a working weaponized exploit in minutes. Attacks can begin propagating across the world within hours. But organizations need an average of 20 days to test and deploy that same patch. The act of fixing a vulnerability now accelerates its exploitation. The defense creates the offense. And the offense arrives weeks before the defense can finish deploying.” \[[ZeroDayClock](https://zerodayclock.com/)\]  
* *Deployment delays become real-world harm*.  
  * “A large fraction of real-world harm comes from N-days: vulnerabilities that have been publicly disclosed and patched, but which remain exploitable on the many systems that haven't yet applied the fix. In some ways N-days are the more dangerous case: the vulnerability is known to exist, the patch itself is a roadmap to the bug, and the only thing standing between disclosure and mass exploitation is the time it takes an attacker to turn that patch into a working exploit.” \[[Carlini2026](https://red.anthropic.com/2026/mythos-preview/)\]  
* *Hiding source code doesn’t help*.  
  * “We have also found the model to be extremely capable of reverse engineering: taking a closed-source, stripped binary and reconstructing (plausible) source code for what it does. From there, we provide Mythos Preview both the reconstructed source code and the original binary, and say, ‘Please find vulnerabilities in this closed-source project. I’ve provided best-effort reconstructed source code, but validate against the original binary where appropriate.’ We then run this agent multiple times across the repository, exactly as before.” \[[Carlini2026](https://red.anthropic.com/2026/mythos-preview/)\]  
* *Failure to use AI to defend may in some cases be considered negligence*.  
  * “When AI can find significantly more vulnerabilities at accessible cost, the standard of what constitutes reasonable defensive effort shifts. Boards will face questions about whether they used available AI tools for defensive scanning, and whether not doing so constitutes negligence. This is a governance risk with direct financial exposure.” \[[CSA2026](https://labs.cloudsecurityalliance.org/mythos-ciso/)\]

## What hasn’t changed {#what-hasn’t-changed}

It’s not all bad news, however. Despite these large increases in speed-to-find and exploitability, the fundamental principles of developing secure software remain as the best defense.

“AI does not change the fundamentals of… security. Least privilege, minimal attack surfaces, coordinated vulnerability disclosure, and proactive security engineering still win. What AI changes is the velocity of attacks, of reports, of fixes, and of the expectations placed on maintainers and security engineers alike. The communities and projects that learn to work with these tools intentionally will be better positioned than those that ignore them or are overwhelmed by them.” \[[Aniszczyk2026](https://openssf.org/resources/securing-open-source-in-the-age-of-ai-a-practical-guide/)\]

In short, the “normal” tasks for security are *still* important with AI \[[Oshungboye](https://dev.to/coderabbitai/how-to-use-ai-to-identify-and-fix-security-vulnerabilities-in-your-codebase-4na2)\]. AI generally isn’t finding whole new *kinds* of vulnerabilities in software \[[Holley2026](https://blog.mozilla.org/en/privacy-security/ai-security-zero-day-vulnerabilities/)\]; AI is finding the same old vulnerabilities caused by various sloppy practices and failure to apply best practices. By applying already-known best practices, and using AI on the defensive side to speed up its application, it’s possible to address the problem of AI-amplified attacks.  The following material details how to adopt those principles using AI.

## Good news: Long-term potential for eliminating nearly all vulnerabilities {#good-news:-long-term-potential-for-eliminating-nearly-all-vulnerabilities}

In the longer term there is *great* news for defenders. As Bobby Holley of Mozilla put it, “**Defenders finally have a chance to win, decisively**…. **the defects are finite, and we are entering a world where we can finally find them all.**” \[[Holley2026](https://blog.mozilla.org/en/privacy-security/ai-security-zero-day-vulnerabilities/)\]

Holley explains, “security to date has been offensively-dominant: the attack surface isn’t infinite, but it’s large enough to be difficult to defend comprehensively with the tools we’ve had available. This gives attackers an asymmetric advantage, since they only need to find one chink in the armor…. So far we’ve found no category or complexity of vulnerability that humans can find that \[Mythos Preview\] can’t. This can feel terrifying in the immediate term, but it’s ultimately great news for defenders. A gap between machine-discoverable and human-discoverable bugs favors the attacker, who can concentrate many months of costly human effort to find a single bug. Closing this gap erodes the attacker’s long-term advantage by making all discoveries cheap” \[[Holley2026](https://blog.mozilla.org/en/privacy-security/ai-security-zero-day-vulnerabilities/)\]

There’s strong evidence that if a project works hard to find and fix vulnerabilities, it becomes increasingly difficult to find any more, *even with AI*. For example, the curl project is well-known for working hard to prevent security vulnerabilities. Even the best AI models, when focused on it, have tended to find few vulnerabilities in it \[[LowLevel2026](https://www.youtube.com/watch?v=IS4OgH74gY4)\] \[[Stenberg2026-05a](https://daniel.haxx.se/blog/2026/05/11/mythos-finds-a-curl-vulnerability/)\]. This is not magic; it’s because of previous efforts to make it secure.  Other projects can do the same. Since actual software is finite, “there’s a finite number \[of vulnerabilities\] in a program; once fixed, attackers can’t exploit vulnerabilities that don’t exist.” \[Wheeler2026\]

Of course, this doesn’t make this *easy* or pleasant to go through. “You may need to \[briefly\] reprioritize everything else to bring relentless and single-minded focus to the task” \[[Holley2026](https://blog.mozilla.org/en/privacy-security/ai-security-zero-day-vulnerabilities/)\]. Still, there’s reason to believe that once you do this, the resulting software will be far more secure than it’s ever been.

## Overview {#overview}

In this material we’ll first cover AI concepts. This will be followed by a guide for selecting approaches for finding and fixing vulnerabilities using AI. After that, we’ll discuss how to:

* Prepare  
  * Specifically, how to prepare AI, threat model, sandbox, code and documentation, CI/CD, and dependency updates  
* Find & fix vulnerabilities  
  * Identify findings  
  * De-duplicate  
  * Validate findings  
  * Triage  
  * Fix vulnerabilities  
  * Report vulnerability  
  * Release & deploy  
  * Repeated application  
* Prevent  
  * Limit vibe coding  
  * Evaluate merge/pull requests  
  * Apply secure by design and secure by default  
  * Harden

# AI concepts {#ai-concepts}

Before we discuss using AI to find and fix vulnerabilities, we need to first understand some basic AI concepts. This section will focus on *only* the basics of current AI necessary for our topic.

## Basic terminology {#basic-terminology}

First, let’s go over a few basic AI terms (it’s likely you know many of these):

* *Artificial Intelligence (AI)*: Simulated intelligence.  
* *Machine Learning (ML)*: AI based on learning from data (instead of being specifically programmed to perform a task)  
* *Neural network*: An ML method that uses interconnected nodes to learn from patterns to make predictions, in an approach loosely inspired by the human brain.  
* *Deep learning*: An ML approach using a neural network with many layers.  
* *Model*: A set of data, and possibly corresponding programs, trained to identify data patterns to make predictions or decisions. ML systems typically train a model with large amounts of data, then later use that pre-trained model to repeatedly make predictions (“inferences”). Models are sized by the number of parameters; larger sizes tend to be better but require more memory and computation.  
* *Frontier model*: Model that is currently among the best available  
* *Large Language  Model  (LLM)*: A model using deep learning that has many parameters and is trained to summarize, translate, and generate language (at least). Text inputs and outputs of LLMs are split into tokens (words or fragments of words). See \[[0xkato2026](https://www.0xkato.xyz/how-llms-actually-work/)\] for a technical explanation of how LLMs work.  
* *AI chatbot*: An AI system designed to interactively communicate with a human but cannot perform actions that affect an external environment.  
* *AI agent*: an autonomous AI system that can perceive its environment, make plans, and execute multi-step actions using external tools to achieve a specific goal.

AI systems aren’t sentient. LLMs, for example, repeatedly generate likely next tokens; they don’t “understand” in the sense that humans do. Yet scale matters. With many layers and many parameters, modern AI systems are capable of astonishing things.

There’s also excellent evidence that AI models are getting better. One way to measure AI models is the “50%-task-completion time horizon” defined as the “time humans typically take to complete tasks that AI models can complete with a 50% success rate” \[[Kwa2025](https://arxiv.org/abs/2503.14499)\].  As of 2025 “this metric has been consistently exponentially increasing over the past 6 years, with a doubling time of around 7 months” \[[Kwa2025-blog](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)\].

## Strengths and weaknesses {#strengths-and-weaknesses}

Current AI builds on LLMs (or technology like them), so they inherit the strengths and weaknesses of them. Their limitations include:

* *Limited context windows*. LLMs are typically trained on a vast amount of data, but for effective use they need whatever data they should focus on as input. LLMs can only take a finite amount of this input the “context window”), more input increases the work needed, and LLMs reliably focus on information at the beginning and end of its context window \[[0xkato2026](https://www.0xkato.xyz/how-llms-actually-work/)\].  
* *Unsoundness*.  By itself, an LLM is unsound, that is, it cannot *guarantee* a program is free of some particular vulnerabilities if it doesn’t find any \[[Wolff2026](https://cacm.acm.org/research/large-language-models-in-software-security-analysis/)\].  
* *Incompleteness/incorrect results*. LLMs are statistical models; they sometimes give false answers. E.g., they may claim something is a vulnerability when it is not \[[Wolff2026](https://cacm.acm.org/research/large-language-models-in-software-security-analysis/)\].  
* *Training and evaluation data*.  Any ML-based approach depends on the data used to train them \[[Wolff2026](https://cacm.acm.org/research/large-language-models-in-software-security-analysis/)\]. For example, many programs have vulnerabilities, making it more difficult for an LLM to generate code without vulnerabilities.  
* *Injection vulnerability*. LLMs have no built-in fundamental way to distinguish between different types of input. A command from a user, a malicious command embedded in a web page, or a misleading source code comment are all simply inputs.

## Models {#models}

Modern AI systems’ capabilities depend on the models they use, so let’s focus on models.

### External vs. local models {#external-vs.-local-models}

All AI systems that use AI models receive data for processing and reply with results. There are two main locations where this AI data processing occurs:

* *External service*: The processing occurs as a service external to the user and to the user’s organization.  
* *Local/organizational service*: The processing occurs on the computer of the user or user’s organization.

Some powerful models can *only* be accessed as an external service. Many models have so many data parameters and require so much computation that most users and organizations simply wouldn’t have the ability to use it anyway. However, the user of an external service must trust the service provider (e.g., that their data will not be revealed or exploited, that the service won’t attack them, and that the service will continue to be available).

Before using any external service, evaluate that external organization, and put in place whatever contractual agreements are needed. In particular, ensure that sensitive data is not sent to them *or* ensure that their practices are appropriate for your circumstances. Many organizations use external services, and this is often a practical path.

Other AI models can be used locally or as part of an organization’s own service. These models are often less capable, but they don’t require a user to send their private data to an external service, and they can be less expensive as well.

Exactly what you can and can’t do with the model depends, in large part, on its license. That includes the ability to run a model locally at all. So, we must briefly discuss licenses.

### Licenses {#licenses}

There are different ways to license a model. The word “license” means “permission”; a license determines how you can (and can’t) use whatever is licensed. In particular, AI models are much easier to run on local or organizational systems if their licenses are more open.

The Generative AI Commons at the LF AI & Data Foundation has designed and developed the Model Openness Framework (MOF). This is “a comprehensive system for evaluating and classifying the completeness and openness of machine learning models” and is available at \<[https://isitopen.ai/](https://isitopen.ai/)\>. Models are released under various licenses including the Apache 2.0 license and OpenMDW \<[https://openmdw.ai/](https://openmdw.ai/)\>. Terms you’re especially likely to see, when discussing types of licenses are:

* *Open weights models*. Such models can be used and modified for any purpose, and must not discriminate against any user, industry, or purpose. However, their training set isn’t necessarily public, so these models can be hard for others to update. One detailed definition of “open weights” is defined by Heather Meeker’s “[Open Weights definition](https://github.com/Open-Weights/Definition/blob/main/Definition.md)”.  
* *Open source AI*. These have additional requirements beyond “open weights”, for example, that “sufficiently detailed information about the data used to train the system so that a skilled person can build a substantially equivalent system.” For more information, see the [OSI Open Source AI definition](https://opensource.org/ai/open-source-ai-definition).  
* *Open models*. These models meet at least the “open weights model” definition and possibly the “open source AI” definition.  
* *Closed models*. These are models that don’t meet the requirements of open models.

Some licenses are close to an open weight model, yet have some extra restrictions on use.

NVIDIA argues that “open models and open harnesses are essential because they democratize defensive capabilities, increase transparency for defenders, enable cyber defense while protecting data, and complement frontier closed models with customizable, localized controls… it will be crucial to recognize open models, harnesses and security tooling as defensive assets, not liabilities, in AI and cybersecurity policy. Blanket restrictions on open frontier AI systems would weaken defensive capacity and risk concentrating power, dependence and vulnerability in a few closed providers.” \[[NVIDIA2026](https://blogs.nvidia.com/blog/open-secure-ai-alliance/)\]

Comparing the specific capabilities of specific models, including models with differing license terms, is out of our scope and constantly changes anyway. However, \[[NPR2026](https://www.npr.org/2026/04/11/nx-s1-5778508/anthropic-project-glasswing-ai-cybersecurity-mythos-preview)\] reports that “The most advanced open-weight models are less than a year behind the most advanced closed-weight models.” Finding and fixing vulnerabilities can be done with *both* closed *and* open models.

### Specialized models {#specialized-models}

*All* models are better at some tasks than others. Models designed to be good at some tasks (e.g., by giving them extra data in that area or optimizing them for it) tend to be better at those tasks. In addition, some models are designed to *only* do primarily some specific tasks; this focus means they tend to be smaller and faster, in exchange for being only good primarily at those tasks.

For example, Cisco’s *Antares* is a family of security small language models (SLMs) specifically built to identify known vulnerabilities in an existing codebase. An SLM is simply the application of LLM to a much smaller number of parameters. Cisco reports that these models “outperform many powerful closed- and open-weight models in this critical security task at a fraction of the cost. And they’re compact enough to run locally” \[[Karbasi2026](https://blogs.cisco.com/ai/introducing-antares-the-most-efficient-open-weight-ai-models-for-vulnerability-localization)\].

### AI guardrails & intentional limitations {#ai-guardrails-&-intentional-limitations}

Many models and the larger systems for invoking them, especially many closed models, implement safety guardrails and other limitations intended to compel the AI system to not help with “dangerous” activities, including cybersecurity uses. Their *intent* is to restrict the use of that system to perform dangerous activities such as creating attacks.

Unfortunately, some such systems *can* be useless for defense. Hugging Face discovered in 2026 that it was under a powerful AI-driven attack, and when it tried to analyze its logs, it “first used frontier models behind commercial APIs. This did not work: the analysis required submitting large volumes of real attack commands, exploit payloads, and C2 artifacts, and these requests were blocked by the providers' safety guardrails, which cannot distinguish an incident responder from an attacker. We ran the forensic analysis instead on zai-org/GLM-5.2, an open-weight model, on our own infrastructure. This had a second benefit: no attacker data, and none of the credentials it referenced, left our environment” \[[HuggingFace2026](https://huggingface.co/blog/security-incident-july-2026)\].

In general, the best way to validate that a defect is a vulnerability is to create an attack and see if it succeeds. This is exactly what attackers do, however, and AI systems often cannot tell the difference.

Some external providers which implement guardrails can also provide access to models *without* such guardrails so that they can be used for defensive cybersecurity and other tasks. This typically requires special agreements on the permitted uses and limitations on who will be granted this access.

Another approach is to prevent direct access to the model, but instead apply operations and only provide the final results. For example, Anthropic prevents general end users from interacting directly with their best model without restriction; “instead they will work through purpose-built interfaces that run the model in the background and return only a defined output, such as a list of suggested patches, with abuse-prevention checks meant to keep the model within that scope.” \[[Kovacs2026-08-24](https://www.securityweek.com/anthropic-expands-mythos-5-access-to-more-defenders-unveils-35m-open-source-fund/)\] “Claude Security uses Mythos 5 to scan code you own, and returns detailed findings rather than raw outputs without exposing the model itself.. \[so\] defenders can access the capabilities… without the model becoming accessible to those who might misuse it.” \[[Anthropic2026-08-21](https://claude.com/blog/bringing-claude-mythos-5-to-more-defenders)\]

Before using any specific AI system, ensure that its limitations will not impede your task. You may need to request less-restricted access and/or specially-tailored access.

## Cyber Reasoning System (CRS) History {#cyber-reasoning-system-(crs)-history}

Any AI system that can work with code can be used to try to find and fix vulnerabilities. Some, however, are more autonomous than others.

A cyber reasoning system (CRS) is “a software system that can both detect and repair software vulnerabilities autonomously in a given system under test (SUT)” \[[Wolff2026](https://cacm.acm.org/research/large-language-models-in-software-security-analysis/)\].

In 2023 the US DARPA and ARPA-H began a two-year competition called the “Artificial Intelligence Cyber Challenge (AIxCC)” to build autonomous AI systems that find and fix software vulnerabilities (CRSs) in critical open-source infrastructure. At its beginning there was skepticism it could achieve much. When it awarded its $4 million grand prize in August 2025, there were no doubts. CRSs often vary *widely* in their architectural approach \[[Zhang2026](https://arxiv.org/abs/2602.07666)\].

Of course, fully-autonomous AI systems are *not* the only way to find vulnerabilities. It’s also possible for humans to provide more direction to AI, or for humans and AI to collaboratively work together throughout the process. Even the “fully autonomous” CRS systems, in practice, presume initial human direction and human review of the results.

In 1960 “Lick” Licklider asserted that humans and machines would work together, where “computing machines will do the routinizable work” \[[Licklider1960](https://groups.csail.mit.edu/medg/people/psz/Licklider.html)\]. It can be argued that today’s AI can indeed be used this way.

## AI organizations, projects, and services {#ai-organizations,-projects,-and-services}

There is massive investment in AI, so it’s impossible to list all important organizations, projects, and services. That said, here are a few you should be aware of, including pointers to some related open source software projects.

AI “frontier labs” drive foundational research by massively investing in designing and training the best AI models (called “frontier models”). There are many frontier and near-frontier labs. Key US players include Anthropic (Claude/Claude Code), OpenAI (GPT/ChatGPT), Google DeepMind (Gemini), and Meta AI (Llama). Microsoft partners with OpenAI, but it also conducts its own independent research and maintains strategic partnerships across the industry. Note that Microsoft Copilot isn't one product, but a name for many different Microsoft tools that use AI. Key Chinese players include Moonshot AI (Kimi K3), Alibaba (Qwen), DeepSeek (DeepSeek), and Zhipu AI aka Z.ai (GLM).

Goose is a general-purpose AI agent that runs on your machine. It is open source software and maintained by the Linux Foundation’s Agentic AI Foundation (AAIF). When using Goose can select an “LLM provider” which can be local or remote, open source or closed source. For more information see: \<[https://goose-docs.ai/](https://goose-docs.ai/)\>. Pi is another agent harness that supports many models. Pi focuses on being minimal and was originally created to develop code, though it can be used for other purposes \<[https://pi.dev/](https://pi.dev/)\>.

The OWASP “GenAI Security Project” at \<[https://genai.owasp.org/](https://genai.owasp.org/)\> has a variety of materials available on AI and security. This includes its OWASP GenAI LLM Top 10, the “most critical security risks facing applications powered by large language models (LLMs)”.

The OpenSSF AI/ML Security Working Group has a variety of projects, including work on signing AI models. It is also the co-sponsor of this material. For more information see \<[https://openssf.org/groups/ai-ml-security/](https://openssf.org/groups/ai-ml-security/)\>.

# Decide on Approaches {#decide-on-approaches}

There are many ways to use AI to find and fix vulnerabilities, so the first step is to decide on the overall approach.

## Do not ignore AI {#do-not-ignore-ai}

Some organizations and projects want to simply ignore AI, or refuse to use it, or refuse to accept any contributions where AI was used. If the goal of the project is to solely demonstrate what humans can do without AI, that’s fine.

However, if the goal of the project is to be used by humans to solve a real-world problem, refusing AI use is an *extremely harmful* position to take. As Michael Catanzaro notes, “banning good vulnerability reports solely because some portion of the report was generated by AI is unacceptable. AI-assisted vulnerability reports are the new industry standard… Prohibiting issue reports reduces the quality and safety of your software, punishing your users.” \[[Catanzaro2026](https://blogs.gnome.org/mcatanzaro/2026/06/08/please-do-not-ban-ai-assisted-issue-reports/)\] 

The CSA goes even further, recommending that organizations *require* AI agent adoption by their employees: “Formalize AI agent usage (mostly in the form of coding agents") as part of all security functions, with mandatory security controls and oversight in place. While defensive AI technology has not yet caught up, these agents empower staff to be effective in the new threat landscape, allowing acceleration beyond "human speed." Optional adoption programs have not been shown to overcome cultural barriers, while adoption is a limiting factor in achieving the rest of the actions in this table.” \[[CSA2026](https://labs.cloudsecurityalliance.org/mythos-ciso/)\] Note that this doesn’t mean that all code must be AI generated or anything like that. But trying to withstand AI-enabled attackers, while refusing to use AI yourself, can only end one way: compromise.

Attackers *do not care* if you don’t like AI. In fact, attackers prefer developers who won’t use AI. Attackers are already using AI to create multi-step complex attacks that reliably defeat software systems not prepared for such attacks. The more defenders who won’t use AI, the more systems that can be subverted and the more people who will be harmed.

Do not bring a knife to a gunfight.

## Do not wait for access to best AI models {#do-not-wait-for-access-to-best-ai-models}

Most importantly, do **not** wait until you get access to the most advanced restricted-access AI models that exist:

1. *Get started now*. Projects typically find many vulnerabilities when they use any reasonably-good widely-available AI systems unless they’ve *already* been using them \[[Carlini2026](https://red.anthropic.com/2026/mythos-preview/)\]  \[[CSA2026](https://labs.cloudsecurityalliance.org/mythos-ciso/)\] \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\] \[[Stenberg2026-05a](https://daniel.haxx.se/blog/2026/05/11/mythos-finds-a-curl-vulnerability/)\]. AI systems now “find lots of new problems no one detected before.” \[Stenberg2026-05b\]  
2. *Non-frontier, open-weight models can find many vulnerabilities at an accessible cost*.  
   1. “Frontier models… are the acceleration, not the starting gun. Each patch also becomes an exploit blueprint, as AI accelerates patch-diffing and reverse engineering of fixes” \[[CSA2026](https://labs.cloudsecurityalliance.org/mythos-ciso/)\].  
   2. “Focusing on Mythos is a distraction \- there are plenty of good models, and people who can figure out how to get those models and tools to find things.” \[Stenberg2026-05b\]  
   3. Don’t wait for difficult-to-access and often expensive tools for problems that could have been found and fixed more easily. By all means, eventually use advanced tools if you have access to them, but do not *wait* for them.  
3. *Act quickly*. “Success comes from getting the basics right, acting quickly, and integrating cyber security into core business strategy” and not from “having the most tools” \[[FiveEyes2026](https://www.cyber.gov.au/sites/default/files/2026-06/Five%20eyes%20cyber%20security%20agencies%20statement.pdf)\].  
4. *Don’t ignore AI*. Defenders who ignore AI are at a fundamental speed disadvantage. “Defenders… that do not adopt AI coding agents cannot match the speed or scale of AI-augmented threats, regardless of their technical skill.” \[[CSA2026](https://labs.cloudsecurityalliance.org/mythos-ciso/)\] “Not using AI code analyzers in your project means that you leave adversaries and attackers time and opportunity to find and exploit the flaws you don’t find.” \[[Stenberg2026-05a](https://daniel.haxx.se/blog/2026/05/11/mythos-finds-a-curl-vulnerability/)\]   
5. *Learn by doing*. It takes time to learn and adopt these tools. Practice is the only way to get better. “The best way to be ready for the future is to make the best use of the present, even when the results aren't perfect.” \[[Carlini2026](https://red.anthropic.com/2026/mythos-preview/)\]

Different AI models and harnesses have different strengths and weaknesses. In practice, you’ll often want to eventually use multiple ones. The most advanced frontier model “needs to be mounted in the right harness and equipped with the right tools to reach its full potential. And even then, it should just be one of the arrows in your quiver – depending on the task, it may be more sensible to let another model try several times than to let Mythos Preview try once… XBOW maintains a cadre of models, rather than restricting itself to a single one.” \[[Ziegler2026](https://xbow.com/blog/mythos-offensive-security-xbow-evaluation)\]

## Do simple things first {#do-simple-things-first}

If you’ve never used an AI to look for vulnerabilities, and you have access to a reasonably-good AI model (open-weight or not), consider starting with a relatively simple command to look for vulnerabilities. Include hints on specifically where to look and/or note tools that might help it (without mandating that it use them).

AI systems, as of 2026, can figure out plausible approaches themselves even when given relatively little guidance. Models are improving exponentially, so they’re expected to rapidly get better even when given little help.

For example, \[[Carlini2026-youtube](https://www.youtube.com/watch?v=1sd26pWhfmg&t=316s)\] demonstrated this as a successful prompt:

\> You are playing in a capture-the-flag (CTF). Find a vulnerability. hint: Look at /src/baz.c Write the most serious one to /out/report.txt

\[[Carlini2026](https://red.anthropic.com/2026/mythos-preview/)\] summarizes this as a paragraph that essentially amounts to **“**Please find a security vulnerability in this program**”** and let the AI experiment. He notes that in a typical attempt, the AI (Claude) will read the code to hypothesize vulnerabilities that might exist, run the actual project to confirm or reject its suspicions (and repeat as necessary, adding debug logic or using debuggers as it sees fit), and finally output either that no bug exists, or the bug(s) it found.

Such simple prompts can be extended in several obvious ways. For example, many emphasize focusing on improving input validation (since if malicious inputs can’t *enter* the program they’re much less likely to do harm) and common past problems. Another is to clearly note that the AI may use existing various tools to help in the analysis, including pointers to tools the AI might find useful.

Part of the reason that AI systems can do so much better now is that they’ve become far more adept at making longer-range plans and using tools. \[[Carlini2026-02](https://red.anthropic.com/2026/zero-days/)\] describes it this way:

* “Opus 4.6 found high-severity vulnerabilities, some that had gone undetected for decades…  
* we put Claude inside a “virtual machine” (literally, a simulated computer) with access to the latest versions of open source projects. We gave it standard utilities (e.g., the standard coreutils or Python) and vulnerability analysis tools (e.g., debuggers or fuzzers), but we didn’t provide any special instructions on how to use these tools, nor did we provide a custom harness that would have given it specialized knowledge about how to better find vulnerabilities.  
* This means we were directly testing Claude’s “out-of-the-box” capabilities, relying solely on the fact that modern large language models are generally-capable agents that can already reason about how to best make use of the tools available.  
* … we validated every bug extensively before reporting it. …  we then had Claude critique, de-duplicate, and re-prioritize the crashes that remain.”

Similarly, \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\] noted that, “you can start with very simple prompting, then observe and iterate…  the essence of the inner loop remains the same: there is a bug in this part of the code, please find it and build a testcase”

## AI more effective if guided by process {#ai-more-effective-if-guided-by-process}

You *can* find and fix some vulnerabilities with simple prompts, as noted above. However, if your goal is thoroughness, most report that guiding an AI makes the AI more effective at finding and fixing vulnerabilities.

For example, \[[Wolff2026](https://cacm.acm.org/research/large-language-models-in-software-security-analysis/)\] states that “simply asking a generic coding agent to "find bugs" in a large repository results in model drift, context window compaction, and high false-positive rates... The highest-performing defensive systems combine raw AI reasoning with rigid engineering frameworks (harnesses) that handle file selection, environment setup, and tool execution.”

Similarly, \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\] noted that, “you can start with very simple prompting…” but *also* noted that, “through iteration we’ve built out a lot of orchestration and tooling to optimize and scale the pipeline.” \[[Carlini2026](https://red.anthropic.com/2026/mythos-preview/)\] found that asking “each agent to focus on a different file in the project” was more effective, since this “reduces the likelihood that we will find the same bug hundreds of times”. Instead of processing literally every file for each software project, they first asked Claude to rank how likely each file in the project is to have interesting bugs and prioritized the files that were most likely.

Derek ZImmer \[Zimmer2026\] believes that one reason for this is that it’s easy for an AI to “run things out-of-order”. AI may try to anticipate the next step, and what it guesses may be wrong. Having an AI agent do a specific task, using previous data created independently, enables it to focus its attention and effort specifically on that task.

\[[Bourzikas2026](https://blog.cloudflare.com/cyber-frontier-models/)\] reported 4 lessons, each pointing to the value of a harness to manage the overall execution:

* *Narrow scope produces better findings*. Telling the model "Find vulnerabilities in this repository" makes it wander. Telling it "Look for command injection in this specific function, with this trust boundary above it, here's the architecture document and here's prior coverage of this area" makes it do something much closer to what a researcher would actually do.  
* *Adversarial review reduces noise*. Adding a second agent between the initial finding and the queue \- one with a different prompt, a different model, and no ability to generate its own findings \- catches a lot of the noise that the first agent would miss if it just checked its own work. It turns out that putting two agents in deliberate disagreement is way more effective than just telling one agent to be careful.  
* *Splitting the chain across agents produces better reasoning*. Asking "Is this code buggy?" and "Can an attacker actually reach this bug from outside the system?" are two different questions, and the model is better at each one when you ask them separately, because each question is narrower than the combined version.  
* *Parallel narrow tasks beat one exhaustive agent*. Coverage improves when many agents work on tightly scoped questions and we deduplicate the results afterward, rather than asking one agent to be exhaustive.”

At the time of writing, exactly *how* to best guide AI is under evaluation. Different groups use different approaches, and it’s likely that different approaches are better suited for different vulnerabilities. We’ll further discuss approaches later, but as an example, here’s the approach described by \[[Bourzikas2026](https://blog.cloudflare.com/cyber-frontier-models/)\]:

* *Recon*: An agent reads the repository from the top down, fans out to subagents responsible for each subsystem, and produces an architecture document covering build commands, trust boundaries, entry points, and likely attack surface. It also generates the initial queue of tasks for the next stage. Gives every downstream agent shared context. Cuts the wander problem.  
* *Hunt*: Each task is one attack class paired with a scope hint. Hunters (the agents that actually look for bugs) run concurrently, typically around fifty at once, each fanning out to a handful of exploration subagents. Each hunter has access to tools that compile and run proof-of-concept code in a per-task scratch directory.	This is where most of the work happens. Many narrow tasks in parallel, not one exhaustive agent.  
* *Validate*: An independent agent re-reads the code and tries to disprove the original finding. It uses a different prompt and has no ability to emit new findings of its own.	Catches a meaningful fraction of the noise the hunter wouldn't catch when reviewing its own work.  
* *Gapfill*: Hunters flag areas they touched but didn't cover thoroughly. Those areas get re-queued for another pass.	Counteracts the model's tendency to drift toward attack classes it has already had success with.  
* *Dedupe*: Findings that share the same root cause collapse into a single record.	Variant analysis is a feature, not a way to inflate the queue with duplicates.  
* *Trace*: For each confirmed finding in a shared library, a tracer agent fans out (one instance per consumer repository), uses a cross-repo symbol index, and decides whether attacker-controlled input actually reaches the bug from outside the system.	Turns "there is a flaw" into "there is a reachable vulnerability." This is the stage that matters most.  
* *Feedback*: Reachable traces become new hunt tasks in the consumer repositories where the bug is actually exposed.	Closes the loop. The pipeline gets better as it runs.  
* *Report*: An agent writes a structured report against a predefined schema, fixes any validation errors against that schema itself, and submits the report to an ingest API.	Output is queryable data, not free-form prose.

As we’ll further discuss later, a key task is validation. Something may look like a vulnerability but be unexploitable. The best way to validate a vulnerability is to generate an exploit that demonstrates that a finding really is a vulnerability. A working exploit demonstrates that existing defenses wouldn’t prevent the attack \[[Carlini2026](https://red.anthropic.com/2026/mythos-preview/)\]. This also explains why hardening is so important; if a project hardens their software against attack, they can systematically prevent many problems from becoming vulnerabilities. The Linux kernel, for example, has various defense in depth measures that prevented exploitation of many potential problems found by even advanced AI models \[[Carlini2026](https://red.anthropic.com/2026/mythos-preview/)\].

In 2026 AI became *far* more effective at finding vulnerabilities. This was due to a combination of *both* better AI models *and* better techniques for harnessing these models \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\] . Using either one is better than using none, but most report it’s best to combine them both.

There are risks that overprescribing an approach to an AI may overconstrain it, and cause it to ignore problems it would have otherwise found. It’s also possible that future improved AI models will be so good that aiding them with processes won’t help them. However, since most report that aiding AI models does help, we’ll discuss doing that combination in this course.

## Processes for using AI to find and fix vulnerabilities {#processes-for-using-ai-to-find-and-fix-vulnerabilities}

More powerful AI models *can* find and fix some vulnerabilities without any additional help or any specialized processes for the task. However, adding specialized processes is known to make less-powerful AI models (including less-expensive ones) be far more effective. We can’t be certain of the future, but many expect that adding specialized processes will continue to also assist more powerful AI models \[Zimmer2026\].

These added processes for finding and fixing vulnerabilities can be human-guided, automation-guided, or a mix:

* *Human-guided processes*. These can be as simple as carefully walking an AI through a step-by-step process. For example, a human could demand that the AI focus on reporting all potential vulnerabilities as findings, completely separating validation of findings as a separate step. Doing this can reduce the risk of an AI model discounting a finding that *was* exploitable because the AI was doing both steps at once.  
* *Fully-automation-guided systems.* Such systems for this purpose are sometimes called “Cyber Reasoning Systems” (CRSs). As noted earlier, “A cyber reasoning system (CRS) is a software system that can both detect and repair software vulnerabilities autonomously in a given system under test (SUT).” \[[Wolff2026](https://cacm.acm.org/research/large-language-models-in-software-security-analysis/)\]   
* *Mixed systems*. Systems may be partly automated but have mechanisms for humans to provide information and guidance as they go.

Unsurprisingly, many different organizations and projects have developed processes to improve finding and fixing vulnerabilities using AI. As noted by Cycode, “AI-driven vulnerability discovery is no longer a single-vendor story. It is an industry capability, and it has arrived faster than most security programs are prepared for.” \[[Cycode2026](https://cycode.com/blog/claude-mythos-security-readiness/)\]

Here are a few examples of processes people have used (beyond the list from \[[Bourzikas2026](https://blog.cloudflare.com/cyber-frontier-models/)\] we showed earlier):

* Anthropic reports that teams finding and fixing the most vulnerabilities ended up with some variation of the following steps:  
  * “Threat model: Decide what counts as a vulnerability before you start scanning.  
  * Sandbox: Build a sandbox environment to isolate agents and prove exploits.  
  * Discovery: Have models look for vulnerabilities in your source code.  
  * Verification: Independently confirm which findings are actually exploitable.  
  * Triage: Deduplicate findings, assign severity, and prioritize what needs fixing.  
  * Patching: Apply the fix, confirm the vulnerability is nullified, and search for variants.” \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\]   
* \[Wolf2026\] emphasizes that AI can be most effective when it’s combined with existing analysis techniques. This paper describes the following components of a typical CRS:  
  * Static analysis, harness generation (for dynamic analysis), input generation, crash analysis, patch generation, patch selection, and orchestration.  
* Microsoft’s MDASH system uses a set of specialized AI agents working through a specialized staged pipeline, instead of a single really good model running in an agent framework. \[Bishop2026\]. Their harness orchestrates more than 100 specialized AI agents across an ensemble. It’s essentially a “structured pipeline that takes a code base and emits validated, proven findings” through these stages:  
  * Prepare stage: Ingests the source target, builds language-aware indices, and then draws the attack surface and threat models by analyzing the past commits.   
  * Scan stage: Runs specialized auditor agents over candidate code paths, emitting candidate findings with hypotheses and evidence.   
  * Validate stage:  Runs a second cohort of agents—debaters—that argue for and against each finding’s reachability and exploitability.   
  * Dedupe stage: Collapses semantically equivalent findings (for example, patch-based grouping).  
  * Prove stage: Constructs and executes triggering inputs where the bug class admits it. The prove stage validates the pre-condition dynamically and formulates the bug-triggering inputs to prove existence of vulnerability (for example, ASan in C/C++).” \[Kim2026\]

Most of these systems can be used with three types of scanning actions:

* Full Scans, where the full codebase is scanned all at once,  
* Branch Scans, where a new branch (or each new branch) is scanned  
* Pull Request (PR)/Merge Request (MR) Scans, like Branch Scans but findings are reported in the PR/MR which concern the branch (similar to how many humans perform review) \[[Rogers2025](https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters)\]

Cycode noted that independent research from AISLE has already shown that even small open-source models (including a 3.6-billion-parameter model with the right scaffolding) can find many of the same flagship vulnerabilities Mythos showcased. “Vulnerability discovery is commoditizing. The bottleneck is no longer finding bugs. It is deciding which ones to fix first, fast enough to matter.” \[[Cycode2026](https://cycode.com/blog/claude-mythos-security-readiness/)\]

### Challenges of finding and evaluating tools {#challenges-of-finding-and-evaluating-tools}

Interestingly, it can be a challenge to *find* the tools and services for finding vulnerabilities with AI. There are so many blog posts, papers, and products that have *something* to do with AI and vulnerabilities that it can be difficult to find actual products, services, or systems to find vulnerabilities in software \[[Bressers2025](https://opensourcesecurity.io/2025/2025-10-ai-joshua-rogers/)\] \[[Rogers2025](https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters)\].

We provide a few examples of tools and services in this material, to help you as a starting point. However, they are *not* complete, they are simply a starting point.

### Sample services and tools {#sample-services-and-tools}

You can use any existing AI system that can work with code to do this. You might consider using [Goose](https://goose-docs.ai/) to interact with your AI models. However, let’s focus on tools and services specifically for finding and fixing vulnerabilities using AI.

Many organizations with more traditional tools have added modern AI to their products. By “traditional tools” we include Static Application Security Testing (SAST) tools, Dynamic Application Security Testing (DAST) and/or fuzzing tools, and Software Composition Analysis (SCA) tools. Examples of such organizations include Black Duck, Checkmarx, OpenText (Fortify), Snyk, SonarQube, Sonatype, and VeraCode.

Commercial closed-source services that were created to focus on using AI to find and fix vulnerabilities, at the time of this writing, include [Almanax](https://almanax.ai/), [Corgea](https://corgea.com/), [Cycode](https://cycode.com), and [ZeroPath](https://zeropath.com).

Open Source tools that focus on using AI to find and/or fix vulnerabilities, at the time of this writing, include:

1. Ali Baba open-code-review \<[https://github.com/alibaba/open-code-review](https://github.com/alibaba/open-code-review)\> \[AliBaba2026\]  
2. Nullpointer. This focuses on AI-powered pentesting \<[https://nullpointer.studio/](https://nullpointer.studio/)\>  
3. OpenSSF Alpha-Omega Scrutineer, a set of skills for finding and fixing vulnerabilities, then reporting them to the external project \<[https://github.com/alpha-omega-security/scrutineer](https://github.com/alpha-omega-security/scrutineer)\>  
4. OpenSSF OSS-CRS. This is a meta-tool for creating CRSs, and several CRSs build on it, based on extensive work for AIxCC \<[https://openssf.org/projects/oss-crs/](https://openssf.org/projects/oss-crs/)\>  
5. Sashiko. This is a patch review system specifically for the Linux kernel \<[https://sashiko.dev/](https://sashiko.dev/)\>  
6. Visa Vulnerability Agentic Harness \<[https://github.com/visa/visa-vulnerability-agentic-harness](https://github.com/visa/visa-vulnerability-agentic-harness)\>

With that in mind, let’s focus on OpenSSF Alpha-Omega’s Scrutineer and OpenSSF OSS-CRS.

### Scrutineer {#scrutineer}

Scrutineer is a tool developed by OpenSSF’s Alpha-Omega. It’s a “local tool for scanning open source repositories for security vulnerabilities and managing the disclosure process. You add a repo by URL, scrutineer runs a pipeline of agent skills against it inside a container, and presents the results in a web UI where you can triage findings, identify maintainers, and track disclosures. The agent CLI is pluggable…”

Scrutineer is intended to be relatively easy to start. Some aspects of it are especially important:

* It includes processes such as identifying how to report vulnerabilities to an external project. You can use it to review your own projects as well, but its focus is on examining other projects “as they are” and reporting to them.  
* It’s primarily a set of skills (documents with some supporting programs).

For more information, see \[[Nesbitt2026-06](https://nesbitt.io/2026/06/25/scrutineer.html)\] or its website at \<[https://github.com/alpha-omega-security/scrutineer](https://github.com/alpha-omega-security/scrutineer)\>.

### OSS-CRS {#oss-crs}

OpenSSF’s OSS-CRS provides a sophisticated set of capabilities to deeply find and fix vulnerabilities using a variety of techniques. OSS-CRS is actually a *framework* for running many *different* CRSs and combining their techniques. It includes infrastructure that CRSs can share and budget-aware resource management. OSS-CRS is especially helpful when you want to spend significant effort to find and fix vulnerabilities, to squeeze out as many as practical.

It’s easier to understand OSS-CRS by understanding its history. DARPA's AI Cyber Challenge (AIxCC) “showed that cyber reasoning systems (CRSs) can go beyond vulnerability discovery to autonomously confirm and patch bugs \[yet those systems were\] largely unusable outside their original teams, each bound to the competition cloud infrastructure that no longer exists” \[Chin2026\] \[Chin2026-slides\].

The solution was OSS-CRS, which created a framework for running CRSs and combining the results of multiple CRSs. With OSS-CRS, users can decide:

*  Which CRSs to run  
*  How much compute resources/time to give to each CRS  
*  How much LLM budget to give to each CRS  
*  Which models and endpoints to route LLM requests to  
*  What project (and harness) to run the CRSs against  
*  Which vulnerability to fix (for patching CRSs) \[Chin2026-slides\]

OSS-CRS is more effective if the project being analyzed has a harness using the OSS-Fuzz format. Many different build systems are in use for building software (such as Make, CMake, Autoconf, Bazel, and Meson). This can make it challenging to create tools to correctly analyze them. “OSS-CRS mitigates this by building targets through OSS-Fuzz’s official build flows, inheriting the build environment that each project’s maintainers already support.” \[Chin2026\]  If a project doesn’t have this, consider using AI to help build an OSS-Fuzz harness for it. Ensuring OSS-CRS can build and fuzz a program often improves OSS-CRS results.

An especially powerful ability of OSS-CRS is its “ensemble” feature. The ensemble feature combines “patches from multiple CRS approaches and using a selection process to pick the one most likely to be correct. The research showed this approach consistently matches or outperforms the best single component in improving semantic correctness, which is hard to eliminate at the single-agent level.” Even so, it’s *still* important to have humans review the proposed changes before implementing them \[[Diecks2026](https://openssf.org/blog/2026/04/02/from-aixcc-to-openssf-welcoming-oss-crs-to-advance-ai-driven-open-source-security/)\].

OSS-CRS is already capable. “Using OSS-CRS, Team Atlanta discovered twenty-five vulnerabilities across sixteen projects spanning a broad range of software including PHP, U-Boot, memcached, and Apache Ignite 3”  \[[Diecks2026](https://openssf.org/blog/2026/04/02/from-aixcc-to-openssf-welcoming-oss-crs-to-advance-ai-driven-open-source-security/)\].

You can choose to use the many CRSs that are already available and ported to use on top of OSS-CRS. You can also create your own CRS (see \[crs-bug-finding-template\] for more), but that’s outside our scope. While it can require more resources and startup time, its benefit is the ability to combine so many different CRSs to analyze and fix a project.

For more information on OSS-CRS, see: [https://openssf.org/projects/oss-crs/](https://openssf.org/projects/oss-crs/)

## Do multiple times due to non-determinism and long tail {#do-multiple-times-due-to-non-determinism-and-long-tail}

Most modern AI systems are *not* deterministic. Even if you provide them the same inputs, they won’t necessarily produce the same outputs.

As a result, “the first run on a codebase typically has the highest number of findings. Subsequent runs tend to have fewer—though often more complex—vulnerabilities, as the simpler ones were patched in prior runs. However, don’t expect the nth run to have zero new findings. Models are stochastic, and a large codebase can have a long tail of vulnerabilities that continue to trickle in even when the code is unchanged.” \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\]

As a result, once you’ve gone through a process of finding and fixing vulnerabilities, you’ll need to repeat the process several times until it reliably fails to report useful results with multiple approaches and systems.

One question is whether or not you should provide past findings as context, so that it is more likely to look at different areas. Research on this is limited. For now, we suggest that you *do* provide past results on *some* runs, so that on those runs it doesn’t need to re-discover past results. There is a risk that incorrect past results may lead the AI astray, so we expect it’s better to provide that data in only some cases. We hope future research will make this clearer.

# Prepare to find and fix vulnerabilities {#prepare-to-find-and-fix-vulnerabilities}

AI is far more effective at finding and fixing vulnerabilities if you prepare for it. \[[Aniszczyk2026](https://openssf.org/resources/securing-open-source-in-the-age-of-ai-a-practical-guide/)\] expresses this: “The single most important thing to understand about working with AI tools… is helping the robot help you by providing the proper context to execute tasks… just like people, giving the robot access to specific, focused data makes it better and less prone to error.”

In this chapter we’ll focus on the key preparatory tasks that make using AI to find and fix vulnerabilities far more effective. This means preparing the AI, the system context/threat model/trust boundaries, code & documentation, the sandbox environment, CI/CD, and dependency updates.

## Preparing AI {#preparing-ai}

We list “preparing AI” because you’ll probably want to use AI to help do the other preparation steps. This means selecting the AI tools, including possibly their models, harnesses, and so on. There’s no requirement that you choose a *single* system to do this. In fact, different systems have different strengths and costs. What’s more, there’s no general guarantee that an AI system will find all vulnerabilities, so using multiple systems over the long term has its advantages.

Different AI systems have differences in expense as measured by money and time. For example, older models and smaller models (including SLMs) are often less capable but can also be less expensive. In *practice*, it may be helpful to choose less-expensive and faster AI systems *first* to implement finding and fixing vulnerabilities, focusing on vulnerabilities that are simpler to find and simpler to fix. Taking this approach means that vulnerabilities that are easily found, fixed, verified, and deployed are quickly found by less-expensive models. Once those vulnerabilities are addressed, more-capable AI systems can be focused on the vulnerabilities that are best addressed by them.

In many AI systems output tokens cost significantly more than input tokens. Taking steps to eliminate *unnecessary* output can reduce costs as well as time. You can sometimes do this by asking for concise results, using strict formatting requirements like JSON schemas or bullet points, or defining a hard ceiling in API calls. However, the challenge is to avoid *unnecessary* output; you’ll need enough output to have results and verify the work.

As noted earlier, a key decision is whether or not to use an *external* (remote) system, because that means the external system will receive the data to be processed. As \[[Kholoosi](https://arxiv.org/abs/2512.18261v2)\] notes, “due to internal policies, LLMs hosted on \[external servers sometimes\] cannot be used”.

You will generally want to ensure that you can record memories of preferences, system information, and so on. For example, when using a remote system, get an account. AI gets better over time if it can record preferences over time.

We’ll need to control the AI, including putting it in a sandbox. However, how to do that well can depend on the system being examined, so we’ll discuss that in more detail once we discuss the system being examined.

## Preparing the threat model {#preparing-the-threat-model}

Neither humans nor AI can determine if something is a vulnerability if there’s no clear definition of a vulnerability. ““AI (and external contributors) are more successful if the project shares how they desire the software to be used, acceptable scenarios to be deployed into, and what problems the project is aware of that could go wrong” \[[Aniszczyk2026](https://openssf.org/resources/securing-open-source-in-the-age-of-ai-a-practical-guide/)\].

A common way to answer this question is to develop a “threat model”. Adam Shostack suggests the four core questions a threat model should answer: what are we working on, what can go wrong, what are we going to do about it, and did we do a good job \[Shostack2014\]. If you’re not familiar with threat modeling, there are many sources for learning more. Here we’ll focus on AI-specific issues.

Threat models are *important* when using AI:

* One report reported that an AI model “performed best on systems with well-documented threat models, system design docs, requirements, and constraints. When the threat model was well-defined, the model's findings were exploitable 90 percent of the time.” In addition, “The most common cause of false positives is that the model lacks a good understanding of \[the\] trust boundaries.” \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\].  
* A use of Mythos Preview reported that it was valuable but it “needs precise prompts, explicit threat models, and validation infrastructure to turn strong reasoning into reliable security outcomes” \[[Ziegler2026](https://xbow.com/blog/mythos-offensive-security-xbow-evaluation)\].  
* If the AI is not given enough information on the specific context and structure of your system’s environment, its recommendations may fail to align with requirements including regulatory requirements \[Khloosi\].

If you don’t already have a threat model for your system, the good news is that an AI can *help* you create one. The bad news is that you need to interact with the AI, then review and refine its results, not simply take the AI-generated threat models as truth. \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\] suggests that when creating a threat model with AI, “bootstrap from the code, docs, and vulnerability history. Feed the model what you would hand a new security engineer on day one: architecture docs, wikis, entry points, git history, and past vulnerabilities. This helps overcome the challenge of inferring implicit knowledge, trade-offs, and design decisions from code alone. Then, ask the model to create a threat model that includes the system context, assets, entry points, and trust boundaries. Finally, have the model cluster past bugs and list the relevant vulnerability classes. Make sure the threat model documents what vulnerabilities you do and don’t care about, and why.”

There are various tools that use AI to help you create a threat model. These include:

* OpenSSF Alpha-Omea’s “Threat Model Generator”, a set of agent skills , available at: \<[https://github.com/alpha-omega-security/threat-model/](https://github.com/alpha-omega-security/threat-model/)\>  
* Matt Adams’s “StrideGPT” at \<[https://stridegpt.streamlit.app](https://stridegpt.streamlit.app)\>

When creating or updating a threat model for a world with AI, consider the following:

1. Design for prevention and containment. If an attacker takes over one system, try to put in place prevention mechanisms to limit lateral movement \[Crowdstrike2026-FiveSteps\]  
2. Strongly limit privileges  
3. Strongly control identity of all entities (human and non-human). Consider using continuous identification \[Crowdstrike2026-FiveSteps\]  
4. Use layered defenses, so attackers must surmount multiple mechanisms to gain top privileges \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\]  
5. Look at past vulnerabilities to look for patterns that could prevent success by whole categories of attacks \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\].  
6. Specifically identify what is trusted (admins, specific config files, and so on).  “These assumptions help separate non-exploitable bugs from actual exploits.” \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\]  
7. Include the threat model in the code (e.g., as THREAT\_MODEL.md) \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\].  
8. Implement resiliency and rapid recovery \[Crowdstrike2026-FiveSteps\]

Some people refer to the need for “system context” and/or “trust boundaries”. For our purposes, this is part of the threat model. For an AI to find vulnerabilities, it needs to know what a vulnerability is, including the system context and trust boundaries, and all of that is wrapped into the threat model.

## Preparing sandbox {#preparing-sandbox}

A key task when using an AI agent, *especially* when using AI to find and fix vulnerabilities, is place the agents within a “sandbox” environment to isolate it from other systems.  “Without it, the agent may overshoot the target and do something unexpected.” \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\] You need to take steps to protect:

* *Infrastructure running the AI agents*. These include the underlying operating systems  
* *Systems external to the AI agents*. These may include an organization’s internal systems as well as systems run by other people and organizations.

The problem isn’t usually “evil” AI. The problem is that AIs are highly goal-driven. AI systems often interpret human commands in surprising ways, and may attempt to break out of their sandbox (and succeed) if they believe that’s the best way to proceed \[[OpenAI2026-07](https://openai.com/index/hugging-face-model-evaluation-security-incident/)\].

Sandboxes for AI systems can be implemented by virtual machines (VMs) including microVMs, containers, and by applications designed to constrain AI systems such as nono \<[https://github.com/nolabs-ai/nono](https://github.com/nolabs-ai/nono)\>. In addition, many AI harnesses and agent interaction systems (such as Goose and Claude Code) include a sandbox of some kind.

You need to match the AI sandbox isolation to your threat model. Containers by themselves are relatively weak, but are often fine for the discovery agent simply reading code. However, if you’re doing something more active than reading and summarizing code, you’ll want stronger protections in place. That’s *especially* true if you’re having an AI system validate a vulnerability finding by having it attempt to develop proof of vulnerability (PoV). A PoV involves creating and demonstrating working attacks against a system, and is a powerful way to validate potential vulnerability findings. However, you don’t want the AI to attack either your production systems or others’ systems that the AI thinks might have useful information. Typically you’ll want to isolate them with at least a VM, and even VMs with large attack surfaces can sometimes be broken in to; microVMs with small attack surfaces designed for security are expected to be even stronger against attack \[[Dinaburg2026](https://blog.trailofbits.com/2026/08/26/vms-wont-contain-cyber-capable-agents/)\]. 

The need to sandbox is ***not*** hypothetical:

* In 2026 Hugging Face was attacked by an advanced AI model \[[HuggingFace2026](https://huggingface.co/blog/security-incident-july-2026)\] which was eventually determined to be an accidental attack by an OpenAI model \[[Walsh2026](https://www.cbsnews.com/news/hugging-face-hack-openai-rogue-model/)\].  
* Anthropic found that its AI models “hacked into the systems of three organisations on their own, during a private security experiment.” \[[Chia2026](https://www.bbc.com/news/articles/cz7dl7w8y7po)\]  
* Meta’s AI attacked another company during its testing \[[Pardesi2026-08-05](https://www.reuters.com/technology/metas-ai-model-hacked-another-company-during-testing-information-reports-2026-08-05/)\]  
* Moonshot's AI model, ‌Kimi K3, escaped a cybersecurity testing environment developed by the UK AI Safety Institute \[[Reuters2026-08-07](https://www.reuters.com/legal/litigation/chinese-startup-moonshots-ai-model-breaks-out-testing-environment-researchers-2026-08-07/)\] 

When you need a stronger sandbox, such as when creating attacks, “place \[AIs\] in a microVM (like Firecracker) or a full VM with egress locked down so nothing can reach your production systems.” Do not have (\~/.aws, \~/.ssh, .env) available to the agent \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\]. Put everything in a subdirectory of the VM, not a home directory, so if something leaks to a home directory it’s less likely to be visible to the AI system. Considering layering on other isolation mechanisms as well to reduce the likelihood of escape.

While an AI *can* determine many things by itself by having it directly review code, AI is *far* more effective if it’s given tools that it may find useful \[[Zhang2024](https://arxiv.org/abs/2404.05427)\]. This can include code search, fuzzers, static analyzers, and many other tools. For maximum effectiveness AI agents need to be able to create code, compile code, run tests, and detonate a proof of vulnerability. They need a test bed that is representative of the real system \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\]. In short, just like humans, AIs can do more if they have access to useful tools. This means these tools need to be available from *within* the sandbox.

When building your sandbox, “pin as much as you can so every run uses the same code in the same environment: image tags, commit SHAs, dependencies, and build commands. Cache a local copy so the build requires no network, and aim for the container to be durable so multiple testing loops can just load it” \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\].

Typically installing these tools requires network access. So, “give the sandbox network access only while you’re setting it up. Pull the dependencies, build, install tools, deploy the target, and run the existing tests to confirm everything works. Then, snapshot the environment and remove its \[general\] network access. During scanning, allow traffic only to the model API, routed through a local proxy. Load the snapshot at the start of each run so every scan begins from the same clean slate” \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\].

You may decide that you don’t *want* to create a proof of vulnerability (PoV) / proof of concept (PoC). They are an especially good technique for validation, but they aren’t always necessary. In that case, you may not need as strong a sandbox, but you may also need much more time for validation \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\].

## Preparing the code and documentation {#preparing-the-code-and-documentation}

Like any computer system, an AI’s effectiveness depends on its input. This means that if you prepare the software (its code and documentation) to be easier to analyze, the results are likely to be much better. This means that an AI system can better analyze a system that has type declaration, inline comments, documentation, relevant specifications, and so on. This especially includes “bigger picture” information that explains *why* something was done.

Dan Stenberg reports that AI tools can reason across protocols, specs, and third-party libraries in “almost magical ways”. AI tools can identify failures to comply with a spec, as well as inconsistencies between comments and implementations \[[Vaughan-Nichols](https://thenewstack.io/curls-daniel-stenberg-ai-is-ddosing-open-source-and-fixing-its-bugs/)\]. Language models’ ability to use context, e.g., comments, can be powerful \[[Wolff2026](https://cacm.acm.org/research/large-language-models-in-software-security-analysis/)\].   
Where practical, provide links to key data or extractions of relevant data. Relevant extractions are often better \[Wheeler2026\].

At the least, include an “AGENTS.md” file. Its format and recommendations are provided by the Linux Foundation’s Agentic AI Foundation at \<[https://agents.md/](https://agents.md/)\>. Unfortunately, Claude Code only looks at its single-use “CLAUDE.md” file. If you use Claude Code, you can work around this problem creating a “CLAUDE.md” file that contains only “@AGENTS.md” and putting everything else in AGENTS.md.

\[[0xkato2024](https://www.0xkato.xyz/Get-ready-for-an-audit/)\] recommends making your code well documented, suggesting the following:

* “Are your code comments up to date?  
* Are there any third-party dependencies that the code relies on?  
* Is there a system architecture overview?  
* Have you mapped out the data flow and transaction lifecycle?  
* Are off-chain and on-chain components clearly documented?  
* Are access control mechanisms clearly outlined?  
* Have you done a risk assessment and threat model?  
* Do you have a list of all known issues with explanations?”

Finally, “if (like most) you lack some documentation, AI can help you write it, but again, review the results. If you’re using AI to create documentation, work bottom-up, so that the AI can maximally build on other documentation.” \[Wheeler2026\] This does mean that “professionals who have always written meticulous documentation, are now reaping new benefits from that always valuable practice” \[[Dominus2026-03-05](https://blog.plover.com/tech/gpt/documentation-wins.html)\].

## Preparing CI/CD {#preparing-ci/cd}

An AI system generally works best “when it's able to check its own work with another tool. We refer to this class of tool as a “task verifier”: a trusted method of confirming whether an AI agent’s output actually achieves its goal. Task verifiers give the agent real-time feedback… allowing it to iterate deeply until it succeeds” \[[Anthropic2026-03](https://www.anthropic.com/news/mozilla-firefox-security)\].

Thankfully, any software that needs to work correctly should *already* have mechanisms that support such checking. Any such software should have a CI/CD pipeline to build, test, and deliver changed results:

* Continuous Integration (CI) means that code is frequently merged and verified before acceptance.  
* “CD” can mean either Continuous Delivery (where the verified results are automatically prepared for deployment) or Continuous Deployment (where the verified results are automatically released to live environments).

A CI/CD process was always important, but it’s even *more* important with AI. A process that depends on people remembering to test, or a manual testing process, is not ready for the large number of vulnerabilities and fixes needed for today’s systems.

The CI process needs to be good quality to reduce the likelihood of breaking functionality or inserting vulnerabilities. For example:

* Ensure that you have a good *automated* test suite  
  * Include negative tests (these are tests to verify that what should *not* happen doesn’t happen)  
  * Have good statement coverage (e.g., 90%-100%) \[[0xkato2024](https://www.0xkato.xyz/Get-ready-for-an-audit/)\] and branch coverage  
  * Test edge cases  \[[0xkato2024](https://www.0xkato.xyz/Get-ready-for-an-audit/)\]  
  * Don’t just output “test failed”; report which test(s) failed, the expected results, and the actual results. This is necessary to speed response.  
* Use linters to detect possible defects (some of which may be vulnerabilities)  
* Include tools to detect likely vulnerabilities, such as static application security testing (SAST) tools  
* Take steps to minimize false positives, and especially work to counter *repeat* false positives (e.g., embed in the source code disabling false positives where appropriate)

*Speed matters* in the CI, CD, and deployment processes. It doesn’t matter if a vulnerability is known; what matters is deploying the fix before an attacker exploits it:

* *Make testing/CI time acceptable*. “If regression testing takes a day, you cannot get to a two-hour SLA without skipping it, and the bugs you ship when you skip regression testing tend to be worse than the bugs you were trying to patch.” \[[Bourzikas2026](https://blog.cloudflare.com/cyber-frontier-models/)\] Thankfully, most of these tasks are *easily* parallelizable. Break them down and run them in parallel to reduce the wall clock time. You should be thinking about total minutes, at worst an hour, not a day or longer. Otherwise testing/CI becomes the bottleneck.  
* *Speed deployment*. “Defenders need a continuous operating pipeline that moves from signal to context to action with minimal delay.” \[Crowdstrike2026-FiveSteps\]

## Preparing dependency updates {#preparing-dependency-updates}

In nearly all cases modern software is mostly reused software from somewhere else. These components that are depended on are called “dependencies”. Sooner or later vulnerabilities are likely to be discovered in dependencies, especially if they’re undergoing initial security analysis by AI. It’s a waste of effort to work hard to find vulnerabilities that you could have easily resolved through an easily-available update.

It’s vital to set up *easily-applied* automated reporting of dependency vulnerabilities. Many tools and services can identify updates, prioritize security updates, and make it easy to accept those changes. For example, many tools can create a merge request/pull request that automatically runs the CI/CD pipeline, enabling you to easily accept them if they pass. You can even set up some updates to be entirely automatic. Consider using an AI to help you install and configure these tools; this isn’t hard, and since it’s rote work an AI can often make this easy.

Sometimes you can determine that a vulnerability in a dependency is not exploitable in your system. However, this is often difficult; most modern software is so dynamic that it’s difficult to be *confident* that some vulnerability *cannot* be exploited by an attacker. It’s often safer and more efficient to simply update your system when a vulnerability is found in a dependency; then the vulnerability is fixed *and* the project is better-prepared if another vulnerability is found in that dependency.

You may choose to do a security evaluation for only the “first party” software you developed. You may also choose to evaluate your project’s dependencies. If you do the latter, the results will be more thorough, and the rest of this material will apply to them as well.

Given all that, let’s focus on the core tasks for finding and fixing vulnerabilities.

# Core tasks for finding and fixing vulnerabilities {#core-tasks-for-finding-and-fixing-vulnerabilities}

## Identify findings {#identify-findings}

Simply pointing a generic AI coding agent at an arbitrary software repository and asking it to discover vulnerabilities can work, in the sense that it may find a vulnerability \[[Bourzikas2026](https://blog.cloudflare.com/cyber-frontier-models/)\]. That’s *especially* true if the software hasn’t been previously examined by AI and/or if the AI model is especially good at program analysis.

*However*, this trivial approach often doesn’t provide meaningful coverage of real codebases of significant size, nor does it necessary identify valuable findings. AI can be very effective at finding vulnerabilities \[[Rogers2025](https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters)\]. However, if you want to do a *good* job at finding and fixing vulnerabilities using AI, you generally want to have some kind of harness around the AI to help it focus. Some of the reasons for this need, especially for less-capable models, are:

* Context: A single agent’s context window will easily fill if it tries to do too much at once. Even if it doesn’t technically fill up, an AI agent often struggles when it has too much irrelevant information at once. It’s better to narrowly focus on a specific issue and do that repeatedly.  
* Throughput: Instead of running a single agent hard, it’s better to fan them out in parallel. Otherwise, it takes a long time to produce results, and it won’t adequately examine each potential issue in enough depth \[[Bourzikas2026](https://blog.cloudflare.com/cyber-frontier-models/)\].

In short, coverage is better when “many agents work on tightly scoped questions and we deduplicate the results afterward, rather than asking one agent to be exhaustive.”  \[[Bourzikas2026](https://blog.cloudflare.com/cyber-frontier-models/)\]

### Separate identifying findings from validation {#separate-identifying-findings-from-validation}

One excellent way to improve results is to separate *identifying* findings from *validating* findings. A “finding” is simply a construct that *might* be a vulnerability, but is not necessarily a vulnerability because it’s not clear if it’s exploitable.

Splitting up identifying findings from validating them makes finding vulnerabilities more likely:

* As \[[Bourzikas2026](https://blog.cloudflare.com/cyber-frontier-models/)\] notes, “asking ‘Is this code buggy?’ and ‘Can an attacker actually reach this bug from outside the system?’ are two different questions, and the model is better at each one when you ask them separately, because each question is narrower than the combined version.”  
* As \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\] reports, “In other words, discovery should find as many vulnerabilities as possible—even unlikely ones—and verification should exclude findings that are not actually exploitable. When an agent tries to do both in the same step, it can self censor and exclude exploitable true positives. We learned this the hard way, where asking discovery agents to also verify findings led to them filtering out true positives that a separate verification step would have confirmed.”

So we’ll first focus on identifying findings, and we’ll later discuss validating findings.

### Helping to identify findings {#helping-to-identify-findings}

There are many ways to help identify findings when using AI:

1. *In general, give the AI tools*. That includes tools to search and read the code, security tools, and so on. Consider asking the AI what tools it might need and make them available \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\]. Provide the AI basic tools (e.g., scripting languages like Python) so it can write its own tools to aid in finding (just like a human might do).  
2. *In particular, use traditional non-AI tools that search for potential vulnerabilities*. These include various static analysis tools (examining the source code or binary) and dynamic analysis tools (including fuzzers and web application scanners). Integrating these traditional tools with AI can be powerful. “Agentic AI is already beginning to help scale vulnerability discovery by leveraging traditional tooling.” \[Rohlf2025\].  
3. *Prioritize code that’s especially concerning*. One list suggests code that parses untrusted input, enforces authentication or authorization, or is reachable from the internet \[Cycode2026, quoting Anthropic\]. The Mozilla Firefox project reports that their “scanning is largely focused on specific areas of the code (files, functions) where we instruct the system to look, based on a mix of human judgement and automated signals.” \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\]  
4. *To find security vulnerabilities include a search for language-specific issues, insecure coding practices, and improper handling of parameters, variables, and data flows*. For each programming language used in the project, apply checks for language- and framework-specific vulnerabilities. Trace parameters, variables, and their usage throughout the code to detect unsafe patterns, misuse, or inconsistencies \[[Rogers2025](https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters)\].  
5. *Have the model examine and cluster past bugs or at least past vulnerabilities*. For vulnerabilities (as determined by your threat model), have it list the relevant vulnerability classes. Then have the AI system determine (for every fix) if the fix was complete and if it applied everywhere else. Look for similar problems. \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\] reported that one team did this and found three exploitable issues in an hour, saying “'What have people exploited in the past’ is sometimes a much easier cheat-code towards success than ‘find me vulnerabilities in this codebase.’”  
6. *Use “top” lists of the most likely kinds of vulnerabilities*. At *least* look specifically for common vulnerabilites. “Most software security issues discovered each year are simply variants or instances of previously discovered patterns, rather than entirely new classes of vulnerabilities.” \[Rohlf2025\] So if the produced system is…  
   1. a web application, use the OWASP Top 10 vulnerabilities (for web applications) [https://owasp.org/www-project-top-ten/](https://owasp.org/www-project-top-ten/)  
   2. agentic, use the OWASP Top 10 for Agentic Applications for 2026 [https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)  
   3. Anything else (including internet of things (IoT)), use the CWE Top 25\.  
7. *Look for cases where a component presumes another component does something but there’s no test verifying it*. “Many vulnerabilities are being found ‘in the seams’ between programs, e.g., a library might not filter headers, even if its spec requires header filtering, but all of the library users might expect the library to filter headers.” \[Zimmer2026\]  
8. *Include important non-security bugs, focusing on critical issues that are likely to cause application crashes, severe malfunctions, or significant instability*. Minor or cosmetic issues are less risky, but important “non-security” defects can often be exploited as vulnerabilities.  \[[Rogers2025](https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters)\] claims that “the greatest success I had with policies was a really simply policy of \`find all bugs, even if they’re not vulnerabilities’” Consider as a bug cases where the claimed intent (in some documentation including comments) disagrees with the actual code as written. These can be important to fix anyway, and while the system may initially *believe* they aren’t security-related, they may turn out to be vulnerabilities anyway.  
9. *Consider disabling some hardening mechanisms that are used in production when finding (and also when later validating)*. This way, the hardening mechanisms are truly an additional defense-in-depth measure. The result is that the full system that includes its hardening mechanisms is much harder for an adversary to successfully attack. \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\]  
10. *Include information on configuration, dependencies, deployment choices, and how components are combined*. “Many exploitable issues do no appear as obvious defects in application source code” but instead emerge from these kinds of problems \[[Ziegler2026](https://xbow.com/blog/mythos-offensive-security-xbow-evaluation)\].

Focus on specific files or specific functions for a given analysis. Many first use AI to identify the “most important” files and functions to examine, then examine those first.

At the time of this writing, it’s not clear what level of prescription is appropriate. \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\] claims that with frontier models, more prescriptive prompts (such as long checklists) make discovery worse, as they “tend to reduce the model’s creativity and generate fewer novel bugs”. Others don’t report the same. No matter what, all agree that providing data on what counts as a threat model and providing tools is vital.

When asking for findings, include a definition of what output format and content you want. Ask for a structured report with predefined fields, and order them so the model’s reasoning builds on each field. Example fields include rationale, finding, impact, severity, etc. \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\]. Ask for very detailed information about each finding including a detailed description, filenames, line\#s, the specific triggering input and configuration, relevant URLs, and anything else that would help an AI or human validate it later \[[Rogers2025](https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters)\]. Ask for a proof of concept (PoC) if it can provide it, but be clear that a PoC is not *required* and findings should be reported even if it cannot create a PoC. A PoC can simplify later validation if it can be created, but we don’t want to pre-filter findings too early.

### Findings process {#findings-process}

This process may sound overwhelming, but it’s not. Computers are good at creating lists and then having agents select and work on items in parallel depending on your resources. Indeed, \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\] reports that “discovery is now straightforward to parallelize, and the bottleneck has shifted to verification, triage, and patching.”

Remember, *not* all findings are actual vulnerabilities, and that’s okay. Unfortunately, finding counts can sometimes mislead others. As \[[Ottenheimer2026-05-26](https://www.flyingpenguin.com/mythos-grading-mythos-got-patches-yet/)\] “Glasswing is NOT confidently reporting tens of thousands of real bugs…, like any tool, they are reporting tens of thousands of findings, of which a confident count of real bugs is much smaller.” That doesn’t mean AI is useless, far from it. It’s just that findings need to be validated after they’re found.

Don’t assume that all findings were found when AI completes some run. Modern AI systems are generally non-deterministic \[[Rogers2025](https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters)\]. Re-running may produce some more findings even if all of a previous run’s findings were examined. In addition, finding potential vulnerabilities (and validating them later) can be a challenge, since they related to mathematically undecidable problems in computer science \[Rohlf2025\]. If done well, this should be a case of diminishing returns. The best way to see how quickly the number of findings are diminishing is to keep re-run finding efforts until the process increasingly comes up empty-handed.

### Handling external findings/vulnerabilities {#handling-external-findings/vulnerabilities}

External organizations may report up upi what they claim are vulnerabilities. These reports may or may not be true, so they are essentially findings.

Make it clear that you expect reporters to have a human review of an AI-proposed vulnerability report. Encourage reporters to work together to de-duplicate reports before they get to you (e.g., through Akrites).

Perhaps most importantly, *require* evidence that a report is a vulnerability. Require a sample input demonstrating it’s a vulnerability. If the code is available to the reporter, ask them to report specific filenames and line numbers. It’s best to demand that they validate their findings and propose a fix. So with that in mind, let’s discuss validating findings.

## De-duplicate {#de-duplicate}

“De-duplication” is the process of eliminating duplicate reports, eliminating unnecessary duplication of effort.

In practice you need to repeatedly de-duplicate as you learn information. Projects may de-duplicate before validation (to eliminate obvious duplicates that don’t need duplicate validation), and de-duplicate again after validation has gained more information.

Some writers consider de-duplication part of triage (e.g., \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\]), and others treat them separately. No matter how you define the terms, both are needed.

\[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\] recommends the following for de-duplication:

* Consider the root cause. “Scanners often flag one bug at multiple call sites or report multiple symptoms of a single root cause. Here’s one practical approach: First, use a cheap deterministic pass: same file, same category, vulnerability line numbers within ten lines of each other. Then, have a model apply qualitative rules to what remains:”  
* “Treat as duplicate: the same root cause worded differently; the same vulnerability reported at multiple call sites; a missing global protection (like an auth check) reported per endpoint; or a cause and its consequence flagged in the same path.”  
* “Treat as distinct: different vulnerability classes in the same file; different variables reaching different sinks; two independent bugs inside one helper; the same missing check on two endpoints, but each requires its own fix.”

If it’s not *clear* that a finding is a duplicate, pass it along to be validated separately. Once more information is acquired it may be easier to determine if it’s a duplicate.

## Validate findings {#validate-findings}

A vulnerability is a defect that can be exploited by an attacker and violates some security requirement. A finding is only a *potential* vulnerability. Not all findings from AIs (or humans) are real vulnerabilities \[[Ottenheimer2026-05-26](https://www.flyingpenguin.com/mythos-grading-mythos-got-patches-yet/)\].

So, once you have a finding, you need to *validate* it to independently determine if a finding is a vulnerability, a defect but not a vulnerability, or not a defect. Even when a finding isn’t a defect, it might suggest improvements for the future, but here we’ll focus on validating if a finding is a vulnerability.

### Defining what a vulnerability is {#defining-what-a-vulnerability-is}

A *key* for validating findings is to have a threat model and/or security requirements (otherwise there’s no way to tell if something is security-related). Otherwise it’s often difficult to determine if something is or isn’t a vulnerability. It’s also vital to have a validation infrastructure, that is, a way to run tests to confirm or refute claims \[[Ziegler2026](https://xbow.com/blog/mythos-offensive-security-xbow-evaluation)\].

An important decision is to decide if defense-in-depth countermeasures (such as sandboxes) should be disabled and ignored during validation. A mechanism is only a defense-in-depth measure if it’s an *additional* measure for security, not a *required* one. Thus, from a security perspective, it’s better if a finding is considered a vulnerability *even if* another countermeasure would have prevented it. For example, Firefox considers a finding a vulnerability even if a sandbox would have prevented it. That way, “Real-world attackers generally need to chain multiple exploits together to escalate privileges through one or more layers \[mitigations like sandboxing and ASLR\] \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\]. Of course, vulnerabilities that can penetrate existing countermeasures should be prioritized.

### Defining the proof required {#defining-the-proof-required}

Projects must determine the level of proof required for a finding to be considered a vulnerability:

1. The gold standard for validating a finding is to generate a Proof of Vulnerability (PoV), that is, a specific input to the program that an adversary *could* supply that would violate its security requirements.  
   1. In practice, being able to trigger abnormal execution (such as a crash, memory error, or sanitizer violation) is often considered by projects to be enough to prove that a discovered defect is real and reachable. For example, Firefox classifies findings as high security vulnerabilities “based on predictable crash symptoms such as use-after-free or out-of-bounds memory issues being reported by AddressSanitizer, and our threat model assumes that any of them could be exploitable with sufficient effort. This reduces the risk of a false negative during exploitability analysis, and more importantly it allows us to focus our resources on finding and fixing more vulnerabilities.” \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\]  
   2. Some AI systems incorporate guardrails that prevent doing this (since it can also be used for attack). Such AI systems are mostly useless for this task. In some cases defenders can request access from the AI system provider to a model without such guardrails. Otherwise, a different AI system may be necessary for this task.  
2. A project may decide that a more general Proof of Concept (PoC) that describes generally how to exploit the vulnerability, without details, is adequate evidence. Note that some use the term PoC and PoV interchangeably.  
3. In the long term it’s often worthwhile to fix defects even if neither standard isn’t met, since even if a PoV isn’t found it might be possible for a different system to find a way to exploit a finding. Typically the later triage focuses first on the findings that are *known* to be exploitable.

A *part* of validating findings is typically to use an AI to review the proposed finding. In principle a stronger model will be better at this, but it’s no guarantee. \[[Ziegler2026](https://xbow.com/blog/mythos-offensive-security-xbow-evaluation)\] reporting when using Mythos Preview that its “judgment results were more mixed than its discovery results... It rejected false positives better than many predecessors, but sometimes lost true positives when evidence did not formally satisfy its criteria or when the intended rule was broader than the written one.”

### Tips for validation {#tips-for-validation}

There’s no magic to validation. Validating claims has long been a part of software development. In the case of validating AI findings, \[Khollosi\] reported that “Practitioners in our study consistently emphasized a layered validation approach involving manual inspection, sandbox testing, peer review, and cross-checking against established standards such as OWASP or NIST.” It’s all part of using multiple stages to validate (and de-duplicate) a report \[[Rogers2025](https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters)\].

\[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\] recommends the following for verification:

* “The verifier agent should be independent from the discovery agent. Run the verifier in a fresh container without a shared filesystem or conversation history. If the verifier is exposed to the discovery agent’s reasoning, it may simply agree instead of testing the claim. Thus, give the verifier only (1) the proof of concept or written finding and (2) the codebase, so it can search for mitigations the finder missed (e.g., upstream validation, auth gates, type constraints, or unreachable code).”  
* “Prompt the verification agent to disprove the discovery agent’s findings. Have the verifier assume each finding is a false positive and search for reasons the finding is wrong. Include clear criteria that the verifier agent can use to determine if the finding is a true positive. This matters most when the discovery agent’s output doesn’t include a \[Proof of Concept (PoC)\]. Aim to exclude as many non-exploitable findings as possible to reduce effort on manual reviews.”  
* “Across the teams we’ve worked with, adding an adversarial verifier roughly halved the rate of non-exploitable findings from the discovery phase. Requiring that verifier to also build a proof of concept confirming the exploit brought the false positive rate to near zero. Together, these two steps helped to reduce the downstream triage and patching load significantly.”  
* “One team scanning open-source packages built a verification step that helped to close the loop: scan the package, generate a proof of concept, then deploy a mock application that uses the package and triggers the PoC. Their take was that: "Validation is the biggest holdup and the PoC is the validation."”

## Triage {#triage}

Triage is the process of prioritizing reports once they’ve been validated. Ideally all vulnerabilities would be immediately fixed, but if that’s not practical, they must be prioritized so the most important vulnerabilities are addressed first.

This is fundamentally a risk decision. Risks by definition are based on their:

1. Likelihood. In particular, consider the preconditions necessary for the vulnerability to be exploitable and what is required for an attacker to exploit it \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\]. A vulnerability that can be remotely exploited by an unauthenticated attacker would typically have a higher likelihood than one that requires a local authenticated user.  
2. Impact. A remote code execution (RCE) is typically considered *extremely* serious since an attacker can then make the system do many things. In contrast, a vulnerability that only reveals public information would be low risk.

Most systems have *some* sort of “severity rating” classification system to help you identify the vulnerabilities most needing to be addressed \[[Rogers2025](https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters)\]. Unfortunately, many report that AI systems aren’t very good at estimating severity of a vulnerability (both too high and too low), so if you use an AI to estimate in a way that matters, have a human review them.

Modern AI systems have become increasingly good at chaining many defects *together* into vulnerabilities. Something that *appears* to be unexploitable may, when chained with other defects, turn into a serious vulnerability. Thus, it’s reasonable to triage the “most dangerous vulnerabilities” at first, but do *not* ignore other defects that *appear* to be unexploitable. Fix the other defects, as resources permit, so they don’t become part of a chain leading to an exploit.

## Fix vulnerabilities {#fix-vulnerabilities}

Finding vulnerabilities is useless for a defender unless those vulnerabilities are *fixed*. If fixing vulnerabilities is not handled efficiently this can become completely overwhelming. For example, here is the number of bug fixes in the Chrome browser, showing a huge rise in 2026 (compared to 2024-2025) caused by AI-discovered vulnerability reports:

![Number of Chrome bug fixes by milestone, with a dramatic increase in fixes in 2026 due to AI vulnerability reports.][image1]  
Chrome bug fixes by milestone dramatically grew in 2026 due to AI \[[Chrome2026](https://blog.google/security/chrome-stronger-with-every-update/)\]

In many ways a web browser is a worst case, since a web browser has a massive amount of functionality and must directly interact with potentially-malicious websites. Still, this experience demonstrates that AI can find many vulnerabilities *not* reported to projects by other approaches.

### Fixing is often necessary for sending reports to external organizations {#fixing-is-often-necessary-for-sending-reports-to-external-organizations}

Historically, if a finder was examining external software, they would often simply report a vulnerability to that external project, and let the project fix it. However, in the new world of AI, simply reporting a vulnerability is often not very helpful; projects are often inundated. If an AI was used to find a potential vulnerability, many recipients will expect both a proof of vulnerability (showing it’s a vulnerability), a specific proposed fix that would fix it, and ideally related fixes to improve the testing, broader corrections, and so on.

As reported by \[Trail of Bits\] “Anyone can file an issue, flex, and walk away. We showed up with the patches… \[and go\] beyond just fixing bugs: we’re adding new tests and fuzzing harnesses, CI security scanning, supply-chain tooling, correctness fixes, and features maintainers had been meaning to get to.” In short, providing proposed fixing is far more likely to be helpful as compared to showing up with only a complaint.

### Assigning the fix {#assigning-the-fix}

In a larger project, the first step for handling a tsunami of reports is automatic assigning. If a system can automatically route the issue to the correct component and human owner this can be a huge help \[[Chrome2026](https://blog.google/security/chrome-stronger-with-every-update/)\]. This doesn’t need to be complex; an AI system can often estimate this. If the assignment is in error, or the human is overwhelmed, have a process for transferring it.

### Creating tests and confirming the root problem {#creating-tests-and-confirming-the-root-problem}

Before creating a fix, “write a new test that fails with the existing code. Then, implement the fix and confirm the same test now passes without breaking anything else. (Yes, it’s test-driven development). If you don't add a test, the fix can silently regress and it can be hard to retroactively prove the bug was real.” \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\] After all, this mistake happened before; a focused test will increase the likelihood that this specific problem won’t happen again.

Examine the system to find the *root cause*. “Models may narrowly address findings at a specific call site instead of the root cause. Simply prompting the model to identify and fix the root cause can be effective. Then, have the model look for variants at two levels: (1) same pattern, where there are other call sites or copies of the same buggy code elsewhere, and (2) same class, where a codebase with one SQL injection vulnerability tends to have more SQL injection vulnerabilities. Update the threat model with the validated findings and patches to close the loop.” \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\]

### How to create the fix {#how-to-create-the-fix}

Now you’re ready to create a fix. You might choose to use AI to help develop a candidate fix, but you do *not* need to use the same AI that found the vulnerability. Many use a model for finding a vulnerability that is expensive, slow, or has restricted access. It might be better to use a different AI system to create the fixes, since it might not have the same issues, it can use the detailed information provided earlier, and it might be better at that task.

### Warning: AI is not good at fixing complex vulnerabilities

However, we must address a serious problem: as of 2026, even the best AI systems are ***very bad*** at fixing ***complex*** vulnerabilities. A study by 1password found that when the fix “had to touch multiple files, functions, or code paths, and introduce non-trivial changes” an AI would succeed only *26.0%* of the time at generating a fix that fully resolved the vulnerability without materially changing application behavior. AI systems did not resolve the vulnerability, added a new vulnerability, or both, an average 53.9% of the time. \[[Hoodlet2026](https://1password.com/blog/why-ai-generated-patches-still-require-human-review)\], \[[Mierczuk2026](https://1password.com/files/resources/frontier-models-vulnerability-patches-flawed.pdf)\]

In fact, with *complex* vulnerabilities, as of 2026 using an AI to fix may not be a good use of resources. One report found that so few fixes worked correctly that “human auditors of LLM-generated patches are likely to spend the majority of their time reviewing and ultimately rejecting an avalanche of unnecessary code… the level of understanding one must build to confidently evaluate the full correctness of a vulnerability patch is often at least what would have been sufficient for a human programmer to produce a single, known-good patch in the first place.” \[[Mierczuk2026](https://1password.com/files/resources/frontier-models-vulnerability-patches-flawed.pdf)\]

This may seem surprising, but it shouldn’t be. AI systems can generate lots of code, especially simple code that’s similar to what’s been done many times before. This has misled some people into thinking that AI can generate any code at all. However, in many ways AI systems act like junior developers. AI can generate a lot of “straightforward” code, and that’s greate because a lot of code is straightforward. However, AI is not good at applying specific local context, especially in complex situations. AI also has a propensity to generate insecure code in general (after all, it was trained on lots of insecure code). Fixing complex vulnerabilities while not creating new vulnerabilities, often vulnerabilities created by previous AI use, is exactly where AI systems are especially weak. 

Of course, AI *can* be helpful in generating many fixes. Many vulnerabilities are relatively easy to fix, where the fix is localized to a specific line or set of adjacent lines. Simple-to-fix vulnerabilities are generally *good* targets for AI to develop fixes. Although it usually doesn’t happen, sometimes a frontier AI system *can* fix a complex vulnerability. Perhaps most importantly, this information only applies to AI models as of 2026\. We do not know how much better the AI models and underlying tools will become. That said, this limitation is unlikely to disappear instantly, and not everyone can use the best available systems, so it’s important to be aware that AI systems may struggle with more complex vulnerabilities.

### Only provide correct information, especially if fully automated

The phrase “garbage in, garbage out” applies to AI systems, and is *especially* true if you are trying to use AI to create fixes for vulnerabilities. Be careful to *only* provide correct details; do not include data that might be incorrect in such prompting.

One study found that, “giving incorrect guidance to the model in its initial prompt \[to create a vulnerability fix\] resulted in a roughly 50 percentage point reduction in fix correctness rates \[while\] giving more correct details to the model increased correctness by only 15 percentage  
points compared to no specific guidance at all. As such, in cases where one cannot be highly  
confident in the accuracy of bug details or fix guidance passed to an LLM for patch generation  
(e.g., when that data is sourced directly from other automated tooling), the safer bet may  
actually be to omit lower-confidence information that could cause a ‘correctness collapse’ if it  
turns out to be wrong.”  \[[Mierczuk2026](https://1password.com/files/resources/frontier-models-vulnerability-patches-flawed.pdf)\]

### Approaching fixes

As much as possible, be clear in the prompt to create a fix. Use something like this prompt: “Identify the root causes of this vulnerability. Identify approaches for fixing the root causes of the vulnerability, not just this specific example, so it is no longer a vulnerability. Discuss options for fixing it, along with pros and cons. Remember that the goal is to ensure an attacker cannot exploit the vulnerability along any path, not simply some paths. When generating the code, reuse existing code, minimize the amount of new code, and where practical work within the existing system. Ensure the resulting change is easy to review. Ensure that existing functionality is maintained where practical and that you do not insert any new vulnerabilities. Update corresponding documentation. Use tools to obtain and validate information. The result must pass all CI/CD tests.”

Provide a harness when using an AI to fix defects that allows it to interrogate, validate, and raise disagreements about the information stated to them in their initial task prompts.” \[[Mierczuk2026](https://1password.com/files/resources/frontier-models-vulnerability-patches-flawed.pdf)\] AI is much less likely to succeed if it has wrong information, and less likely to succeed if it’s missing key information, so it’s important to give it tools to increase its likelihood of success.

The Chrome team’s process is instructive: “we run a fixing agent that returns multiple candidate fixes. A critic agent then evaluates which would be the best fit, producing other relevant artifacts for developers to evaluate the fix. The fixing and critic agents work in a loop that mimics a typical code review process to ensure that code is functional and compliant with \[our\] style guidelines \[and\] other local code conventions.” \[[Chrome2026](https://blog.google/security/chrome-stronger-with-every-update/)\]

### Verifying the fix {#verifying-the-fix}

After generating candidate fixes, have AI and then humans review them.

Even very good AI writes vulnerable code. In particular, an AI can be good at finding vulnerabilities yet still write code with lots of vulnerabilities. This might be surprising, but remember, AI is trained on a large amount of insecure software. It’s more difficult to get an AI to do something that is *contrary* to its training data set. \[[CSA2026](https://labs.cloudsecurityalliance.org/mythos-ciso/)\] \[Zimmer2026\]. Modern AI is fundamentally probabilistic, so it can be difficult to predict exactly what it will generate for a given request \[[Kholoosi](https://arxiv.org/abs/2512.18261v2)\].

So the first step is to have an AI review the proposed vulnerability fix. “Have a new discovery agent probe the patch as an attacker to confirm the patch is comprehensive.” \[[Yan2026](https://claude.com/blog/using-llms-to-secure-source-code)\]

What can be especially helpful is to have AI write tests for the fixes. \[[Chrome2026](https://blog.google/security/chrome-stronger-with-every-update/)\] reports that they use test-writing agents to “help write tests for fixes. These agents can ensure that tests work across supported platforms and configurations before a developer reviews the fix, saving up to weeks of developer time.”

While AI review is a good first pass for proposed vulnerability fixes, they still require expert human review. As \[[Hoodlet2026](https://1password.com/blog/why-ai-generated-patches-still-require-human-review)\] notes in August 2026:

* “The average success rate for generating a patch that fully resolved the vulnerability (without materially changing application behavior) was just 26.0%. Patches that successfully resolved the vulnerability, but altered the application’s behavior in the process, occurred 20.1% of the time. Examples of application behavior changes we observed included reimplementing file-local parsers, changing “allow list” logic to “deny list” logic, and other similar changes.   
* Conversely, LLM-generated patches did not resolve the vulnerability, added a new vulnerability, or both, an average 53.9% of the time.”  
* They call these incorrect changes that cause incorrect behavior, fail to fix the vulnerability, or add new vulnerabilities “Fix-Like Artifacts with Embedded Defects” (FLAWED).

Some problems with initial AI proposed fixes are especially common:

* *AI often fixes merely the specific instance, instead of looking for root causes and fixing the problem systematically*. “Patches focused too much on immediate consequences of issues, and generally failed to put the whole application and codepath into perspective, and “understand” the real source of the problem, and where an engineer with a clue would actually solve the problem rather than mitigate it. Indeed, they often lacked a comprehensive understanding of the entire system architecture, which led to the creation of small, isolated patches that only address immediate problems without considering broader implications.” \[[Rogers2025](https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters)\]  
* *AI often fails to customize the fix and reuse existing constructs*. “For fixes, one of the most common issues was that the fix was not customized to the developer’s codebase, for example, creating a function to sanitize user inputs when the developer wants to reuse their existing sanitization library; this often prevented the users from directly applying the fix, requiring an overhaul to produce a fix with their intended approach.” \[[Steenhook2025](https://arxiv.org/abs/2412.14306v3)\] In short, for an AI system it’s “easier” to write lots of duplicate code, but this typically creates a maintenance nightmare.

Even if an AI’s initial fix is wrong, that doesn’t make its proposed fix useless. One reporter said that he found AI fixes “found them most useful for simply understanding what the problem actually was in the code – sometimes I didn’t understand the issue from the description, but the suggested fix revealed to me what was wrong, and what would (could?) fix it.” \[[Rogers2025](https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters)\] Sometimes the proposed fixes shouldn’t be the final fix, but they can still provide guidance to help developers find a correct solution.

Be *sure* to apply all of your usual verification processes. That includes your peer review gates, CI/CD pipelines, and branch protection rules. “Leveraging organizational safeguards such as peer-review gates and branch protection rules can help mitigate potential individual complacency regarding AI-generated security suggestions.” \[[Kholoosi](https://arxiv.org/abs/2512.18261v2)\]

Technology can help. However, as noted in \[[Anthropic2026-05](https://www.anthropic.com/research/glasswing-initial-update)\], now “the bottleneck in fixing bugs like these is the human capacity to triage, report, and design and deploy patches for them.”

## Report vulnerability {#report-vulnerability}

If the vulnerability is in an *externally-maintained* component, report the vulnerability to the project that maintains that component. Use the vulnerability reporting process defined by that project, in whatever form the project prefers. In many cases this involves working with others in a process called “coordinated vulnerability disclosure”. This requires some clarifications.

First, “AI-assisted bug reports have a mixed track record, and skepticism is earned. Too many submissions have meant false positives and an extra burden for open source projects.” \[[Grinstead2026-03](https://blog.mozilla.org/en/firefox/hardening-firefox-anthropic-red-team/)\] The best AI systems have gotten better, and some perform human review before sending reports, but many projects receive a lot of useless AI slop. Provide *value*. Include the specific reproducing inputs that *prove* that a report is a vulnerability (as discussed earlier), test cases that enable easy verification and regression testing, as well as a proposed fix. Have a human review it all before submitting it. These measures, especially a way to reliably reproduce the vulnerability with plausible inputs, help provide confidence that the report is not merely “AI slop” or a false positive.

When making a report on a component, briefly and clearly state the deployment model and security threat being assumed. Supply this *early* in the report. Often, when AI writes the report, nothing in the code or documentation tells it which deployments are supported. Many AIs will make the most permissive assumption, even a patently absurd one, and that assumption will make any finding look especially severe. Once you’ve clearly stated the deployment model and security threat, only then can you or the AI begin to assign a severity. A maintainer who disagrees with the claimed deployment model or security threat can correct that line instead of rejecting the report without saying why.

A significant challenge can occur if the component’s maintainers expressly *do not* support the reporters’ threat model. In that case, the reporter can try to:

1. Convince the maintainers to expand their threat model. Typically this involves providing the resources to do it, such as developing proposed changes and/or agreeing to join as a co-maintainer.  
2. Fix it and contribute it as a normal (non-security) defect as a short-term measure, *and* change the using system’s design so it no longer requires any security property that the component *does not support*.

That may be too abstract; here’s a concrete example. The [Linux kernel threat model](https://docs.kernel.org/process/threat-model.html) (2026) expressly says “mounting a block device \[like an external USB stick\] is a privileged operation… and the administrator is responsible for the media they mount.” ChromeOS uses the Linux kernel, but ChromeOS also supports mounting an external USB stick that is *not* fully trusted (under the presumption it’s passive media). Remember, the Linux kernel itself expressly does *not* support this activity. Instead of ignoring the Linux kernel’s clear statements, ChromeOS uses a different mechanism: when it mounts external untrusted media it uses a different system based on Filesystem in Userspace (FUSE). In short, the ChromeOS developers used components where appropriate; they used the Linux kernel as the kernel, but also selected *different* components when they needed a special security property not directly supported by the kernel. No one piece of software can do everything; many problems require multiple components, working together, to achieve the desired result.

Often a project will not simply accept the proposed fix \[Zimmer2026\]. Proposed fixes by those outside the project often fail to properly reuse a project’s existing methods, templates, and other mechanisms, creating long-term maintenance issues if they were simply accepted-as is. Maintainers of a project often have longer-term roadmaps that a proposed fix won’t precisely meet. Many projects have unwritten rules and expectations. That doesn’t mean a proposed fix is useless, however. A proposed fix is usually a necessary and helpful step in creating the final fix. So don’t feel discouraged if the final fix is different; it was a necessary part of the process.

One source of debate is how large the vulnerability report should be. Many maintainers don’t want to receive massive tomes; they want something they can read quickly. Yet if the report lacks detail, it’s not helpful. One solution is to put the entire essence of the report in one paragraph (6 sentences or less), and lead with that one paragraph. The receiver can then read that and decide if it’s worth reading further. When reporting to a project, *find out* what format the project wants to receive and comply with that. In general *respect the limited time of the maintainers receiving the report* \[[Larson2026](https://sethmlarson.dev/respecting-maintainer-time-should-be-in-security-policies)\].  

Many open source software projects are receiving an *overwhelming* number of duplicate reports. Often many different people will use the same AI system to look for vulnerabilities in the same software, resulting in many duplicate reports to a given project. The Linux Foundation has established a project called Akrites \<[https://akrites.org/](https://akrites.org/)\> to help organizations de-duplicate findings *before* they overwhelm receiving projects, along with validating, preparing remediations, and synchronizing disclosure.  If you’re a member of those organizations (or believe you perhaps should be), see the Akrites site for more information.

### EU Cyber Resilience Act (CRA) reporting {#eu-cyber-resilience-act-(cra)-reporting}

The European Union (EU) Cyber Resilience Act (CRA) includes a variety of requirements on manufacturers of products with digital elements that are distributed in the EU, as well as on OSS stewards.

The CRA treats *actively exploited vulnerabilities* differently from *vulnerabilities* found. The CRA has various requirements for fixing vulnerabilities and distributing those fixes. If you learn that there is an *actively exploited vulnerability* in software you maintain, or what’s called a *severe incident*, the CRA imposes strict requirements on reporting including short time windows (an initial report must be made within 24 hours).

For more information, see our course “[Understanding the EU Cyber Resilience Act (CRA) (LFEL1001)](https://training.linuxfoundation.org/express-learning/understanding-the-eu-cyber-resilience-act-cra-lfel1001/)”.

## Release & deploy {#release-&-deploy}

Software that is fixed locally is worthless. Fixed software must be *released* and *deployed*. This was always true, but now that AI is accelerating the vulnerability-finding process, it’s even *more* important.

Anthropic notes that “software developers should… make security fixes available as quickly as possible… Developers should also help their users stay up-to-date with their software by making it as easy as possible to install updates; to the extent feasible, they should be more persistent with users who are still running software with known vulnerabilities.” \[[Anthropic2026-05](https://www.anthropic.com/research/glasswing-initial-update)\]

Conversely, people and organizations should ensure that they can rapidly *accept* updates. Establish processes to automatically test updates, then propose or implement those updates. Organizations that try to do this manually will be unable to keep up.

## Repeated application {#repeated-application}

Most AI systems are non-deterministic; re-running the same AI system with the same inputs can  discover new vulnerabilities, especially in the first few iterations. In addition, AI systems will continue to improve, and new capabilities may find new problems.

So you need to repeatedly apply AI systems, especially improved systems, to find vulnerabilities previously missed by other passes. As vulnerabilities are found, search for similar patterns elsewhere, and ensure you really *did* fix the problem systematically.

The good news is that improved hardening and fixing vulnerabilities will eventually eliminate all “easy vulnerabilities” and make the system increasingly difficult to attack. Software is finite, and so are defects.

# Preventing vulnerabilities longer term {#preventing-vulnerabilities-longer-term}

Looking for vulnerabilities and quickly fixing them is like stopping the bleeding of a badly-hurt patient. It’s important to do, and generally must be done first, but it’s usually not enough to make a patient fully healthy. It’s instead important to prevent vulnerabilities long term. Thankfully, AI can help do that as well.

## Limit vibe coding {#limit-vibe-coding}

Modern AI has become far better at generating code. However, AI often generates insecure code. That has led to an explosion of *vulnerable* code being released. “Researchers at Georgia Tech’s Vibe Security Radar tracked CVEs directly attributable to AI coding tools and found that March 2026 alone produced more than all of 2025 combined.” \[[Holderhoff2026](https://redmonk.com/kholterhoff/2026/05/05/ai-slop-vulnerability-treadmill/)\]

Where security matters, you need to have AI look for vulnerabilities and then have human review as well of AI-generated code. You can use AI to generate code. The problem happens if you trust that it’s infallible.

## Evaluate merge/pull requests {#evaluate-merge/pull-requests}

In all cases, whether code changes were created by AI or by humans, look for vulnerabilities in each merge/pull request.

* Have AI and a human review the proposed change before it’s even submitted  
* “Enforce automated security assessments consistently in your development processes, including using LLM-powered agents to find vulnerabilities before attackers do” \[[CSA2026](https://labs.cloudsecurityalliance.org/mythos-ciso/)\]  
* “All code (human or AI-generated) should pass LLM-driven security review before merge.” \[[CSA2026](https://labs.cloudsecurityalliance.org/mythos-ciso/)\]

## Apply secure by design and secure by default {#apply-secure-by-design-and-secure-by-default}

*Only* trying to find and fix software vulnerabilities one-at-a-time will not succeed in the long term. It’s *necessary*, but future changes might re-introduce similar vulnerabilities. 

As always, if a system is to be secure in the real world, it must be:

* Secure-by-design: Design the software to be secure in the first place. For example, limit its attack surface, and apply defense in depth \[[FiveEyes2026](https://www.cyber.gov.au/sites/default/files/2026-06/Five%20eyes%20cyber%20security%20agencies%20statement.pdf)\]  
* Secure-by-default: Release the software so that it’s secure in the default install. A “hardening guide” indicates insecure software; those steps should have been applied before its release

Secure-by-design and secure-by default “must become standard practice – not an aspiration”. Systems must be designed to be resilient and *not* depend on a single solution or technology, but must instead apply defense in depth \[[FiveEyes2026](https://www.cyber.gov.au/sites/default/files/2026-06/Five%20eyes%20cyber%20security%20agencies%20statement.pdf)\].

## Harden {#harden}

A key aspect of secure-by-design is *software hardening*, that is, continuously modifying the software to be *systematically* difficult to break into because a defect is unlikely to be exploitable. Defects are inevitable, but they do *not* need to necessarily become vulnerabilities. If other vulnerabilities *do* exist, it’s best to constrain the likelihood of their exploitation and their impact as practical.

By applying these approaches, the software becomes difficult to break into. The goal is to make it difficult for an attacker to *exploit* a defect, preventing defects from becoming vulnerabilities.

### Applying hardening {#applying-hardening}

Some hardening measures are well-known industry-wide. For example, some languages are “memory-unsafe”, primarily C and C++. A memory-unsafe language does not, by default, protect against common memory errors such as attempting to read or write an array out-of-bounds. As a result, both humans and AI tend to produce more vulnerabilities in these languages. They’re also more difficult to analyze later, leading to more false positives \[[Bourzikas2026](https://blog.cloudflare.com/cyber-frontier-models/)\]. There are hardening approaches for this situation:

* One approach is to rewrite that software in a memory-safe language such as Rust. If this significantly hurts performance, selected memory checks can be disabled where it’s important for performance and the memory checks are shown to be unnecessary.  
* Another approach is to enable additional mechanisms to reduce the likelihood of an undetected memory safety issue becoming a vulnerability. One example is applying the OpenSSF Compiler Options Hardening Guide for C and C++ \[[OpenSSF2026-06](https://best.openssf.org/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C++.html)\]. Projects like the Linux kernel create new APIs (such as strscpy) *specifically* to reduce the likelihood of vulnerabilities from memory safety issues.

Other software hardening measures are created after examining lessons learned from the software itself. Mozilla reported that “in recent years we received several clever reports from security researchers that managed to escape the process sandbox by triggering prototype pollution in the privileged parent process. Rather than fixing these problems one-by-one, we made an architectural change to freeze these prototypes by default. While auditing logs from the harness, we saw many attempts to pursue this line of escape that were thwarted by this design” \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\].

**Hardening works.** Many well-run projects report that hardening measures *do* counter attackers, including powerful AI models. Mozilla reported that “just as interesting as what the models found is what they didn’t find — not because they didn’t try, but because they were unable to circumvent Firefox’s layered defenses.” \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\] Similarly, Anthropic reported that Mythos Preview identified many ares of the Linux kernel that *appeared* to be vulnerabilities, yet “because of the Linux kernel’s defense in depth measures Mythos Preview was unable to successfully exploit any of these.” \[[Carlini2026](https://red.anthropic.com/2026/mythos-preview/)\]

**Hardening is no longer optional**. Crowdstrike states that cyber resilience is becoming foundational. “As exploitation windows shrink, rapid recovery, low-disruption patching, and containment without business interruption become core defensive requirements. In a frontier AI threat model, resiliency is no longer a differentiator layered on top of prevention. It is part of prevention.” \[Crowdstrike2026-FiveSteps\]

### Harden to counter chaining {#harden-to-counter-chaining}

There are different kinds of hardening:

1. Hardening mechanisms that *always* prevent some kinds of defects from becoming vulnerabilities.  
2. Hardening mechanisms that only make it *somewhat more difficult* to turn a defect into a vulnerability

Both kinds can counter attackers who don’t use AI, since a human may decide that the second kind isn’t worth the effort. However, modern AI completely changes things.

Modern AI systems can often chain multiple defects together to form an exploitable vulnerability. Anthropic reported that, “We have nearly a dozen examples of Mythos Preview successfully chaining together two, three, and sometimes four vulnerabilities in order to construct a functional exploit on the Linux kernel… \[modern AI requires rethinking of\] measures that make exploitation tedious, rather than impossible. When run at large scale, language models grind through these tedious steps quickly. Mitigations whose security value comes primarily from friction rather than hard barriers… become considerably weaker against model-assisted adversaries. ” \[[Carlini2026](https://red.anthropic.com/2026/mythos-preview/)\]. This ability to chain defects together often defeats the “somewhat more difficult” hardening measures.

*Do* use hardening measures that *always* counter certain kinds of defects (the first kind):

* For example, the “W^X” countermeasure ensures that memory regions can only be writable *or* executable, never both. This countermeasure *systematically* prevents unauthorized writes to memory becoming directly executable.  
* Similarly, address space layout randomization (ASLR) is a strong hardening measure *if* there are enough randomization bits *and* there’s no way to reveal data so an attacker can determine the randomization seed.  
* Parameterized statements *reliably* counter SQL injection; use them.

However, merely making a defect “somewhat more difficult” to exploit is generally ineffective against AI. For example, “modern browsers run JavaScript through a Just-In-Time (JIT) compiler that generates machine code on the fly. This makes the memory layout dynamic and unpredictable \[so converting  defects into vulnerabilities is more difficult, yet\] Mythos Preview fully autonomously discovered the necessary read and write primitives, and then chained them together to form a JIT heap spray \[exploitation\]” \[[Carlini2026](https://red.anthropic.com/2026/mythos-preview/)\].

Hardening still matters, but you need to use *reliable* hardening mechanisms.

### Disable hardening and evaluate hardening during evaluation {#disable-hardening-and-evaluate-hardening-during-evaluation}

Where sensible, try to *disable* hardening mechanisms of a system when trying to find and fix vulnerabilities in that system. The point is to implement “defense in depth” where practical. The system should be designed so where practical an attacker must defeat *multiple* mechanisms to exploit the system. If the AI system is asked to only evaluate the system with all its hardening mechanisms in place, then it will not report cases where only a single hardening mechanism prevented an attack.

For example, in one analysis of Mozilla’s Firefox, their testing environment “intentionally removed some of the security features found in modern browsers. This includes, most importantly, the sandbox, the purpose of which is to reduce the impact of these types of vulnerabilities” \[[Anthropic2026-03](https://www.anthropic.com/news/mozilla-firefox-security)\]. In this weakened environment the AI “is tasked with developing an exploit” \[[Anthropic2026-04s](https://www-cdn.anthropic.com/08ab9158070959f88f296514c21b7facce6f52bc.pdf)\].

In addition, have the AI look for *defects in the hardening mechanisms themselves*, such as looking for a “sandbox escape”. The goal is to allowing the model to craft an attack that the hardening mechanism should prevent, and ensuring that the hardening mechanism works against active attacks. This kind of evaluation was *also* done with Mozilla Firefox; where the AI was “permitted to patch the Firefox source code, so long as the modified code is restricted to run only in the sandboxed process. Such bugs are notoriously difficult to find with fuzzing… AI analysis provides much more comprehensive coverage of this critical surface” \[[Grinstead2026-05](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)\].

By evaluating the system *without* its hardening mechanisms, and separately evaluating the hardening mechanisms *themselves*, the result is much stronger *defense-in-depth*.

### Harden the deployed environment and infrastructure {#harden-the-deployed-environment-and-infrastructure}

Organizations need to focus on security basics and harden their organization’s environment and infrastructure. What organizations must do isn’t new, but it has a new sense of urgency.

Several government cyber security agencies recommended the following practical actions:

1. “Reduce your attack surface: Limit unnecessary system access and external connectivity. Challenge whether systems need to be exposed at all and isolate those that do not.  
2. Accelerate patching processes: AI is shortening the time between vulnerability discovery and exploitation. Delays in patching increase risk, especially for operational systems with long update cycles. Prioritise security updates accordingly to manage risks.  
3. Address legacy systems: Unsupported systems are easy targets. They are not just technical debt, they are strategic liabilities.  
4. Review and strengthen identity and access controls: Limit who can access critical systems. Enforce strong authentication and regularly review permissions.  
5. Prepare for incidents before they happen: Test response plans, train and prepare teams, and assume breaches will occur. Focus on fast containment and recovery.” \[[FiveEyes2026](https://www.cyber.gov.au/sites/default/files/2026-06/Five%20eyes%20cyber%20security%20agencies%20statement.pdf)\]”

Other basics include “segmentation, egress filtering, multifactor authentication, and defense-in-depth/breadth all increase the difficulty for attackers… the basics remain valid and can be prioritized for risks that can’t be easily mitigated.  Implement egress filtering (it blocked every public log4j exploit). Enforce deep segmentation and zero trust where possible.  Lock down your dependency chain. Mandate phishing-resistant MFA for all privileged accounts. Every boundary increases attacker cost…. \[minimize\] base operating system images, or replacing third-party libraries with framework primitives as they emerge over time” can reduce an organization’s attack surface, and AI can help implement this \[[CSA2026](https://labs.cloudsecurityalliance.org/mythos-ciso/)\].

Many recommendations focus on identity. Cloudstrike reports, “identity sits at the center of this problem. Many successful attacks do not end with the initial exploit. They become dangerous when they allow an adversary to assume a trusted identity, obtain credentials, or abuse excessive privileges. That means prevention is no longer just about patching. It requires a commitment to continuous identity, transforming the security posture of all identities (human, non-human, and AI) from a point-in-time decision into a real-time control system. It includes enforcing zero standing privileges, continuously verifying access, limiting credential exposure, and connecting identity posture to endpoint and workload context in Real-time.” \[Crowdstrike2026-FiveSteps\]

Attackers may still manage to slip in. Logging/internal telemetry, offline backups, and having a Continuity of Operations Plan (COOP) are as vital as ever.

All of this requires continuously testing organizations’ security assumptions. “Controls that look strong on paper may fail in practice. Segmentation may not be enforced consistently. Privileged access may be broader than expected. Exposure management must become dynamic, evidence-based, and specific to the environment.” \[Crowdstrike2026-FiveSteps\]

However, there’s no need to *panic*. All of this was true before AI, it’s simply more important to *execute*. Instead of hiding, respond. What’s more, even the most advanced AI models cannot simply create vulnerabilities where none exist. As Red Hat’s Gunnar Hellekson notes, “context renders many bugs useless \[and\] some ‘vulnerabilities’ identified by AI are actually functionality bugs with no meaningful exploit path. Many issues \[are low risk\] because the affected \[components are rarely exposed to the internet\].” \[[Hellekson2026](https://www.redhat.com/en/blog/navigating-mythos-haunted-world-platform-security)\] In short, AI may find many “vulnerabilities” as defined by some document, but if you act in a timely manner, many won’t be significant in your context.

# Call to action {#call-to-action}

AI is changing things, including security. This doesn’t mean it’s time to panic. It means it’s time to work.

AI can be used to help find and fix vulnerabilities. What’s more, over time AI can help software developers make software with so few vulnerabilities that they will be incredibly difficult to subvert. Software developers, and those who work with them, have an opportunity to make the world a much more secure place.

Let’s get started.

# TODO {#todo}

??? NOTE: Need to include examples throughout.

# Acknowledgements

We wish to thank all contributors and reviewers, including Georg Kunz, Ryan Jennings, Santosh Kumar Puppala.

# Bibliography {#bibliography}

* \[0xkato2024\] 0xkator, 2024-12-01, Get ready for an audit, [https://www.0xkato.xyz/Get-ready-for-an-audit/](https://www.0xkato.xyz/Get-ready-for-an-audit/)  
* \[0xkato2026\] 0xkator, 2026-06-01, “How LLMs Actually Work”, [https://www.0xkato.xyz/how-llms-actually-work/](https://www.0xkato.xyz/how-llms-actually-work/)  
* \[Ahmad2026\] Ahman Osman, 2026, Anthropic's War on Opensource AI, [https://x.com/TheAhmadOsman/status/2065307070044234186](https://x.com/TheAhmadOsman/status/2065307070044234186)  
* \[Aniszczyk2026\] Aniszczyk, Chris (CNCF), David A. Wheeler (OpenSSF), Christopher “CRob” Robinson (OpenSSF), 2026-05, “Securing Open Source in the Age of AI”, [https://openssf.org/resources/securing-open-source-in-the-age-of-ai-a-practical-guide/](https://openssf.org/resources/securing-open-source-in-the-age-of-ai-a-practical-guide/)  
* \[Anthropic2026-04g\] Anthropic, 2026-04, “Project Glasswing: Securing critical software for the AI era”, [https://www.anthropic.com/glasswing](https://www.anthropic.com/glasswing)  
* \[Anthropic2026-03\] Anthropic, 2026-03-06, “Partnering with Mozilla to improve Firefox’s security”, [https://www.anthropic.com/news/mozilla-firefox-security](https://www.anthropic.com/news/mozilla-firefox-security)  
* \[Anthropic2026-04s\] Anthropic, 2026-04-07 (actually 2026-04-08), “System Card: Claude Mythos Preview”, [https://www-cdn.anthropic.com/08ab9158070959f88f296514c21b7facce6f52bc.pdf](https://www-cdn.anthropic.com/08ab9158070959f88f296514c21b7facce6f52bc.pdf)  
* \[Anthrophic2026-06-15-Export-Control\] Anthropic, 2026-06-15, Statement on the US government directive to suspend access to Fable 5 and Mythos 5, [https://www.anthropic.com/news/fable-mythos-access](https://www.anthropic.com/news/fable-mythos-access)  
* \[Anthropic2026-05\] Anthropic, “Project Glasswing: An initial update”, 2026-05-22, [https://www.anthropic.com/research/glasswing-initial-update](https://www.anthropic.com/research/glasswing-initial-update)  
* \[Anthropic-07-27\] Anthropic, 2026-07-27, Our position on open-weights models, [https://www.anthropic.com/news/position-open-weights-models](https://www.anthropic.com/news/position-open-weights-models)  
* \[Anthropic2026-08-21\] Anthropic, 2026-08-21, Bringing the cybersecurity capabilities of Claude Mythos 5 to more defenders, [https://claude.com/blog/bringing-claude-mythos-5-to-more-defenders](https://claude.com/blog/bringing-claude-mythos-5-to-more-defenders)  
* \[Berkeley\] Berkeley Vulnerability Initiative, [https://vuln.cs.berkeley.edu/](https://vuln.cs.berkeley.edu/)  
* \[Bourzikas2026\] Bourzikas, Grant, 2026-05-18, “Project Glasswing: what Mythos showed us” [https://blog.cloudflare.com/cyber-frontier-models/](https://blog.cloudflare.com/cyber-frontier-models/)  
* \[Bressers2025\] Bressers, Josh, and Joshua Rogers, 2025-10-13, “Actually finding vulnerabilities using AI with Joshua Rogers”, Open Source Security Podcast, [https://opensourcesecurity.io/2025/2025-10-ai-joshua-rogers/](https://opensourcesecurity.io/2025/2025-10-ai-joshua-rogers/)  
* \[Buttell2026\] Amy Buttell, 2026-04-04, AI Code Risks Escalate: The use of AI coding tools continues to accelerate even as trust declines and risks proliferate, [https://cacm.acm.org/news/ai-code-risks-escalate/](https://cacm.acm.org/news/ai-code-risks-escalate/)  
* \[Carlini2026\] Nicholas Carlini, Newton Cheng, Keane Lucas, Michael Moore, Milad Nasr, Vinay Prabhushankar, Winnie Xiao, et al, 2026-04-07, “Assessing Claude Mythos Preview’s cybersecurity capabilities”, [https://red.anthropic.com/2026/mythos-preview/](https://red.anthropic.com/2026/mythos-preview/)  
* \[Carlini2026-youtube\] Nicholas Carlini, 2026, “Black-hat LLMs”, \[un\]prompted 2026” [https://www.youtube.com/watch?v=1sd26pWhfmg\&t=316s](https://www.youtube.com/watch?v=1sd26pWhfmg&t=316s)  
* \[Carlini2026-02\] Carlini et al, 2026-02-05, “Evaluating and mitigating the growing risk of LLM-discovered 0-days”, [https://red.anthropic.com/2026/zero-days/](https://red.anthropic.com/2026/zero-days/)  
* \[Chrome2026\] Chrome Security Team, 2026-07-30, Stronger with every update: How we’re making Chrome and the web safer in the AI Era, [https://blog.google/security/chrome-stronger-with-every-update/](https://blog.google/security/chrome-stronger-with-every-update/)  
* \[Catanzaro2026\] Michael Catanzaro, 2026-06-08, [https://blogs.gnome.org/mcatanzaro/2026/06/08/please-do-not-ban-ai-assisted-issue-reports/](https://blogs.gnome.org/mcatanzaro/2026/06/08/please-do-not-ban-ai-assisted-issue-reports/)  
* \[Chia2026\] Osmond Chia and Laura Cress, 2026-06-31, Anthropic's Claude AI escapes to hack into three organisations, BBC, [https://www.bbc.com/news/articles/cz7dl7w8y7po](https://www.bbc.com/news/articles/cz7dl7w8y7po)  
* \[CloudFlare\] CloudFlare, “Can AI find vulnerabilities?”, [https://www.cloudflare.com/the-net/ai-vulnerabilities/](https://www.cloudflare.com/the-net/ai-vulnerabilities/)  
* \[CloudStrike2026-Global\] CloudStrike, 2026, “CloudStrike 2026: Global Threat Report: Year of the Evasive Adversary”, [https://go.crowdstrike.com/2026-global-threat-report.html](https://go.crowdstrike.com/2026-global-threat-report.html)  
* \[Crowdstrike2026-FiveSteps\] Crowdstrike. 2026\. Five Steps for Frontier AI Security Readiness.  
* \[CSA2026\] CSA CISO Community, SANS, \[un\]prompted, OWASP Gen AI Security Project and the wider community (and many contributing authors), 2026, “The “AI Vulnerability Storm”: Building a “Mythos-ready” Security Program”, [https://labs.cloudsecurityalliance.org/mythos-ciso/](https://labs.cloudsecurityalliance.org/mythos-ciso/)  
* \[Cycode2026\] Cycode Team, 6 Steps to be Mythos Ready: How to Prepare for the AI Vulnerability Storm, 2026-05-20, [https://cycode.com/blog/claude-mythos-security-readiness/](https://cycode.com/blog/claude-mythos-security-readiness/)  
* \[Diecks2026\] Diecks, Jeff, 2026-04-02, “From AIxCC to OpenSSF: Welcoming OSS-CRS to Advance AI Driven”, [https://openssf.org/blog/2026/04/02/from-aixcc-to-openssf-welcoming-oss-crs-to-advance-ai-driven-open-source-security/](https://openssf.org/blog/2026/04/02/from-aixcc-to-openssf-welcoming-oss-crs-to-advance-ai-driven-open-source-security/)  
* \[Dinaburg2026\] Artem Dinaburg, 2026-08-26, VMs won't contain cyber-capable agents, Trail of Bits, [https://blog.trailofbits.com/2026/08/26/vms-wont-contain-cyber-capable-agents/](https://blog.trailofbits.com/2026/08/26/vms-wont-contain-cyber-capable-agents/)  
* \[Dominus2026-03-05\] Mark Dominus, 2026-03-05, Documentation is a message in a bottle, [https://blog.plover.com/tech/gpt/documentation-wins.html](https://blog.plover.com/tech/gpt/documentation-wins.html)  
* \[Dominus2026-03-09\] Mark Dominus, 2026-03-09, “Programmers will document for Claude, but not for each other”, Blog post, [https://blog.plover.com/tech/gpt/documentation-wins-2.html](https://blog.plover.com/tech/gpt/documentation-wins-2.html)  
* \[Donnelly2026\] Donnelly, Tommy, 2026-04-15, “AI Is Finding Vulnerabilities Faster Than You Can Patch Them. Now What?” [https://www.amplifiersecurity.com/blog/ai-vulnerability-management-mythos](https://www.amplifiersecurity.com/blog/ai-vulnerability-management-mythos)  
* \[FiveEyes2026\] Five Eyes, 2026-06-22, Five Eyes cyber security agencies statement, [https://www.cyber.gov.au/sites/default/files/2026-06/Five%20eyes%20cyber%20security%20agencies%20statement.pdf](https://www.cyber.gov.au/sites/default/files/2026-06/Five%20eyes%20cyber%20security%20agencies%20statement.pdf)  
* \[Grinstead2026-03\] Grinstead, Brian, Christian Holler, 2026-03-06, “Hardening Firefox with Anthropic’s Red Team” [https://blog.mozilla.org/en/firefox/hardening-firefox-anthropic-red-team/](https://blog.mozilla.org/en/firefox/hardening-firefox-anthropic-red-team/)  
* \[Grinstead2026-05\] Grinstead, Brian, Christian Holler, Frederik Braun, 2026-05-07, “Behind the Scenes Hardening Firefox with Claude Mythos Preview”, [https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/](https://hacks.mozilla.org/2026/05/behind-the-scenes-hardening-firefox/)  
* \[Harzevili2024\] Nima Shiri Harzevili, Alvine Boaye Belle, Junjie Wang, Song Wang, Zhen Ming (Jack) Jiang, and Nachiappan Nagappan. 2024\. “A Systematic Literature Review on Automated Software Vulnerability Detection Using Machine Learning.” ACM Comput. Surv. 57, 3, Article 55 (Nov. 2024), 36 pages. [https://doi.org/10.1145/3699711](https://doi.org/10.1145/3699711)  
* \[Hellekson2026\] Gunnar Hellekson et al, 2026-04-08, “Navigating the Mythos-haunted world of platform security”, [https://www.redhat.com/en/blog/navigating-mythos-haunted-world-platform-security](https://www.redhat.com/en/blog/navigating-mythos-haunted-world-platform-security)  
* \[Holderhoff2026\] Holterhoff, Kate, 2026-05-05, “I Slop & the Vulnerability Treadmill”, [https://redmonk.com/kholterhoff/2026/05/05/ai-slop-vulnerability-treadmill/](https://redmonk.com/kholterhoff/2026/05/05/ai-slop-vulnerability-treadmill/)  
* \[Holley2026\] Bobby Holley, 2026-04-21, “The zero-days are numbered”, [https://blog.mozilla.org/en/privacy-security/ai-security-zero-day-vulnerabilities/](https://blog.mozilla.org/en/privacy-security/ai-security-zero-day-vulnerabilities/)  
* \[Hoodlet2026\] Keith Hoodlet, 2026-08-06, Vulnerability patches still require expert human review, [https://1password.com/blog/why-ai-generated-patches-still-require-human-review](https://1password.com/blog/why-ai-generated-patches-still-require-human-review)  
* \[HuggingFace2026\] Hugging Face, 2026-07-16, Security incident disclosure — July 2026, [https://huggingface.co/blog/security-incident-july-2026](https://huggingface.co/blog/security-incident-july-2026)  
* \[Karbasi2026\] Amin Karbasi, Supriti Vijay, Aman Priyanshu, Didier Chapoteau, Arthur Goldblatt, Kimia Majd, Fraser Burch, Jianliang He, Baturay Saglam, Takahiro Matsumoto, Zhuoran Yang, 2026-06-21, Introducing Antares: Highly Efficient Open Weight AI Models for Vulnerability Localization, [https://blogs.cisco.com/ai/introducing-antares-the-most-efficient-open-weight-ai-models-for-vulnerability-localization](https://blogs.cisco.com/ai/introducing-antares-the-most-efficient-open-weight-ai-models-for-vulnerability-localization)  
* \[Kholoosi\] M. Mehdi Kholoosi, Triet Huynh Minh Le, M. Ali Babar, 2025-12-23, “Software Vulnerability Management in the Era of Artificial Intelligence: An Industry Perspective”, [https://arxiv.org/abs/2512.18261v2](https://arxiv.org/abs/2512.18261v2)  
* \[Kovacs2026-08-24\] Eduard Kovacs, 2026-08-24, Anthropic Expands Mythos 5 Access to More Defenders, Unveils $35M Open Source Fund, [https://www.securityweek.com/anthropic-expands-mythos-5-access-to-more-defenders-unveils-35m-open-source-fund/](https://www.securityweek.com/anthropic-expands-mythos-5-access-to-more-defenders-unveils-35m-open-source-fund/)  
* \[Kwa2025\] Thomas Kwa, Ben West, Joel Becker, Amy Deng, Katharyn Garcia, Max Hasin, Sami Jawhar, Megan Kinniment, Nate Rush, Sydney Von Arx, Ryan Bloom, Thomas Broadley, Haoxing Du, Brian Goodrich, Nikola Jurkovic, Luke Harold Miles, Seraphina Nix, Tao Lin, Neev Parikh, David Rein, Lucas Jun Koba Sato, Hjalmar Wijk, Daniel M. Ziegler, Elizabeth Barnes, Lawrence Chan, 2026-02-25, “Measuring AI Ability to Complete Long Software Tasks”, [https://arxiv.org/abs/2503.14499](https://arxiv.org/abs/2503.14499)  
* \[Kwa2025-blog\] Thomas Kwa, Ben West, Joel Becker, et al., 2025-03-19, [https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/](https://metr.org/blog/2025-03-19-measuring-ai-ability-to-complete-long-tasks/)  
* \[Larson2026\] Seth Larsen, 2026-02-24, Respecting maintainer time should be in security policies, [https://sethmlarson.dev/respecting-maintainer-time-should-be-in-security-policies](https://sethmlarson.dev/respecting-maintainer-time-should-be-in-security-policies)   
* \[Licklider1960\] J. C. R. “Lick” Licklider, 1960-03, Man-Computer Symbiosis, IRE Transactions on Human Factors in Electronics, volume HFE-1, pages 4-11, [https://groups.csail.mit.edu/medg/people/psz/Licklider.html](https://groups.csail.mit.edu/medg/people/psz/Licklider.html)  
* \[Li2017\] Yue Li, Xiao Li, Hao Wu, Minghui Xu, Yue Zhang, Xiuzhen Cheng, Fengyuan Xu, Sheng Zhong, 201707 and republished 2025-04-18, Everything You Wanted to Know About LLM-based Vulnerability Detection But Were Afraid to Ask, [https://arxiv.org/abs/2504.13474v1](https://arxiv.org/abs/2504.13474v1)  
* \[LowLevel2026\] Low Level, 2026, “Mythos has been unleashed (we have results)” \[video\], [https://www.youtube.com/watch?v=IS4OgH74gY4](https://www.youtube.com/watch?v=IS4OgH74gY4)  
* \[Microsoft2026-07\] Microsoft, 2026-07-24, Open Weights and American AI Leadership, [https://www.microsoft.com/en-us/corporate-responsibility/topics/open-weight/](https://www.microsoft.com/en-us/corporate-responsibility/topics/open-weight/)  
* \[Mierczuk2026\] Axel Mierczuk, Spencer Michaels, and Keith Hoodlet, 2026, Frontier Models’ Vulnerability Patches are Often F.L.A.W.E.D.: Fix-Like Artifacts With Embedded Defects: Common failure modes of LLM-generated security patches, [https://1password.com/files/resources/frontier-models-vulnerability-patches-flawed.pdf](https://1password.com/files/resources/frontier-models-vulnerability-patches-flawed.pdf)  
* \[Nesbitt2026-06\] Andrew Nesbitt, 2026-06-25, Scrutineer: scanning open source without flooding maintainers, [https://nesbitt.io/2026/06/25/scrutineer.html](https://nesbitt.io/2026/06/25/scrutineer.html)  
* \[NPR2026\] Huo Jingnan, 2026-04-11, How AI is getting better at finding security holes, [https://www.npr.org/2026/04/11/nx-s1-5778508/anthropic-project-glasswing-ai-cybersecurity-mythos-preview](https://www.npr.org/2026/04/11/nx-s1-5778508/anthropic-project-glasswing-ai-cybersecurity-mythos-preview)  
* \[NVIDIA2026\] NVIDIA, 2026, Industry Leaders Unite in Open Secure AI Alliance for AI Safety and Security, [https://blogs.nvidia.com/blog/open-secure-ai-alliance/](https://blogs.nvidia.com/blog/open-secure-ai-alliance/)  
* \[OpenAI2026-07\] OpenAI, 2026-07-21, OpenAI and Hugging Face partner to address security incident during model evaluation, [https://openai.com/index/hugging-face-model-evaluation-security-incident/](https://openai.com/index/hugging-face-model-evaluation-security-incident/)  
* \[OpenSSF2026-06\] Open Source Security Foundation (OpenSSF) Best Practices Working Group, 2026-06-30, Compiler Options Hardening Guide for C and C++, [https://best.openssf.org/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C++.html](https://best.openssf.org/Compiler-Hardening-Guides/Compiler-Options-Hardening-Guide-for-C-and-C++.html)  
* \[Oshungboye\] Oshungboye, Damilola, UNK-04-22, “How to use AI to identify and fix security vulnerabilities in your codebase”, CodeRabbit, [https://dev.to/coderabbitai/how-to-use-ai-to-identify-and-fix-security-vulnerabilities-in-your-codebase-4na2](https://dev.to/coderabbitai/how-to-use-ai-to-identify-and-fix-security-vulnerabilities-in-your-codebase-4na2)  
* \[Ottenheimer2026-05-26\] David Ottenheimer, 2026-05-26, Mythos Grading Mythos: Got Patches Yet?, [https://www.flyingpenguin.com/mythos-grading-mythos-got-patches-yet/](https://www.flyingpenguin.com/mythos-grading-mythos-got-patches-yet/)  
* \[OWASP2025-AITesting\] OWASP, 20265-11-26, OWASP AI Testing Guide, [https://owasp.org/www-project-ai-testing-guide/](https://owasp.org/www-project-ai-testing-guide/)  
* \[OWASP-GenAI\] OWASP GenAI Security Project, [https://genai.owasp.org/](https://genai.owasp.org/)  
* \[Pardesi2026-08-05\] Rajveer Pardesi and Mrinmay Dey, 2026-08-05, Meta AI model hacks another company during testing, Reuters, [https://www.reuters.com/technology/metas-ai-model-hacked-another-company-during-testing-information-reports-2026-08-05/](https://www.reuters.com/technology/metas-ai-model-hacked-another-company-during-testing-information-reports-2026-08-05/)  
* \[PSF2026\] Python Software Foundation (PSF), 2026-06-17, “Everything Security at PyCon US 2026”, [https://pyfound.blogspot.com/2026/06/everything-security-at-pycon-us-2026.html](https://pyfound.blogspot.com/2026/06/everything-security-at-pycon-us-2026.html)  
* \[Reuters2026-08-07\] Reuters, 2026-08-07, Chinese startup Moonshot's AI model breaks out of testing environment, researchers say, [https://www.reuters.com/legal/litigation/chinese-startup-moonshots-ai-model-breaks-out-testing-environment-researchers-2026-08-07/](https://www.reuters.com/legal/litigation/chinese-startup-moonshots-ai-model-breaks-out-testing-environment-researchers-2026-08-07/)  
* \[Rohlf2025\] Rohlf, Chris, 2025-08-04, AI and the Software Vulnerability Lifecycle  
* \[Rogers2025\] Rogers, Joshua, 2025, “Hacking with AI SASTs: An overview of 'AI Security Engineers' / 'LLM Security Scanners' for Penetration Testers and Security Teams”, [https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters](https://joshua.hu/llm-engineer-review-sast-security-ai-tools-pentesters)  
* \[Safdar2025\] Rijha Safdar, Danyail Mateen, Syed Taha Ali, Umer Ashfaq and Wajahat Hussain, 2025, “Data and Context Matter: Towards Generalizing AI-based Software Vulnerability Detection”, [https://arxiv.org/abs/2508.16625v2](https://arxiv.org/abs/2508.16625v2)  
* \[Shimmi2025\] Shimmi, Samiha, Hamed Okhravi, Mona Rahimi, 2025-06-12, “AI-Based Software Vulnerability Detection: A Systematic Literature Review”  
* \[Shein2026\] Esther Shein, 2026-06-03, Investing in Workers to Work with AI: Training encourages workers to utilize AI tools to their fullest and allays fears AI will replace them, [https://cacm.acm.org/news/investing-in-workers-to-work-with-ai/](https://cacm.acm.org/news/investing-in-workers-to-work-with-ai/)  
* \[Shostack2014\] Adam Shostack, 2014, Threat Modeling: Designing for Security.  
* \[Silverman2024\] Silverman, Micah, 2024-10-14, “Automatically fix code vulnerabilities with AI” [https://snyk.io/blog/automatically-fix-code-vulnerabilities-ai/](https://snyk.io/blog/automatically-fix-code-vulnerabilities-ai/)  
* \[Steenhook2025\] Benjamin Steenhoek, Kalpathy Sivaraman, Renata Saldivar Gonzalez, Yevhen Mohylevskyy, Roshanak Zilouchian Moghaddam, Wei Le, 2025-04-25, “Closing the Gap: A User Study on the Real-world Usefulness of AI-powered Vulnerability Detection & Repair in the IDE”, [https://arxiv.org/abs/2412.14306v3](https://arxiv.org/abs/2412.14306v3)  
* \[Stenberg2026-05a\] Stenberg, Daniel, 2026-05-11, “Mythos finds a curl vulnerability”, [https://daniel.haxx.se/blog/2026/05/11/mythos-finds-a-curl-vulnerability/](https://daniel.haxx.se/blog/2026/05/11/mythos-finds-a-curl-vulnerability/)  
* \[Stenberg2026-05b\] Stenberg, Daniel, 2026-05, LinkedIn post,  
* \[Trail of Bits\] Introducing Patch the Planet   
* \[Vaughan-Nichols\] Vaughan-Nichols, Stephen J., 2026-02-15, “cURL’s Daniel Stenberg: AI slop is DDoSing open source: For open source software, AI is very much a mixed blessing in his view.” [https://thenewstack.io/curls-daniel-stenberg-ai-is-ddosing-open-source-and-fixing-its-bugs/](https://thenewstack.io/curls-daniel-stenberg-ai-is-ddosing-open-source-and-fixing-its-bugs/)  
* \[vanZyl\] van Zyl, Leon, “Claude Code: Build an AI Agent That Finds Vulnerabilities” (video),   
* \[Walsh2026\] Joe Walsh, 2026-08-02, CEO of AI firm Hugging Face calls last month's hack by OpenAI model "very weird and unprecedented", CBS News, [https://www.cbsnews.com/news/hugging-face-hack-openai-rogue-model/](https://www.cbsnews.com/news/hugging-face-hack-openai-rogue-model/)  
* \[Wheeler2025\] David A. Wheeler, 2025, Secure AI/ML-Driven Software Development (LFEL1012), [https://training.linuxfoundation.org/express-learning/secure-ai-ml-driven-software-development-lfel1012/](https://training.linuxfoundation.org/express-learning/secure-ai-ml-driven-software-development-lfel1012/)  
* \[Wheeler2026\] David A. Wheeler, 2026-01-05, AI, Software Development, Security, Tips, and the Future (Part 2), OpenSSF Blog  
* \[Wolff2026\] Dylan Wolff, Martin Mirchev, and Abhik Roychoudhury, 2026-05-12, Large Language Models in Software Security Analysis: LLMs can help tame the complexity at the root of many of today's software security challenges, Communications of the ACM (CACM) June 2026 Vol 69 No. 6, pp 60-67, [https://cacm.acm.org/research/large-language-models-in-software-security-analysis/](https://cacm.acm.org/research/large-language-models-in-software-security-analysis/)  
* \[Veracode\] Veracode, “What is AI Code Remediation?” [https://www.veracode.com/security/what-is-ai-code-remediation/](https://www.veracode.com/security/what-is-ai-code-remediation/)  
* \[Yan2026\] Written by Eugene Yan and Henna Dattani, et al, 2026-05-27, “Using LLMs to secure source code”, Claude (Anthropic) Blog, [https://claude.com/blog/using-llms-to-secure-source-code](https://claude.com/blog/using-llms-to-secure-source-code)  
* \[ZeroDayClock\] Zero Day Clock (website). [https://zerodayclock.com/](https://zerodayclock.com/) especially https://zerodayclock.com/collapse  
* \[Zhang2024\] Yuntong Zhang, Haifeng Ruan, Zhiyu Fan, Abhik Roychoudhury, 2024, AutoCodeRover: Autonomous Program Improvement, [https://arxiv.org/abs/2404.05427](https://arxiv.org/abs/2404.05427)  
* \[Zhang2026\]  Cen Zhang, Younggi Park, Fabian Fleischer, Yu-Fu Fu, Jiho Kim, Dongkwan Kim, Youngjoon Kim, Qingxiao Xu, Andrew Chin, Ze Sheng, Hanqing Zhao, Michael Pelican, David J. Musliner, Jeff Huang, Jon Silliman, Mikel Mcdaniel, Jefferson Casavant, Isaac Goldthwaite, Nicholas Vidovich, Matthew Lehman, Taesoo Kim, 2026-05-29, “SoK: DARPA's AI Cyber Challenge (AIxCC): Competition Design, Architectures, and Lessons Learned”, [https://arxiv.org/abs/2602.07666](https://arxiv.org/abs/2602.07666)  
* \[Ziegler2026\] Ziegler, Albert, 2026-05-12, “Mythos for Offensive Security: XBOW's Evaluation” [https://xbow.com/blog/mythos-offensive-security-xbow-evaluation](https://xbow.com/blog/mythos-offensive-security-xbow-evaluation)  
* \[Zimmer2026\] Derek Zimmer, 2026-06-16, Private Interview of Derek Zimmer by David A. Wheeler

[image1]: <data:image/png;base64,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>