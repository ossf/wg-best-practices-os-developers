# Simplest Possible Process (SPP) for Publishing Documentation

*by the [Open Source Security Foundation (OpenSSF)](https://openssf.org), 2025-03-19*

This document describes the "Simplest Possible Process" (SPP),
a process for publishing nice-looking static results on a website
using GitHub-hosted repositories.

In the SPP, the materials are maintained using GitHub
and deployed as simple static pages using
[GitHub Pages](https://pages.github.com/):

1. Each GitHub repository uses
   [GitHub Pages](https://pages.github.com/) to regenerate and serve
   its static web pages results whenever its `main` branch is changed
   (typically using files in markdown format in its `docs` subdirectory).
2. Each repository's results are accessed using a separate DNS subdomain
   (e.g., <https://best.openssf.org>).
3. When documents are published in this format, consider applying
   the [tips](#tips) below. In particular, please
   include a (publication) date in `YYYY-MM-DD` format
   in their contents, and *update* that during content changes.
   If the document is a draft, *clearly* indicate that.

This document is written primarily for use by
technical contributors to the
[Open Source Security Foundation (OpenSSF)](https://openssf.org),
but others are free to use it.

{:toc}

## Background

The Open Source Security Foundation (OpenSSF) produces many results,
some of which should be published in a nice-looking easily-consumed format.
However, it has been unclear how to publish the final results.
[David A. Wheeler](https://dwheeler.com) considered the options
and proposed using this SPP (see the [rationale](#rationale-for-the-spp))
unless there was some reason the process wouldn't work.
The Best Practices Working Group experimented with the SPP and found
it helpful to them.

As a result, the OpenSSF TAC declared on
2023-06-27 that any OpenSSF working group, SIG, or project is
welcome to use this SPP if they determined that it met their needs
([minutes](https://docs.google.com/document/d/18BJlokTeG5e5ARD1VFDl5bIP75OFPCtzf77lfadQ4f0/edit#heading=h.2aalagtx9xzh),
[TAC issue 176](https://github.com/ossf/tac/issues/176)).
The OpenSSF staff will implement this for an OpenSSF repository,
but only on request (to avoid unnecessary work).
See the section [One-time setup](#one-time-setup).

## Tips

Here are a few tips for using a repository that is using the SPP.
Try to be consistent. Special configurations are possible,
but things are easier to maintain if all pages use the same approach.

Organize your repository's subdirectories.
Choose upper and lower case carefully,
since paths are case-sensitive.
Directory and file names with spaces are supported
but not recommended, because the
resulting URLs look odd (space becomes `%20`).

In most cases, documents should be in markdown format for ease of editing.
All markdown (`.md`) files will be converted into HTML (`.html`) files;
you can omit the trailing `.html` when accessing them using a web browser.

When using markdown:

* If the document is a draft, *clearly* indicate that.
* We recommend including `markdownlint` in your CI/CD, possibly configured
  specially, to detect and prevent problems ahead of time.
* Try to limit yourself
  to de facto [CommonMark](https://commonmark.org/) where reasonable.
* However, feel free to use HTML directly within markdown where
  necessary or less confusing.
  Also, you can use [kramdown](https://kramdown.gettalong.org/)
  extensions when CommonMark isn't enough; see
  [markdown kramdown tips and tricks](https://about.gitlab.com/blog/2016/07/19/markdown-kramdown-tips-and-tricks/#the-magic)
  for a summary.
* Begin with a single H1 heading (`#`) with its title.
  This makes it easy to generate a correct document title in the metadata.
  In the following paragraph (after a blank line),
  include a line with *AUTHOR, YYYY-MM-DD*, like this:
  `*by the [Open Source Security Foundation (OpenSSF)](https://openssf.org) [Best Practices Working Group](https://best.openssf.org/), 2023-06-14*`
* Update the publication date when you change the material in the main branch.
  We suggest making date updates a separate pull request (to reduce
  the number of merge conflicts that need to be resolved).
* Use `##` headings for logical Heading1 entries,
  `###` for logical Heading2 entries, and so on.
  Each heading name should be unique (so the generated ids are unique).
  You can reference any heading via its ID, e.g., `[text](#ID)`.
  Here is the [algorithm for determining header IDs](https://kramdown.gettalong.org/converter/html.html).
* If you don't want certain headings to be auto-numbered, after the heading
  line add a line saying `{:.nocount}` to make the heading part of that class.
  To suppress TOC entries append the line `{:.no_toc}` after that heading.
* If you want a table-of-contents, use `:toc` surrounded by curly braces
  on its own line.
* By default, [GitHub Pages](https://pages.github.com/) uses the
  [Jekyll engine](https://jekyllrb.com/docs/) for generating web pages.
  By default, Jekyll uses [`kramdown`](https://kramdown.gettalong.org/)
  to process markdown and the
  [`Minima` Jekyll template](https://github.com/jekyll/minima).
  Thus, the [kramdown cheatsheet](https://dieghernan.github.io/chulapa-101/cheatsheets/02-kramdown-cheat-sheet) may be helpful.

When you are creating a new markdown document, you
should begin with a
[YAML front matter block](https://jekyllrb.com/docs/front-matter/)
surrounded by triple-dashed lines,
at least to provide a description (this will be included in metadata
sent to users). E.g.:

~~~~markdown
---
description: "This document ..."
---
~~~~

If you don't want to include a YAML front matter block (e.g., because
people are directly looking at the markdown file), you can instead
include this information in the repository file `_config.yml`.

Once changes are checked into the `main` branch they are eligible
for regeneration, which generally doesn't take long.
You can see its status from a repository by clicking on *Actions*
and looking at its workflow run.

## One-time setup

The SPP requires a one-time setup for each repository.
Here's how to do that:

1. *Create a docs subdirectory*. While optional, we recommend
   creating a `docs` subdirectory in the repository root directory.
   Move all documents that might eventually
   be published into this `docs` subdirectory (e.g., `git mv`).
   This way, only materials intended to be eventually published will be
   included.
   Do *not* wait until the documents are final before putting them in `docs`;
   it's important to be able to review and fix formatting bugs ahead of time.
   Instead, don't create hyperlinks to those materials claiming
   they are final releases.
2. *Set up GitHub Pages for the repository*.
   At the main repository page select *Settings*.
   Select *Code and automation/Pages*. Under *Build and deployment* select
   *Deploy from a branch* using branch `main` and folder `/docs`, then save.
   Under *custom domain* enter your custom domain (e.g., `best.openssf.org`)
   and select Save; this will create a file named `CNAME` in the root directory.
3. *Configure DNS*. Change the DNS setting for the
   (new) domain name (e.g., `best.openssf.org`) so its `CNAME` points
   to `ossf.github.io` (the *organization* GitHub site).
   Note that *every* repository of an organization uses the same `CNAME`
   for this particular setting, and *not* the name of the specific repository.
   GitHub instead uses the CNAME file in your repository to figure out
   exactly which repository will be used. OpenSSF members
   can just email `operations` at `openssf.org`;
   Linux Foundation employees can send the request to
   [LF support](https://support.linuxfoundation.org) or more specifically
   [Domains &amp; DNS](https://jira.linuxfoundation.org/plugins/servlet/theme/portal/2).
   After a little while, TLS (`https:`) will be ready!
4. *Configure the repository*.
   Copy some configuration files to make the results look pretty, mainly
   the file `./_config.yml` and directories `_includes/` and `assets/`.
   These must start at the `docs` directory if you use a `docs`
   directory.
   The directories (e.g., `_includes/`) can override a template's file
   simply by creating another file with the same name in the same place.
   We intend to add more about doing this in the future.
   For now, you can use the OpenSSF Best Practices WG as a demonstration.
   This is already configured to comply with the
   [OpenSSF Brand Guidelines](https://openssf.org/about/brand-guidelines/)
   such as our preferred fonts and color scheme.
5. Add an `index.md` file inside the `docs/` directory with at least
   a little content (possibly linking to important materials).
   Without this file (or similar `index.html`), viewing the top-level
   domain will present the confusing and technically incorrect error
   page saying "There isn't a GitHub Pages site here."

## Rationale for the SPP

### Problem

Using the GitHub repository interface as the *sole* mechanism
for distributing results has many drawbacks.
It shows readers lots of
irrelevant text (e.g., the GitHub source repo interface), we cannot control
its formatting (so the results look ugly),
the URLs aren't related to our (`openssf.org`) domain,
most metadata (such as the description) is wrong, and search engines
are likely to give it low scores (because it's "just a random page
on GitHub"). For an example of this "ugly" view, see the
GitHub repository view of the
[Guide to implementing a coordinated vulnerability disclosure process for open source projects](https://github.com/ossf/oss-vulnerability-guide/blob/main/maintainer-guide.md).
The GitHub repository interface is *great* when making changes, but not
for sharing final document results.

There are practically infinite ways to publish results on a website.
This abundance of choices was part of the problem of *picking*
any particular way to publish results.
This is especially a challenge for us,
because many participants in the OpenSSF
can understand and implement complex workflows
if the situation calls for it.

### How the SPP was identified

On 2023-06-06, the OpenSSF Best Practices Working Group (WG)
re-raised the problem that
the OpenSSF lacked a good process for publishing results to a website.
This was recorded as [Best Practices WG issue 158, Revamp publishing of guides such as concise guides & scm guide](https://github.com/ossf/wg-best-practices-os-developers/issues/158).

OpenSSF staff quickly developed and deployed an experimental solution.
The overall approach to selecting the SPP
has been to find the "easiest way to do it" (given our current state)
and to prefer system defaults
(e.g., using default GitHub Pages with its default site generation
process (Jekyll), markdown processors (kramdown) and default template (Minima).
In short,
the "simplest possible process" (SPP) focuses on trying to work *with*
existing tools & minimize what needs to be done:

1. The easiest way to *generate* web pages suitable for publication,
   if you already have markdown on GitHub in a repo as we do, is to
   enable GitHub Pages on that repo. This means that any change to the
   repo's main branch will immediately trigger recreating those pages
   and only the pages in *that* repo. The results rapidly deploy, since
   the trigger is known and a relatively small number of pages are
   regenerated. Making the results "pretty" requires adding a few files
   in a trivial way and can be done incrementally.
2. The easiest way to make those GitHub Pages *viewable* is to assign
   a subdomain to every repo, e.g., `best.openssf.org` for the Best
   Practices WG. This involves easy one-time actions (in particular, add a DNS
   record and configure GitHub Pages to use that DNS entry). GitHub
   will automatically get TLS certificates, so we securely serve
   web pages (using https).

This is not only easy to set up, but it's also easy to use.
Contributors can simply use git and GitHub as usual,
and the updates are quickly
published once they are merged into the `main` branch.

You can see the results in the
[Concise Guide for Developing More Secure Software](https://best.openssf.org/Concise-Guide-for-Developing-More-Secure-Software).
Notice that its URL is
<https://best.openssf.org/Concise-Guide-for-Developing-More-Secure-Software>.
We think the new results look much better than the
[old view of the Concise Guide for Developing More Secure Software](https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Concise-Guide-for-Developing-More-Secure-Software.md),
whose URL was the much uglier
<https://github.com/ossf/wg-best-practices-os-developers/blob/main/docs/Concise-Guide-for-Developing-More-Secure-Software.md>
You can see similar positive results in the
[Concise Guide for Evaluating Open Source Software](https://best.openssf.org/Concise-Guide-for-Evaluating-Open-Source-Software).

Of course, we didn't create this process as a new concept.
Many other organizations already use this kind of process.
GitHub implemented these mechanisms, and this is how they're
intended to be used.
However, we had an overwhelming number of alternatives, so
we needed to identify and name a specific approach.

Experimentation in the Best
Practices Working Group showed this process, the SPP,
was enough for most of our simple use cases.

### Alternatives

There are *so* many other ways to generate pages,
but they all add complexity that seems unnecessary for most of our use cases:

* We can write workflows that push data to other places, but then
  we need to write that code and manage the keys.
* We can write workflows that gather the data, but then we need to
  write that code, and these typically have significant deployment
  delays because they're often periodic and would handle much more data.
* There are additional operational complications if we try to put everything
  in the domain openssf.org, which is currently a WordPress instance.
  We would then have to synchronize these systems.

The SPP cannot meet all needs; in particular, it's not enough if you
need a dynamic site.
In those cases, the relevant group will need to use something else.

### Advantages of the SPP

Here are the advantages of the SPP compared to other approaches
for generating a static site:

* The results look nice and are relatively easy to reconfigure.
* It has good search engine results (it's not just "another page on GitHub"
  and we can serve the *correct* metadata values).
* OpenSSF participants don't need to change how they work
  (just keep using GitHub for version control).
* This approach works *with* the tools instead of *against* the tools.
* Page regeneration is trivial to trigger (it's automatically handled
  by GitHub), and the regeneration is fast
  (because there are relatively few pages to regenerate).
* They are all under `*.openssf.org`, making it clear to all (including search
  engines) that these are results from the OpenSSF.
* Static sites avoid many of the security issues of dynamic sites
  and provides results more quickly to users.

Once set up, these web pages are quickly and automatically updated
once the repo's main branch is updated. The source materials are
version-controlled, and the contributors can simply
"work as they've always worked".

### Non-problems

Some potential issues have been noted, but we believe
we have adequate solutions:

1. *Common CSS*. If many repos use this approach,
   it would be a pain to have to update each one individually to
   update the CSS if that happens.
   The "obvious" solution is to have a repo for just the CSS,
   and then have all other OpenSSF repos include that CSS.
   Then there would be one place to update CSS.
   If we have that many repos, we can implement this, and
   change each publishing repo to use it.
2. *Abandoned domain names*. If a repo is deleted,
   we also need to delete the repo entry.
   Repo deletion is rare (we've never done it in the first
   3 years of the OpenSSF),
   so we think this could be handled as part of a manual process.
   In short, if someone is going to delete a repo serving
   GitHub Pages and has a `CNAME` entry, we need to delete its DNS name first.
   We could also automate checking for dangling DNS entries if we wanted to
   (that would be good anyway).
3. *Changing later*. If the SPP later turns out to be insufficient,
   the group can switch to another process and automatically redirect
   requesters to their new locations (where appropriate).
   We couldn't automatically redirect requesters when they
   directly used the pages on the GitHub repo site,
   so when people stop using the SPP, using the SPP will still be a win.
4. *Many subdomains*.
   A side-effect of SPP is that every repo using SPP has
   own subdomain, e.g., `best.openssf.org` for the Best Practices WG.
   This may create many subdomains (a WG might have several repos
   that publish, not just one).
   David A. Wheeler doesn't view that as a drawback,
   as such subdomain names are *obviously* part of OpenSSF.
   When certificates cost money those extra domains were a real problem,
   but with Let's Encrypt this isn't an issue.
   The OpenSSF staff only plans to take the one-time SPP steps
   by request, so staff will only need to take those steps
   if someone intends to use the SPP.
5. *Moving to another forge*.
   We have no plans and no reason to stop using GitHub.
   If we did move, however, the key components that implement this process
   (the [Jekyll engine](https://jekyllrb.com/docs/),
   the [`kramdown`](https://kramdown.gettalong.org/) markdown processor, and the
   [`Minima` Jekyll template](https://github.com/jekyll/minima))
   are all OSS, and we could reconstitute them elsewhere.
   Even if they weren't, we could use other similar tools instead,
   as these tools just convert markdown to HTML and post the results.
6. *Publication dates*. As currently implemented, the SPP does not
   automatically add publication dates. There are Jekyll
   plug-ins we could use to create publication dates, but installing them
   is complex and probably not worth it. For now, we ask that
   groups just include the date in the document being published.
   While groups could occasionally forget to update them,
   this also means that the date will be robustly included in the file itself
   once it is updated. We expect people will easily understand
   when they need to update a simple date.
7. *Sharing before official release*. It's important to see
   documents while they're being initially developed. Those documents can
   be shared this way and marked as drafts.

## Limitations

The SPP only generates static websites.
You can serve JavaScript, but that doesn't work when
users will not execute client-side JavaScript.
If you want a truly dynamic website running server-side code,
the SPP is inadequate, and groups should look for a different solution.

However, many of our groups serve simple static documents;
a simple process like the SPP should serve them well.

## To be done

The OpenSSF Best Practices WG has various configuration files.
We should "clean up" those files to make it easier for others
to reuse them.
