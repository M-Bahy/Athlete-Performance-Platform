import Athlete from './athlete';
import Video from './video';

// Define associations
Athlete.hasMany(Video, {
  foreignKey: 'athleteId',
  as: 'videos',
  onDelete: 'CASCADE'
});

Video.belongsTo(Athlete, {
  foreignKey: 'athleteId',
  as: 'athlete'
});

export { Athlete, Video };