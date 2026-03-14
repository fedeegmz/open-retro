---
name: create-use-case
description: Build new use cases or update existing ones.
---

# Create Use Case Skill

When creating a new use case, follow these steps:
- Create a file at “/src/<module>/application/useCases/<NewUseCase.ts>”
- Create a class with the name of the use case.
- Add dependencies in the constructor (they must always belong to the application or domain layer)
- Implement the “execute” method; if many parameters are needed, use a DTO.

If you need to create a DTO, follow these steps:
- Create a file in “/src/<module>/application/dtos/<NewDTO.ts>”
- Create a “NewDTO” interface with the necessary attributes
