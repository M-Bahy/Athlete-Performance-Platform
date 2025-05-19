import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Athlete from './athlete';

interface VideoAttributes {
  id: number;
  title: string;
  filePath: string;
  athleteId: number;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Video extends Model<VideoAttributes> implements VideoAttributes {
  public id!: number;
  public title!: string;
  public filePath!: string;
  public athleteId!: number;
  public notes!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Video.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filePath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    athleteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Athlete,
        key: 'id',
      },
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'videos',
  }
);

Video.belongsTo(Athlete, { foreignKey: 'athleteId' });
Athlete.hasMany(Video, { foreignKey: 'athleteId' });

export default Video;