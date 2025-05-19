import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface AthleteAttributes {
  id: number;
  name: string;
  sport: string;
  team?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Athlete extends Model<AthleteAttributes> implements AthleteAttributes {
  public id!: number;
  public name!: string;
  public sport!: string;
  public team!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Athlete.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sport: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    team: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'athletes',
  }
);

export default Athlete;