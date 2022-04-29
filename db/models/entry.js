import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Entry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

  Entry.init({
    messageText: DataTypes.STRING(2000),
    messageMedia: DataTypes.BLOB("long"),
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Entry',
  });

  return Entry;
};
