# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview
A static, SEO-optimized affiliate content site targeting low-competition long-tail keywords to drive organic traffic and earn passive income from affiliate links and ads.

## Goals
- Publish 50 SEO-friendly articles
- Generate $50/mo in affiliate commissions
- Scale to $500/mo through additional articles or sites

## Features
- Static site with MDX content and metadata
- GPT-powered script to generate affiliate articles
- Keyword plan spreadsheet (CSV)
- ProductBox and ComparisonTable React components
- Auto-generated sitemap and robots.txt

## Requirements
- Next.js + App Router + TypeScript
- Markdown/MDX-based content
- GPT integration for content generation
- Deployment via Vercel
- Affiliate link tracking and click analytics
- Internal linking engine (manual or scripted)

## Non-goals
- No user authentication or CMS dashboard
- No dynamic content (comments, user submissions, etc.)
- No paid traffic (100% SEO-based)

## Development Commands

- **Start development server**: `npm run dev` (uses Turbopack for faster builds)
- **Build for production**: `npm run build`
- **Start production server**: `npm start`
- **Lint code**: `npm run lint`

## Architecture Overview

This is a Next.js 15 affiliate marketing site that displays MDX-based articles comparing products. The architecture follows these patterns:

### Content Management
- **Content storage**: MDX files in `/content/` directory with frontmatter metadata
- **Post processing**: `lib/posts.tsx` handles file system operations using `gray-matter` for frontmatter parsing
- **MDX compilation**: `lib/mdx.ts` uses `@mdx-js/mdx` and `next-mdx-remote` for server-side rendering

### Routing Structure
- **Homepage** (`app/page.tsx`): Lists all articles using `getAllPostMeta()`
- **Article pages** (`app/[slug]/page.tsx`): Dynamic routes that render individual MDX content using `getPostBySlug()`
- **Layout** (`app/layout.tsx`): Uses Geist fonts and Tailwind CSS

### Key Dependencies
- **Content**: `gray-matter`, `next-mdx-remote`, `@mdx-js/mdx`
- **Styling**: Tailwind CSS v4 with PostCSS
- **Framework**: Next.js 15 with React 19 and TypeScript

### File Structure Patterns
- Content files use frontmatter with: `title`, `description`, `slug`, `date`
- Post metadata is typed as `PostMeta` interface in `lib/posts.tsx`
- MDX files should be placed in `/content/` directory with `.mdx` extension

## TypeScript Configuration
- Uses strict mode with modern ES2017 target
- Path aliases: `@/*` maps to root directory
- Configured for Next.js with JSX preservation