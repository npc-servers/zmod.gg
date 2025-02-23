const gamemodes = {
    homigrad: {
        id: 'homigrad',
        name: 'HOMIGRAD',
        shortDescription: 'Immerse yourself in a high-stakes world of deception and survival, where every round brings unique modifiers that transform the classic detective experience',
        fullDescription: `A unique take on the classic detective gameplay where every round brings new challenges and modifiers. 
        Players must use their wit and skills to survive, deceive, and uncover the truth in this high-stakes environment.`,
        image: 'assets/gamemodes/homigrad.png',
        features: [
            'Dynamic round modifiers',
            'Role-based gameplay',
            'Strategic deception mechanics',
            'Unique weapon system'
        ],
        isActive: true
    },
    sandbox: {
        id: 'sandbox',
        name: 'Sandbox',
        shortDescription: 'Forge your destiny in our reimagined sandbox world, where classic creation meets the thrill of zombie survival and the intense mechanics of Rust',
        fullDescription: `A revolutionary blend of classic sandbox freedom with survival elements. 
        Build, craft, and survive in a world where creativity meets challenge.`,
        image: 'assets/gamemodes/sandbox.jpg',
        features: [
            'Advanced building system',
            'Survival mechanics',
            'PvP and PvE elements',
            'Economy system'
        ],
        isActive: true
    },
    horde: {
        id: 'horde',
        name: 'Horde',
        shortDescription: 'Master unique classes and unlock powerful perks as you battle through relentless waves of the undead in this adrenaline-fueled survival experience',
        fullDescription: `Face endless waves of increasingly difficult enemies while developing your character through a deep progression system. 
        Choose your class, master your abilities, and survive against all odds.`,
        image: 'assets/gamemodes/horde.jpg',
        features: [
            'Multiple character classes',
            'Deep progression system',
            'Wave-based challenges',
            'Unique boss fights'
        ],
        isActive: true
    }
};

export default gamemodes; 