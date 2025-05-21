import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Video from './video';

interface PerformanceMetricAttributes {
  id?: number;
  videoId: number;
  metricType: string;  // e.g. 'sprint_time', 'jump_height'
  value: number;
  timestamp: number;  // timestamp in seconds within the video
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class PerformanceMetric extends Model<PerformanceMetricAttributes> implements PerformanceMetricAttributes {
  public id!: number;
  public videoId!: number;
  public metricType!: string;
  public value!: number;
  public timestamp!: number;
  public notes!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

PerformanceMetric.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    videoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Video,
        key: 'id',
      },
    },
    metricType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'performance_metrics',
  }
);

export default PerformanceMetric;
