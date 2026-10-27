# Notice — Fork attribution and source policy

This repository is a personal enhancement fork of [LibreSpark/LibreTV](https://github.com/LibreSpark/LibreTV).

## Upstream attribution

- Upstream project: `LibreSpark/LibreTV`
- Enhancement fork: `xixiliFruit/LibreTV`
- License: GNU AGPL-3.0
- The original project and its contributors retain their original copyright and attribution.
- This fork does not present itself as the official LibreTV repository or an official release of the upstream maintainers.

## Current fork enhancements

This fork currently adds or adjusts features including:

- source-bound video favorites;
- remembered search-source failures / source selection;
- quieter source-failure notifications;
- TV remote / directional-key navigation and focus handling;
- related usability changes for personal NAS / TV deployment.

## Source policy

The public repository must not embed, maintain, curate, or distribute VOD, IPTV, TVBox, Apple CMS, M3U, or similar media-source URLs whose copyright / distribution authorization cannot be reasonably verified.

For this fork:

1. Unknown or copyright-unclear media-source URLs are **not** committed as built-in defaults.
2. Documentation examples should use placeholders such as `example.com`, or services whose purpose and authorization can be reasonably verified.
3. Media sources configured privately by a deployer are the deployer's own configuration and do not imply endorsement, authorization, or verification by the upstream project or this fork.
4. If the authorization status of a media source is uncertain, the default decision for the public repository is **do not include it**.
5. No privately supplied source list should be copied into this public repository merely for convenience.

## Network use and source availability

This fork remains licensed under GNU AGPL-3.0. The corresponding modified source is publicly available in this repository for users who interact with a deployed modified version over a network.

## Content responsibility

LibreTV is software providing generic search, aggregation, and playback functionality. The software license does not grant rights to third-party films, television programs, streams, playlists, APIs, artwork, or metadata. Deployers should only configure sources they are entitled to access or use and should comply with applicable law and the terms of those sources.
