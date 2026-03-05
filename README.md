# Lexicon Vault

Welcome to **Lexicon Vault**!\
This repository contains a **Vite-based React application** designed to
help users organize and manage their English vocabulary in a clean and
structured way.

Lexicon Vault allows users to store words alphabetically, add meanings
and example sentences, and use AI to generate summarized explanations
and usage examples.

## Table of Contents

-   Introduction\
-   Project Structure\
-   Installation\
-   Development\
-   Features\
-   Ignored Folders\
-   Contributing\
-   License

------------------------------------------------------------------------

## Introduction

**Lexicon Vault** is a vocabulary management application built with
**React and Vite**. It is designed for learners who want to keep their
vocabulary organized while also having space to store meanings, notes,
and example sentences.

The app groups words by **English alphabet (A--Z)**, making it easier to
browse and manage vocabulary.

Additionally, the app integrates **AI-powered assistance** that can
generate:

-   summarized explanations\
-   example sentences\
-   synonyms\
-   usage tips for each word

This makes it easier for learners to understand and remember words in
context.

------------------------------------------------------------------------

## Project Structure

The repository is organized into the following directories:

-   `website` -- Contains the React frontend for the vocabulary
    interface.\
-   `backend` -- Contains backend services for data storage and AI
    integration (if used).

Typical frontend components may include:

-   Alphabet list view\
-   Word list by letter\
-   Word detail view\
-   Word form for CRUD operations

------------------------------------------------------------------------

## Installation

### 1. Clone the Repository

``` sh
git clone https://github.com/your-username/lexicon-vault
```

### 2. Navigate to Project Root

``` sh
cd lexicon-vault
```

### 3. Install Dependencies

``` sh
npm install
```

------------------------------------------------------------------------

## Development

To start the development server:

``` sh
npm run dev
```

The app will run locally on:

    http://localhost:5173

------------------------------------------------------------------------

## Features

### Alphabetical Word Organization

-   Main screen displays letters **A--Z**
-   Words are automatically grouped by their starting letter

### Word Management (CRUD)

Users can:

-   Add new vocabulary words\
-   View word details\
-   Edit existing words\
-   Delete words

Each word entry can contain:

-   Word\
-   Meaning\
-   Example sentence\
-   Personal notes

### AI Assistance

Users can generate AI-powered content for any word, including:

-   summarized explanation\
-   example sentences\
-   synonyms\
-   usage tips

AI-generated content can be edited and saved by the user.

------------------------------------------------------------------------

## Ignored Folders

The following folders are excluded from version control via
`.gitignore`:

-   `/node_modules` -- Project dependencies\
-   `/website/dist` -- Production build output\
-   `/backend/dist` -- Backend build output\
-   `.env` -- Environment variables

------------------------------------------------------------------------

## Contributing

Contributions to **Lexicon Vault** are welcome!

If you'd like to improve the project:

-   open an issue for bugs or suggestions\
-   submit a pull request with improvements or new features

------------------------------------------------------------------------
