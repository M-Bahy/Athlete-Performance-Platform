import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';
import Athlete from './athlete';

interface VideoAttributes {
  id?: number;
  title: string;
  filePath: string;
  athleteId: number;
  notes?: string;
  duration?: number;  // in seconds
  fileSize?: number;  // in bytes
  uploadDate: Date;
  mimeType?: string;
  createdAt?: Date;
  updatedAt?: Date;
  analysisStatus?: string; // Added for analysis status
}

class Video extends Model<VideoAttributes> implements VideoAttributes {
  public id!: number;
  public title!: string;
  public filePath!: string;
  public athleteId!: number;
  public notes!: string;
  public duration!: number;
  public fileSize!: number;
  public uploadDate!: Date;
  public mimeType!: string;
  public analysisStatus!: string; // Added for analysis status
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
    duration: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fileSize: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    uploadDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    analysisStatus: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'videos',
  }
);

export default Video;