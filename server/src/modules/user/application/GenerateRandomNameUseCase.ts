export class GenerateRandomNameUseCase {
  private static ADJECTIVES = [
    'Neon',
    'Glitch',
    'Pixel',
    'Retro',
    'Turbo',
    'Cyber',
    'Quantum',
    'Hyper',
    'Flash',
    'Digital',
    'Sonic',
    'Laser',
    'Static',
    'Chrome',
    'Mega',
  ]

  private static ANIMALS = [
    'Axolotl',
    'Fox',
    'Wolf',
    'Shark',
    'Panda',
    'Falcon',
    'Tiger',
    'Dolphin',
    'Cobra',
    'Eagle',
    'Mammoth',
    'Raptor',
    'Bison',
    'Owl',
    'Kraken',
  ]

  execute(): string {
    const adj =
      GenerateRandomNameUseCase.ADJECTIVES[
        Math.floor(Math.random() * GenerateRandomNameUseCase.ADJECTIVES.length)
      ]
    const animal =
      GenerateRandomNameUseCase.ANIMALS[
        Math.floor(Math.random() * GenerateRandomNameUseCase.ANIMALS.length)
      ]

    return `${adj} ${animal}`
  }
}
