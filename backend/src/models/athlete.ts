import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database';

interface AthleteAttributes {
  id?: number;
  name: string;
  sport: string;
  age: number;
}

class Athlete extends Model<AthleteAttributes> implements AthleteAttributes {
  public id!: number;
  public name!: string;
  public sport!: string;
  public age!: number;
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
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'athletes',
  }
);

export default Athlete;