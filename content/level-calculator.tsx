const levels = [
  200, 400, 600, 800, 1000, 1200, 1400, 1600, 1800, 2000, 2200, 2400, 2600, 2800, 3000, 3200, 3400, 3600, 3800, 4000,
  4200,
];

export const getLevelByExperience = (experience: number) => {
  let level = 0;
  let experienceInLevel = 0;
  let levelTotalExperience = 0;
  let remainingExperience = experience;
  for (let i = 0; i < levels.length; i++) {
    levelTotalExperience = levels[i];
    if (remainingExperience >= levels[i]) {
      level = i + 1;
      remainingExperience -= levels[i];
    } else {
      experienceInLevel = remainingExperience;
      break;
    }
  }

  console.log("experience", experience);
  console.log("level", level);
  console.log("experienceInLevel", experienceInLevel);
  console.log("levelTotalExperience", levelTotalExperience);

  return {
    level: level + 1,
    experienceInLevel,
    levelTotalExperience,
  };
};
