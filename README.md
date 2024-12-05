# Creation and Customization of Graphical Notations without Programming: A Universal Diagram Editor

<p align="center">
    <img src="https://github.com/mikailcengizz/universal-diagram-editor/blob/main/DTU_logo.png" alt="DTU Logo" width="50">
</p>

This repository contains the implementation of my master's thesis project in collaboration with the **Technical University of Denmark (DTU)**. The goal of this project is to develop a **Universal Diagram Editor** that enables easy creation and customization of graphical notations and their use in a diagram editor, serving to both graphical notation developers and diagram creators.

## Author

- **Name**: Mikail Cengiz
- **University**: Technical University of Denmark (DTU)
- **Supervisor**: Ekkart Kindler

## Project Overview

This project leverages **Model-Based Systems Engineering (MBSE)** principles to allow the creation of custom graphical notations. The editor is designed to:

1. Enable graphical notation developers to define graphical notations.
2. Support diagram creators in creating models using these notations through a user-friendly interface.

Key concepts include:

- **Meta-Modeling:** Using Ecore-based metamodels to structure graphical notations.
- **Dynamic Diagram Editor:** Dynamic editor that support updates to graphical notations without having the editor's codebase re-generated.
- **Customizability:** Allowing users to define syntax, semantics, and visual appearances of modeling languages.

## Features

- Support for defining graphical notations based on the Ecore meta-metamodel.
- Mapping of meta-models to digram editor to support dynamic modifications to the metamodel.
- Export of diagram models.

## Repository Structure

📁 back/ # Node.js + TypeScript backend for API and DB services

📁 front/ # React + TypeScript frontend implementation for the diagram editor

📁 docs/ # Thesis documentation (LaTeX files)

📁 ./ 📄 README.md # This README file 📄 LICENSE # License file

## Setup

The setup instructions for both the frontend and backend are provided in their respective `README.md` files located in the `front/` and `back/` directories.

## Documentation

- **Thesis Report**: Available under `docs/`.

## License

This project is licensed under the Apache License. See the `LICENSE` file for details.

## Acknowledgments

- **Ekkart Kindler** for his guidance and supervision throughout this project.

---

For any questions or further information, feel free to reach out to me via email mikailcengiz@live.dk.
