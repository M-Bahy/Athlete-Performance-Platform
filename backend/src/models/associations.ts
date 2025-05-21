import Athlete from './athlete';
import Video from './video';
import PerformanceMetric from './performance-metric';

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

Video.hasMany(PerformanceMetric, {
  foreignKey: 'videoId',
  as: 'performanceMetrics',
  onDelete: 'CASCADE'
});

PerformanceMetric.belongsTo(Video, {
  foreignKey: 'videoId',
  as: 'video'
});

export { Athlete, Video, PerformanceMetric };